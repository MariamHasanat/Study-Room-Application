// Subject list rendering and management
import { formatTime } from './time-utils.js';
import { firestore } from "./firebase-config.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { updateSubjects } from './home.js';

const userData = JSON.parse(localStorage.getItem("userName"));
if (!userData || !userData.name || !userData.email) {
    window.location.href = "../pages/login.html";
}

export function calculateTotalTime(subjects) {
    let totalMs = 0;
    subjects.forEach(subj => {
        if (subj.time) {
            const parts = subj.time.split(":");
            if (parts.length === 3) {
                const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                totalMs += ms;
            }
        }
    });
    return totalMs;
}

export function updateTotalTimeUI(totalTimeElement, subjects) {
    if (!totalTimeElement) return;
    const totalMs = calculateTotalTime(subjects);
    totalTimeElement.textContent = formatTime(totalMs);
}

export function renderSubjectsAndTotalTimeLocalFirst(subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs, addSubjectClickListener) {
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
            <span class="color">
                <span class="material-symbols-outlined">play_arrow</span>
            </span>
            <span class="subject-name">${subj.name}</span>
            <span class="subject-time">${subj.time || "00:00:00"}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        subjectList.appendChild(li);

        addSubjectClickListener(li, subj.name);

        // Edit Subject Functionality
        const editBtn = li.querySelector(".edit-btn");
        editBtn.addEventListener("click", async (event) => {
            event.stopPropagation();

            const currentTime = subj.time || "00:00:00";
            const newTime = prompt("Enter new time (HH:MM:SS)", currentTime);

            if (newTime && /^\d{2}:\d{2}:\d{2}$/.test(newTime)) {

                const timeSpan = li.querySelector(".subject-time");
                timeSpan.textContent = newTime;

                subj.time = newTime;

                let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
                const index = subjects.findIndex(s => s.name === subj.name);
                if (index !== -1) {
                    subjects[index].time = newTime;
                }
                await updateSubjects(subjects, userData, totalTimeElement);

            } else if (newTime !== null) {
                alert("Please enter the time in HH:MM:SS format!");
            }
        });

        // Delete Subject Functionality
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", async (event) => {
            event.stopPropagation();

            subjectList.removeChild(li);

            let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
            subjects = subjects.filter(sub => sub.name !== subj.name);
           
            await updateSubjects(subjects, userData, totalTimeElement);

            if (subjectList.children.length === 0 && emptyState) {
                emptyState.style.display = "block";
            }

        });

        if (firestoreArgs && typeof firestoreArgs[2] === 'function') {
            firestoreArgs[2](li, subj.name);
        }
    });

    updateTotalTimeUI(totalTimeElement, localSubjects);

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

            subjects.forEach(subj => {
                const li = document.createElement("li");
                li.className = "subject-info";
                li.innerHTML = `
                    <span class="color">
                        <span class="material-symbols-outlined">play_arrow</span>
                    </span>
                    <span class="subject-name">${subj.name}</span>
                    <span class="subject-time">${subj.time || "00:00:00"}</span>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                subjectList.appendChild(li);

                addSubjectClickListener(li, subj.name);

                const editBtn = li.querySelector(".edit-btn");
                editBtn.addEventListener("click", async (event) => {
                    event.stopPropagation();

                    const currentTime = subj.time || "00:00:00";
                    const newTime = prompt("Please enter a new study time in (HH:MM:SS) format", currentTime);

                    if (newTime && /^\d{2}:\d{2}:\d{2}$/.test(newTime)) {

                        const timeSpan = li.querySelector(".subject-time");
                        timeSpan.textContent = newTime;

                        subj.time = newTime;

                        let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
                        const index = subjects.findIndex(s => s.name === subj.name);
                        if (index !== -1) {
                            subjects[index].time = newTime;
                        }
                        
                        await updateSubjects(subjects, userData, totalTimeElement);

                    } else if (newTime !== null) {
                        alert("Please enter the time in HH:MM:SS format!");
                    }
                });

                // Delete Subject Functionality
                const deleteBtn = li.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", async (event) => {
                    event.stopPropagation();

                    subjectList.removeChild(li);

                    let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
                    subjects = subjects.filter(sub => sub.name !== subj.name);
                    
                    await updateSubjects(subjects, userData, totalTimeElement);

                });

            });

            localStorage.setItem("subjects", JSON.stringify(subjects));

            updateTotalTimeUI(totalTimeElement, subjects);

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
