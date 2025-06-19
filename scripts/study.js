// Import Firebase SDK
import { get, ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { database } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { firestore } from "./firebase-config.js";

// Use shared database instance
const realTimeDb = database;

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

        if (snapshot.exists() && snapshot.val().startTime) {
            startTime = Number(snapshot.val().startTime);
            if (isNaN(startTime)) startTime = Date.now();
        } else {
            startTime = Date.now();
        }
    } catch (error) {
        console.error("Error getting start time from Realtime Database: ", error);
        startTime = Date.now();
    }
});

// Function to convert milliseconds to time string
function msToTimeString(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Function to store end time when stop button is clicked
function stopTimer() {
    const endTime = Date.now();
    try {
        const userSubjectRef = ref(realTimeDb, `users/${userData.email}/subjects/${subjectName}`);
        set(userSubjectRef, { startTime: startTime, endTime: endTime }).then(async () => {
            // Calculate session duration
            const sessionDuration = endTime - startTime;

            // Update Firestore subject total time
            const userDocRef = doc(firestore, "users", userData.email);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                let subjects = userDocSnap.data().subjects || [];
                subjects = subjects.map(subj => {
                    if (subj.name === subjectName) {
                        // Convert previous time to ms
                        const prev = subj.time ? subj.time.split(":") : ["00","00","00"];
                        const prevMs = (+prev[0])*3600000 + (+prev[1])*60000 + (+prev[2])*1000;
                        const newMs = prevMs + sessionDuration;
                        return { ...subj, time: msToTimeString(newMs) };
                    }
                    return subj;
                });
                await updateDoc(userDocRef, { subjects });
            }
            // Redirect to home page after saving the end time
            window.location.href = "../pages/home.html"; // Change to your home page route
        });
    } catch (error) {
        console.error("Error storing end time in Realtime Database or updating Firestore: ", error);
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
