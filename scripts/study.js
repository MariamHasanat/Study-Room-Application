// Import Firebase SDK
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
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

// Parse URL parameters to extract subject name
const urlParams = new URLSearchParams(window.location.search);
const subjectName = urlParams.get("subject");

// Display subject title
const subjectTitleElement = document.getElementById("subject-title");
subjectTitleElement.textContent = subjectName || "Unknown Subject";


// Timer Variables
let startTime = Date.now();
let timerInterval;

// Get start time from Realtime Database when the page loads
window.addEventListener("load", async () => {
    try {
        const userSubjectRef = ref(realTimeDb, `users/${userData.email}/subjects/${subjectName}`);
        const snapshot = await get(userSubjectRef);

        console.log(snapshot);
        if (snapshot.exists()) {
            startTime = snapshot.val().startTime; // Assuming startTime is stored in the database
        } else {
            startTime = Date.now(); // Fallback to current time if not found in DB
        }
    } catch (error) {
        console.error("Error getting start time from Realtime Database: ", error);
    }
});

// Function to store end time when stop button is clicked
function stopTimer() {
    const endTime = Date.now();
    try {
        const userSubjectRef = ref(realTimeDb, `users/${userData.email}/subjects/${subjectName}`);
        set(userSubjectRef, {startTime: startTime, endTime: endTime}).then(() => {
            // Redirect to home page after saving the end time
            window.location.href = "../pages/home.html"; // Change to your home page route
        });
    } catch (error) {
        console.error("Error storing end time in Realtime Database: ", error);
        alert("Failed to save subject activity. Please try again.");
    }
}

// Function to format elapsed time
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Start Timer
const studyTimerElement = document.getElementById("study-timer");
timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    studyTimerElement.textContent = formatTime(elapsedTime);
}, 1000);

// Stop Study Button Event
document.getElementById("stop-study-btn").addEventListener("click", stopTimer);
