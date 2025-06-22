// Import Firebase SDK
import { app, firestore, database } from "./firebase-config.js";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { ref, set as setRTDB } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { updateTotalStudyTime } from "./totalTime.js";

// Load user data from local storage
const userData = JSON.parse(localStorage.getItem("userName"));
const heading = document.querySelector(".user-name");
heading.innerHTML = userData.name;

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

        // Add click event to the new subject
        addSubjectClickListener(newSubject, subjectName);

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

// Function to handle subject click events
function addSubjectClickListener(subjectElement, subjectName) {
    subjectElement.addEventListener("click", async () => {
        try {
            // Store timestamp in Realtime Database
            const timestamp = new Date().toISOString();
            const safeEmail = sanitizeEmail(userData.email);
            const userSubjectRef = ref(database, `users/${safeEmail}/subjects/${subjectName}`);
            await setRTDB(userSubjectRef, { startTime: timestamp });

            // Redirect to study page with subject name as a query parameter
            window.location.href = `study.html?subject=${encodeURIComponent(subjectName)}`;
        } catch (error) {
            console.error("Error storing timestamp in Realtime Database: ", error);
            alert("Failed to log subject activity. Please try again.");
        }
    });
}

// Fetch and render subjects from Firestore on page load
async function renderSubjects() {
    const userRef = doc(firestore, "users", userData.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const subjects = userSnap.data().subjects || [];
        subjectList.innerHTML = "";
        subjects.forEach(subj => {
            const li = document.createElement("li");
            li.className = "subject-info";
            li.innerHTML = `
                <span class="color">
                    <span class="material-symbols-outlined">play_arrow</span>
                </span>
                <span class="subject-name">${subj.name}</span>
                <span class="subject-time">${subj.time || "00:00:00"}</span>
            `;
            subjectList.appendChild(li);
            addSubjectClickListener(li, subj.name);
        });
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await renderSubjects();
    // Update total study time
    const userData = JSON.parse(localStorage.getItem("userName"));
    if (userData && userData.email) {
        await updateTotalStudyTime(userData.email);
    }
});

// Add click events to existing subjects
document.querySelectorAll(".subject-info").forEach(subjectElement => {
    const subjectName = subjectElement.querySelector(".subject-name").textContent.trim();
    addSubjectClickListener(subjectElement, subjectName);
});
