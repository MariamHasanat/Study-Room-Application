// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMOlVGRnfwTCa83YpF4gUpbYYMu4jMnBA",
    authDomain: "study-room-application.firebaseapp.com",
    projectId: "study-room-application",
    storageBucket: "study-room-application.firebasestorage.app",
    messagingSenderId: "102691908238",
    appId: "1:102691908238:web:b4d54c3fb01d5e0ca077df",
    measurementId: "G-DW46LFLGB3",
    databaseURL: "https://study-room-application-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realTimeDb = getDatabase(app);

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
        const userRef = doc(db, "users", userData.email); // Use email as the document ID
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

// Function to handle subject click events
function addSubjectClickListener(subjectElement, subjectName) {
    subjectElement.addEventListener("click", async () => {
        try {
            // Store timestamp in Realtime Database
            const timestamp = new Date().toISOString();
            const userSubjectRef = ref(realTimeDb, `users/${userData.email}/subjects/${subjectName}`);
            await set(userSubjectRef, { startTime: timestamp });

            // Redirect to study page with subject name as a query parameter
            window.location.href = `study.html?subject=${encodeURIComponent(subjectName)}`;
        } catch (error) {
            console.error("Error storing timestamp in Realtime Database: ", error);
            alert("Failed to log subject activity. Please try again.");
        }
    });
}

// Add click events to existing subjects
document.querySelectorAll(".subject-info").forEach(subjectElement => {
    const subjectName = subjectElement.querySelector(".subject-name").textContent.trim();
    addSubjectClickListener(subjectElement, subjectName);
});
