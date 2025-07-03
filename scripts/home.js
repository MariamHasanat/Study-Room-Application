// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
import {
    doc,
    updateDoc,
    arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
    renderSubjectsAndTotalTimeLocalFirst,
    renderSubjectsAndTotalTimeFirestore,
} from "./subject-list.js";
import { addSubjectClickListener } from "./subject-utils.js";
import { formatTime } from "./time-utils.js";
import { setGreeting } from "./greeting.js";
import { setupLogout } from "./logout.js";

// Load user data from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "../pages/login.html";
}

const heading = document.querySelector(".user-name");
if (heading) heading.innerHTML = currentUser.displayName;

// Greeting logic
const greetingDiv = document.querySelector(".header-greeting");
setGreeting(greetingDiv, { name: currentUser.displayName });

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
    const subjectName = document
        .getElementById("subject-name-input")
        .value.trim();

    if (!subjectName) {
        alert("Please enter a subject name.");
        return;
    }

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", currentUser.uid); // Use email as the document ID
        await updateDoc(userRef, {
            subjects: arrayUnion({ name: subjectName, time: "00:00:00" }),
        });

        // Update Local Storage
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects.push({ name: subjectName, time: "00:00:00" });
        localStorage.setItem("subjects", JSON.stringify(subjects));

        // Update UI
        const newSubject = document.createElement("li");
        newSubject.className = "subject-info";
        newSubject.innerHTML = `
            <span class="color">
                <span class="material-symbols-outlined">play_arrow</span>
            </span>
            <span class="subject-name">${subjectName}</span>
            <span class="subject-time">00:00:00</span>
        `;
        subjectList.appendChild(newSubject);

        // Add click event to the new subject (modular version)
        addSubjectClickListener(
            newSubject,
            subjectName,
            database,
            sanitizeEmail
        );

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
    return email.replace(/\./g, ",");
}

// Fetch and render subjects from localStorage first, then Firestore
window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    const subjectListElem = document.getElementById("subject-list");
    const totalTimeElem = document.querySelector(".total-time-value");
    const emptyStateElem = document.getElementById("empty-state");
    const userRef = doc(firestore, "users", currentUser.uid);
    renderSubjectsAndTotalTimeLocalFirst(
        subjectListElem,
        totalTimeElem,
        emptyStateElem,
        renderSubjectsAndTotalTimeFirestore,
        [
            subjectListElem,
            totalTimeElem,
            (li, name) =>
                addSubjectClickListener(li, name, database, sanitizeEmail),
            formatTime,
            userRef,
            localStorage,
            loader,
            emptyStateElem,
        ]
    );
});

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);
