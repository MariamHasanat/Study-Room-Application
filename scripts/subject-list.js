// Subject list rendering and management
import { formatTime } from './time-utils.js';
import { getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function renderSubjectsAndTotalTimeLocalFirst(subjectList, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs) {
    const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjectList.innerHTML = "";
    if (localSubjects.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }
    localSubjects.forEach(subj => {
        const li = document.createElement("li");
        li.className = "subject-info";
        li.innerHTML = `
            <div class="subject-left">
                <span class="color">
                    <span class="material-symbols-outlined">play_arrow</span>
                </span>
                <span class="subject-name">${subj.name}</span>
            </div>
            <div class="subject-right">
                <span class="subject-time">${subj.time || "00:00:00"}</span>
                <button class="delete-subject-btn" title="Delete subject">🗑️</button>
            </div>
        `;
        subjectList.appendChild(li);
        // Use the passed-in click handler
        if (firestoreArgs && typeof firestoreArgs[1] === 'function') {
            firestoreArgs[1](li, subj.name);
        }
    });
    // Call Firestore fetch with all required args
    if (typeof renderSubjectsAndTotalTimeFirestore === 'function') {
        renderSubjectsAndTotalTimeFirestore(...firestoreArgs);
    }
}

export async function renderSubjectsAndTotalTimeFirestore(subjectList, addSubjectClickListener, userRef, localStorage, loader, emptyState) {
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const subjects = userSnap.data().subjects || [];
            subjectList.innerHTML = "";
            subjects.forEach(subj => {
                const li = document.createElement("li");
                li.className = "subject-info";
                li.innerHTML = `
                    <div class="subject-left">
                        <span class="color">
                            <span class="material-symbols-outlined">play_arrow</span>
                        </span>
                        <span class="subject-name">${subj.name}</span>
                    </div>
                    <div class="subject-right">
                        <span class="subject-time">${subj.time || "00:00:00"}</span>
                        <button class="delete-subject-btn" title="Delete subject">🗑️</button>
                    </div>
                `;
                subjectList.appendChild(li);
                // Use the passed-in click handler
                addSubjectClickListener(li, subj.name);
            });
            // Update localStorage with latest subjects
            localStorage.setItem("subjects", JSON.stringify(subjects));
            // Hide/show empty state
            if (emptyState) emptyState.style.display = subjects.length === 0 ? "block" : "none";
        } else {
            if (emptyState) emptyState.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching subjects from Firestore:", error);
    } finally {
        if (loader) loader.classList.remove("active");
    }
}
