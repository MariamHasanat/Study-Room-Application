// Import Firebase SDK
import {
    get,
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { firestore, database } from "./firebase-config.js";
import {
    doc,
    getDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    // Show loader immediately
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");

    // Load user data from local storage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const heading = document.querySelector(".user-name");
    if (heading && currentUser) heading.innerHTML = currentUser.displayName;

    // Greeting logic
    const greetingDiv = document.querySelector(".header-greeting");
    if (greetingDiv && currentUser) {
        const hour = new Date().getHours();
        let greet = "Hello";
        if (hour < 12) greet = "Good morning";
        else if (hour < 18) greet = "Good afternoon";
        else greet = "Good evening";
        greetingDiv.textContent = `${greet}, ${currentUser.displayName} 👋🏆!`;
    }

    // Parse URL parameters to extract subject name
    const urlParams = new URLSearchParams(window.location.search);
    const subjectName = urlParams.get("subject");

    // Display subject title
    const subjectTitleElement = document.getElementById("subject-title");
    if (subjectTitleElement)
        subjectTitleElement.textContent = subjectName || "Unknown Subject";

    // Timer Variables
    let startTime = Date.now();
    let timerInterval;
    let timerStarted = false;
    window.timerShouldRun = true;
    const studyTimerElement = document.getElementById("study-timer");

    // Function to sanitize email for database paths
    function sanitizeEmail(email) {
        return email.replace(/\./g, ",");
    }

    // Timer display logic
    function startTimerDisplay() {
        if (!timerStarted) {
            timerStarted = true;
            timerInterval = setInterval(() => {
                if (!window.timerShouldRun) return;
                const elapsedTime = Date.now() - startTime;
                if (studyTimerElement)
                    studyTimerElement.textContent = formatTime(elapsedTime);
            }, 1000);
        }
    }

    const deleteSubjectBtn = document.getElementById("delete-subject-btn");
    if (deleteSubjectBtn) {
        deleteSubjectBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this subject?")) {
                try {
                    // Remove subject from localStorage
                    let subjects =
                        JSON.parse(localStorage.getItem("subjects")) || [];
                    subjects = subjects.filter(
                        (subj) => subj.name !== subjectName
                    );
                    localStorage.setItem("subjects", JSON.stringify(subjects));

                    // Remove subject from Realtime Database
                    const safeEmail = sanitizeEmail(currentUser.email);
                    const userSubjectRef = ref(
                        database,
                        `users/${safeEmail}/subjects/${subjectName}`
                    );
                    await set(userSubjectRef, null);

                    // Remove subject from Firestore
                    const userDocRef = doc(firestore, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        let subjects = userDocSnap.data().subjects || [];
                        subjects = subjects.filter(
                            (subj) => subj.name !== subjectName
                        );
                        await updateDoc(userDocRef, { subjects });
                    }

                    // Redirect to home page
                    window.location.href = "../pages/home.html";
                } catch (error) {
                    console.error("Error deleting subject: ", error);
                }
            }
        });
    }

    // Get start time from Realtime Database when the page loads
    (async () => {
        try {
            const safeEmail = sanitizeEmail(currentUser.email);
            const userSubjectRef = ref(
                database,
                `users/${safeEmail}/subjects/${subjectName}`
            );
            const snapshot = await get(userSubjectRef);
            console.log(snapshot.val());

            if (snapshot.exists() && snapshot.val().startTime) {
                startTime = Number(snapshot.val().startTime);
                if (isNaN(startTime)) startTime = Date.now();
            } else {
                startTime = Date.now();
            }
        } catch (error) {
            console.error(
                "Error getting start time from Realtime Database: ",
                error
            );
            startTime = Date.now();
        }
        // Hide loader after timer is ready and timer display starts
        if (loader) loader.classList.remove("active");
        startTimerDisplay();
    })();

    // Function to convert milliseconds to time string
    function msToTimeString(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            "0"
        );
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }
    function formatTime(ms) {
        return msToTimeString(ms);
    }

    // Stop Timer logic
    function stopTimer() {
        const endTime = Date.now();
        window.timerShouldRun = false;
        clearInterval(timerInterval); // Stop timer immediately
        // Show loader
        const loader = document.getElementById("loader");
        if (loader) loader.style.display = "flex";
        // Freeze timer display at final value
        if (studyTimerElement) {
            const elapsedTime = endTime - startTime;
            studyTimerElement.textContent = formatTime(elapsedTime);
        }
        // Update localStorage instantly
        let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects = subjects.map((subj) => {
            if (subj.name === subjectName) {
                const prev = subj.time
                    ? subj.time.split(":")
                    : ["00", "00", "00"];
                const prevMs =
                    +prev[0] * 3600000 + +prev[1] * 60000 + +prev[2] * 1000;
                const sessionDuration = endTime - startTime;
                const newMs = prevMs + sessionDuration;
                return { ...subj, time: msToTimeString(newMs) };
            }
            return subj;
        });
        localStorage.setItem("subjects", JSON.stringify(subjects));
        // Perform DB updates, then redirect
        (async () => {
            try {
                const safeEmail = sanitizeEmail(currentUser.email);
                const userSubjectRef = ref(
                    database,
                    `users/${safeEmail}/subjects/${subjectName}`
                );
                await set(userSubjectRef, {
                    startTime: startTime,
                    endTime: endTime,
                });
                // Update Firestore subject total time
                const userDocRef = doc(firestore, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    let subjects = userDocSnap.data().subjects || [];
                    subjects = subjects.map((subj) => {
                        if (subj.name === subjectName) {
                            const prev = subj.time
                                ? subj.time.split(":")
                                : ["00", "00", "00"];
                            const prevMs =
                                +prev[0] * 3600000 +
                                +prev[1] * 60000 +
                                +prev[2] * 1000;
                            const sessionDuration = endTime - startTime;
                            const newMs = prevMs + sessionDuration;
                            return { ...subj, time: msToTimeString(newMs) };
                        }
                        return subj;
                    });
                    await updateDoc(userDocRef, { subjects });
                }
                // Hide loader and redirect
                if (loader) loader.style.display = "none";
                window.location.href = "../pages/home.html";
            } catch (error) {
                console.error(
                    "Error storing end time in Realtime Database or updating Firestore: ",
                    error
                );
                if (loader) loader.style.display = "none";
                window.location.href = "../pages/home.html";
            }
        })();
    }

    // Stop Study Button Event
    const stopBtn = document.getElementById("stop-study-btn");
    if (stopBtn) stopBtn.addEventListener("click", stopTimer);

    // Logout logic
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userName");
            localStorage.removeItem("subjects");
            window.location.href = "../pages/login.html";
        });
    }
});
