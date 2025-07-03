// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { renderSubjectsAndTotalTimeLocalFirst, renderSubjectsAndTotalTimeFirestore, updateTotalTimeUI } from './subject-list.js';
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
const totalTimeElem = document.querySelector(".total-time-value"); // عنصر عرض الوقت الكلي

// Show add form
addSubjectBtn.addEventListener("click", () => {
    addSubjectForm.classList.remove("hidden");
    formOverlay.style.display = "block";
});

// Hide add form
cancelBtn.addEventListener("click", () => {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
});
formOverlay.addEventListener("click", () => {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
});

function sanitizeEmail(email) {
    return email.replace(/\./g, ',');
}

export async function updateSubjects(subjects) {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    const userRef = doc(firestore, "users", userData.email);
    try {
        await updateDoc(userRef, { subjects });
    } catch (error) {
        console.error("Error occured while updating subject: ", error);
    }
    updateTotalTimeUI(totalTimeElem, subjects);
}

// Add Subject Functionality
addBtn.addEventListener("click", async () => {
    const subjectName = document.getElementById("subject-name-input").value.trim();
    if (!subjectName) {
        alert("Please enter a subject name.");
        return;
    }

    try {
        const userRef = doc(firestore, "users", userData.email);
        await updateDoc(userRef, {
            subjects: arrayUnion({ name: subjectName, time: "00:00:00" })
        });

        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects.push({ name: subjectName, time: "00:00:00" });
        localStorage.setItem("subjects", JSON.stringify(subjects));

        const newSubject = document.createElement("li");
        newSubject.className = "subject-info";
        newSubject.innerHTML = `
            <span class="color">
                <span class="material-symbols-outlined">play_arrow</span>
            </span>
            <span class="subject-name">${subjectName}</span>
            <span class="subject-time">00:00:00</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        subjectList.appendChild(newSubject);

        addSubjectClickListener(newSubject, subjectName, database, userData, sanitizeEmail);

        // Edit Subject Functionality
        const editBtn = newSubject.querySelector(".edit-btn");
        editBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            const timeSpan = newSubject.querySelector(".subject-time");
            const currentTime = timeSpan.textContent || "00:00:00";

            const newTime = prompt("Enter new time (HH:MM:SS)", currentTime);

            if (newTime && /^\d{2}:\d{2}:\d{2}$/.test(newTime)) {
                timeSpan.textContent = newTime;

                let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
                const subjIndex = subjects.findIndex(sub => sub.name === subjectName);
                if (subjIndex !== -1) {
                    subjects[subjIndex].time = newTime;
                }
                updateSubjects(subjects);

            } else if (newTime !== null) {
                alert("Please enter time in the format HH:MM:SS");
            }
        });

        // Delete Subject Functionality
        const deleteBtn = newSubject.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", async (event) => {
            event.stopPropagation();

            subjectList.removeChild(newSubject);

            let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
            subjects = subjects.filter(subject => subject.name !== subjectName);

            await updateSubjects(subjects);

            if (subjectList.children.length === 0) {
                const emptyState = document.getElementById("empty-state");
                if (emptyState) emptyState.style.display = "block";
            }
        });

        const emptyState = document.getElementById("empty-state");
        if (emptyState) emptyState.style.display = "none";

        updateTotalTimeUI(totalTimeElem, subjects);

        document.getElementById("subject-name-input").value = "";
        addSubjectForm.classList.add("hidden");
        formOverlay.style.display = "none";

    } catch (error) {
        console.error("Error adding subject to Firestore: ", error);
        alert("Failed to add subject. Please try again.");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    const subjectListElem = document.getElementById("subject-list");
    const emptyStateElem = document.getElementById("empty-state");
    const userRef = doc(firestore, "users", userData.email);

    renderSubjectsAndTotalTimeLocalFirst(
        subjectListElem,
        totalTimeElem,
        emptyStateElem,
        renderSubjectsAndTotalTimeFirestore,
        [
            subjectListElem,
            totalTimeElem,
            (li, name) => addSubjectClickListener(li, name, database, userData, sanitizeEmail),
            formatTime,
            userRef,
            localStorage,
            loader,
            emptyStateElem
        ],
        addSubjectClickListener
    );
});

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);
