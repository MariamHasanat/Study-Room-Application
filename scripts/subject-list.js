// Subject list rendering and management
import { formatTime } from './time-utils.js';
import { getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function renderSubjectsAndTotalTimeLocalFirst(subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs) {
    const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjectList.innerHTML = ""; // Clear existing list
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
            <span class="edit-time-btn material-symbols-outlined">edit</span> <span class="delete-subject-btn material-symbols-outlined">delete</span> `;
        subjectList.appendChild(li);

        // Crucially, call the passed-in listener function *after* the element is appended to the DOM
        if (firestoreArgs && typeof firestoreArgs[2] === 'function') {
            firestoreArgs[2](li, subj.name);
        }

        // Calculate total time
        if (subj.time) {
            const parts = subj.time.split(":");
            if (parts.length === 3) {
                const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                totalMs += ms;
            }
        }
    });
    if (totalTimeElement) {
        totalTimeElement.textContent = formatTime(totalMs);
    }
    // Call Firestore fetch with all required args
    if (typeof renderSubjectsAndTotalTimeFirestore === 'function') {
        renderSubjectsAndTotalTimeFirestore(...firestoreArgs);
    }
}

export async function renderSubjectsAndTotalTimeFirestore(subjectList, totalTimeElement, attachAllSubjectListeners, formatTime, userRef, localStorage, loader, emptyState) {
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const subjects = userSnap.data().subjects || [];
            subjectList.innerHTML = ""; // Clear existing list before rendering from Firestore
            let totalMs = 0;
            subjects.forEach(subj => {
                const li = document.createElement("li");
                li.className = "subject-info";
                li.innerHTML = `
                    <span class="color">
                        <span class="material-symbols-outlined">play_arrow</span>
                    </span>
                    <span class="subject-name">${subj.name}</span>
                    <span class="subject-time ">${subj.time || "00:00:00"}</span>
                    <button  class="edit-time-btn primary-style-button  ">edit</button> 
                    <button  class="delete-subject-btn danger-style-button ">delete</button> `;
                subjectList.appendChild(li);
                // Call the passed-in listener function *after* the element is appended to the DOM
                attachAllSubjectListeners(li, subj.name);

                // Calculate total time
                if (subj.time) {
                    const parts = subj.time.split(":");
                    if (parts.length === 3) {
                        const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                        totalMs += ms;
                    }
                }
            });
            // Update localStorage with latest subjects (from Firestore, which is the source of truth)
            localStorage.setItem("subjects", JSON.stringify(subjects));
            // Update total time in UI
            if (totalTimeElement) {
                totalTimeElement.textContent = formatTime(totalMs);
            }
            // Hide/show empty state
            if (emptyState) emptyState.style.display = subjects.length === 0 ? "block" : "none";
        } else {
            if (emptyState) emptyState.style.display = "block";
            localStorage.removeItem("subjects"); // Clear local if no subjects in Firestore
        }
    } catch (error) {
        console.error("Error fetching subjects from Firestore:", error);
    } finally {
        if (loader) loader.classList.remove("active");
    }
}