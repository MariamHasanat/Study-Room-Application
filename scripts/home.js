// Import Firebase SDK
import { app, firestore, database } from "./firebase-config.js";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { ref, set as setRTDB } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { updateTotalStudyTime } from "./totalTime.js";

// Load user data from local storage
const userData = JSON.parse(localStorage.getItem("userName"));
if (!userData || !userData.name || !userData.email) {
    window.location.href = "../pages/login.html";
}
const heading = document.querySelector(".user-name");
if (heading) heading.innerHTML = userData.name;

// Greeting logic
const greetingDiv = document.querySelector(".header-greeting");
if (greetingDiv && userData && userData.name) {
    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour < 12) greet = "Good morning";
    else if (hour < 18) greet = "Good afternoon";
    else greet = "Good evening";
    greetingDiv.textContent = `${greet}, ${userData.name} 👋🏆!`;
}

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

// Fetch and render subjects from localStorage first, then Firestore
function renderSubjectsAndTotalTimeLocalFirst() {
    // Try localStorage first for instant UI
    const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjectList.innerHTML = "";
    const emptyState = document.getElementById("empty-state");
    if (localSubjects.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }
    let totalMs = 0;
    localSubjects.forEach(subj => {
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
        // Calculate total time
        if (subj.time) {
            const parts = subj.time.split(":");
            if (parts.length === 3) {
                const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                totalMs += ms;
            }
        }
    });
    // Update total time in UI
    const totalTimeElement = document.querySelector(".total-time-value");
    if (totalTimeElement) {
        totalTimeElement.textContent = formatTime(totalMs);
    }
    // Then update from Firestore in background
    renderSubjectsAndTotalTimeFirestore();
}

window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    renderSubjectsAndTotalTimeLocalFirst();
});

async function renderSubjectsAndTotalTimeFirestore() {
    const userRef = doc(firestore, "users", userData.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const subjects = userSnap.data().subjects || [];
        subjectList.innerHTML = "";
        let totalMs = 0;
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
            // Calculate total time
            if (subj.time) {
                const parts = subj.time.split(":");
                if (parts.length === 3) {
                    const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                    totalMs += ms;
                }
            }
        });
        // Update localStorage with latest subjects
        localStorage.setItem("subjects", JSON.stringify(subjects));
        // Update total time in UI
        const totalTimeElement = document.querySelector(".total-time-value");
        if (totalTimeElement) {
            totalTimeElement.textContent = formatTime(totalMs);
        }
    }
    // Hide loader after data is ready
    const loader = document.getElementById("loader");
    if (loader) loader.classList.remove("active");
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("subjects");
        window.location.href = "../pages/login.html";
    });
}
