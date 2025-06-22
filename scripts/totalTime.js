// scripts/totalTime.js
// This module exports a function to update the total study time on the home page.
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { firestore } from "./firebase-config.js";

export async function updateTotalStudyTime(userEmail) {
    const userRef = doc(firestore, "users", userEmail);
    const userSnap = await getDoc(userRef);
    let totalMs = 0;
    if (userSnap.exists()) {
        const subjects = userSnap.data().subjects || [];
        for (const subj of subjects) {
            if (subj.time) {
                const parts = subj.time.split(":");
                if (parts.length === 3) {
                    const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                    totalMs += ms;
                }
            }
        }
    }
    // Format totalMs to HH:MM:SS
    const totalTime = formatTime(totalMs);
    const totalTimeElement = document.querySelector(".total-time-value");
    if (totalTimeElement) {
        totalTimeElement.textContent = totalTime;
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}
