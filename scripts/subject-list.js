// Subject list rendering and management
import { formatTime } from './time-utils.js';
import { getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


export function renderSubjectsAndTotalTimeLocalFirst(subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs) {
    const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjectList.innerHTML = "";
    if (localSubjects.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }
    let totalMs = 0;
localSubjects.forEach(subj => {
    const subject = document.createElement("li");
    subject.className = "subject";

    const newSubjectInfo = document.createElement("div");
    newSubjectInfo.className = "subject-info";
    newSubjectInfo.innerHTML = `
        <span class="color">
            <span class="material-symbols-outlined">play_arrow</span>
        </span>
        <span class="subject-name">${subj.name}</span>
        <span class="subject-time">${subj.time || "00:00:00"}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️";

    // 🧹 زر الحذف - local فقط
    deleteBtn.addEventListener("click", () => {
        const filtered = localSubjects.filter(s => s.name !== subj.name);
        localStorage.setItem("subjects", JSON.stringify(filtered));
        subject.remove();
        if (filtered.length === 0 && emptyState) {
            emptyState.style.display = "block";
        }
    });

    subject.appendChild(newSubjectInfo);
    subject.appendChild(deleteBtn);
    subjectList.appendChild(subject);

    // Event
    if (firestoreArgs && typeof firestoreArgs[2] === 'function') {
        firestoreArgs[2](newSubjectInfo, subj.name);
    }

    // حساب الوقت
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

export async function renderSubjectsAndTotalTimeFirestore(subjectList, totalTimeElement, addSubjectClickListener, formatTime, userRef, localStorage, loader, emptyState) {
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const subjects = userSnap.data().subjects || [];
            subjectList.innerHTML = "";
            let totalMs = 0;
           subjects.forEach(subj => {
    const subject = document.createElement("li");
    subject.className = "subject";

    const newSubjectInfo = document.createElement("div");
    newSubjectInfo.className = "subject-info";
    newSubjectInfo.innerHTML = `
        <span class="color">
            <span class="material-symbols-outlined">play_arrow</span>
        </span>
        <span class="subject-name">${subj.name}</span>
        <span class="subject-time">${subj.time || "00:00:00"}</span>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️";

    // 🧹 زر الحذف - من Firestore
    deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(`Are you sure you want to delete "${subj.name}"?`);
        if (!confirmDelete) return;

        try {
            const updatedSubjects = subjects.filter(s => s.name !== subj.name);
            await updateDoc(userRef, { subjects: updatedSubjects });
            localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
            subject.remove();
            if (updatedSubjects.length === 0 && emptyState) {
                emptyState.style.display = "block";
            }
        } catch (err) {
            console.error("Failed to delete subject:", err);
            alert("Error deleting subject.");
        }
    });

    subject.appendChild(newSubjectInfo);
    subject.appendChild(deleteBtn);
    subjectList.appendChild(subject);

    addSubjectClickListener(newSubjectInfo, subj.name);

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
            if (totalTimeElement) {
                totalTimeElement.textContent = formatTime(totalMs);
            }
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
