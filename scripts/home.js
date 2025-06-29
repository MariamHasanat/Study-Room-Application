// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"; // Added getDoc
import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"; // Added ref, set
import { renderSubjectsAndTotalTimeLocalFirst, renderSubjectsAndTotalTimeFirestore } from './subject-list.js';
import { addSubjectClickListener } from './subject-utils.js';
import { formatTime } from './time-utils.js';
import { setGreeting } from './greeting.js';
import { setupLogout } from './logout.js';

// Load user data from local storage
const userData = JSON.parse(localStorage.getItem("userName"));
if (!userData || !userData.name || !userData.email) {
    window.location.href = "../pages/login.html";
}
const heading = document.querySelector(".user-name");
if (heading) heading.innerHTML = userData.name;

// Greeting logic
const greetingDiv = document.querySelector(".header-greeting");
setGreeting(greetingDiv, userData);

// DOM Elements
const addSubjectBtn = document.getElementById("add-subject-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addBtn = document.getElementById("add-btn");
const addSubjectForm = document.getElementById("add-subject-form");
const formOverlay = document.getElementById("form-overlay");
const subjectList = document.getElementById("subject-list");

// Event Listeners
addSubjectBtn.addEventListener("click", () => {
    addSubjectForm.classList.remove("hidden");
    formOverlay.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
});

formOverlay.addEventListener("click", () => {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
});

// Add Subject Functionality
addBtn.addEventListener("click", async () => {
    const subjectName = document.getElementById("subject-name-input").value.trim();

    if (!subjectName) {
        alert("Please enter a subject name.");
        return;
    }

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", userData.email); // Use email as the document ID
        await updateDoc(userRef, {
            subjects: arrayUnion({ name: subjectName, time: "00:00:00" })
        });

        // Update Local Storage
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects.push({ name: subjectName, time: "00:00:00" });
        localStorage.setItem("subjects", JSON.stringify(subjects));

        // Re-render subjects to include the new one with all event listeners
        await refreshSubjectList(); // Call a function to re-render and attach listeners

        // Hide empty state image if visible
        const emptyState = document.getElementById("empty-state");
        if (emptyState) emptyState.style.display = "none";

        // Reset form and hide overlay
        document.getElementById("subject-name-input").value = "";
        addSubjectForm.classList.add("hidden");
        formOverlay.style.display = "none";

    } catch (error) {
        console.error("Error adding subject to Firestore: ", error);
        alert("Failed to add subject. Please try again.");
    }
});

function sanitizeEmail(email) {
    return email.replace(/\./g, ',');
}

// Function to delete a subject (Moved here for better scope)
async function deleteSubject(subjectName) {
    if (!confirm(`Are you sure you want to delete "${subjectName}"?`)) {
        return;
    }

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", userData.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            let subjects = userSnap.data().subjects || [];
            const updatedSubjects = subjects.filter(subj => subj.name !== subjectName);
            await updateDoc(userRef, { subjects: updatedSubjects });
        }

        // Update Local Storage
        let localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
        const updatedLocalSubjects = localSubjects.filter(subj => subj.name !== subjectName);
        localStorage.setItem("subjects", JSON.stringify(updatedLocalSubjects));

        // Remove from Realtime Database as well
        const safeEmail = sanitizeEmail(userData.email);
        const userSubjectRef = ref(database, `users/${safeEmail}/subjects/${subjectName}`);
        await set(userSubjectRef, null); // Remove the subject from Realtime Database

        // Re-render subjects to reflect deletion
        await refreshSubjectList();

        alert(`Subject "${subjectName}" deleted successfully.`);

    } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject. Please try again.");
    }
}

// Function to format time from HH:MM:SS to milliseconds
function timeStringToMs(timeString) {
    const parts = timeString.split(":");
    if (parts.length === 3) {
        return (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
    }
    return 0;
}

// Function to edit subject time
async function editSubjectTime(subjectName, currentElement) {
    const newTime = prompt("Enter new study time for " + subjectName + " (HH:MM:SS):", currentElement.textContent);

    if (newTime === null || newTime.trim() === "") {
        return; // User cancelled or entered empty string
    }

    // Basic format validation (e.g., 01:23:45)
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(newTime)) {
        alert("Invalid time format. Please use HH:MM:SS (e.g., 01:30:00).");
        return;
    }

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", userData.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            let subjects = userSnap.data().subjects || [];
            const updatedSubjects = subjects.map(subj => {
                if (subj.name === subjectName) {
                    return { ...subj, time: newTime };
                }
                return subj;
            });
            await updateDoc(userRef, { subjects: updatedSubjects });
        }

        // Update Local Storage
        let localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
        const updatedLocalSubjects = localSubjects.map(subj => {
            if (subj.name === subjectName) {
                return { ...subj, time: newTime };
            }
            return subj;
        });
        localStorage.setItem("subjects", JSON.stringify(updatedLocalSubjects));

        // Re-render subjects to reflect the updated time and total time
        await refreshSubjectList();

        alert("Study time updated successfully.");

    } catch (error) {
        console.error("Error updating subject time:", error);
        alert("Failed to update study time. Please try again.");
    }
}

// Centralized function to render and attach all listeners
async function refreshSubjectList() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    const subjectListElem = document.getElementById("subject-list");
    const totalTimeElem = document.querySelector(".total-time-value");
    const emptyStateElem = document.getElementById("empty-state");
    const userRef = doc(firestore, "users", userData.email);

    // This function will be passed to subject-list.js to attach all dynamic listeners
    const attachAllSubjectListeners = (liElement, subjectNameFromRender) => {
        // Attach play/study click listener
        addSubjectClickListener(liElement, subjectNameFromRender, database, userData, sanitizeEmail);

        // Attach delete click listener
        liElement.querySelector(".delete-subject-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents the parent li click from firing
            deleteSubject(subjectNameFromRender);
        });

        // Attach edit time click listener
        liElement.querySelector(".edit-time-btn").addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents the parent li click from firing
            const subjectTimeElement = liElement.querySelector(".subject-time");
            editSubjectTime(subjectNameFromRender, subjectTimeElement);
        });
    };

    renderSubjectsAndTotalTimeLocalFirst(
        subjectListElem,
        totalTimeElem,
        emptyStateElem,
        renderSubjectsAndTotalTimeFirestore,
        [
            subjectListElem,
            totalTimeElem,
            attachAllSubjectListeners, // Pass the combined listener function
            formatTime,
            userRef,
            localStorage,
            loader,
            emptyStateElem
        ]
    );
}

// Initial fetch and render when the page loads
window.addEventListener("DOMContentLoaded", refreshSubjectList);

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);