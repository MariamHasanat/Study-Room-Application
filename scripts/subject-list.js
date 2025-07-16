// subject-list.js

import { formatTime } from "./time-utils.js";
import {
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Remove subject from localStorage by name
function deleteSubjectFromLocalStorage(name) {
  const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
  const updatedSubjects = localSubjects.filter((s) => s.name !== name);
  localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
  return updatedSubjects;
}

// Create a list item element for a subject
function createSubjectListItem(subj, onDeleteClick, onPlayClick) {
  const li = document.createElement("li");
  li.className = "subject-info";
  li.innerHTML = `
    <div class="subject-row-flex">
      <span class="play-icon">
        <span class="material-symbols-outlined">play_arrow</span>
      </span>
      <span class="subject-name">${subj.name}</span>
      <span class="subject-time">${subj.time || "00:00:00"}</span>
      <img src="../assets/trash-solid.svg" alt="Delete" class="delete-subject" data-name="${
        subj.name
      }" />
    </div>
  `;

  li.querySelector(".delete-subject").addEventListener("click", onDeleteClick);
  li.addEventListener("click", onPlayClick);
  return li;
}

// Render subject list and total time from localStorage first
export function renderSubjectsAndTotalTimeLocalFirst(
  subjectList,
  totalTimeElement,
  emptyState,
  renderSubjectsAndTotalTimeFirestore,
  firestoreArgs
) {
  let localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
  subjectList.innerHTML = "";

  if (emptyState) {
    emptyState.style.display = localSubjects.length === 0 ? "block" : "none";
  }

  let totalMs = 0;

  localSubjects.forEach((subj) => {
    const li = createSubjectListItem(
      subj,
      () => {
        localSubjects = deleteSubjectFromLocalStorage(subj.name);
        li.remove();
        updateTotalTimeDisplay(localSubjects, totalTimeElement);
        if (emptyState)
          emptyState.style.display =
            localSubjects.length === 0 ? "block" : "none";
      },
      firestoreArgs?.[2] ? () => firestoreArgs[2](li, subj.name) : () => {}
    );

    subjectList.appendChild(li);
    totalMs += convertTimeToMilliseconds(subj.time);
  });

  if (totalTimeElement) {
    totalTimeElement.textContent = formatTime(totalMs);
  }

  if (typeof renderSubjectsAndTotalTimeFirestore === "function") {
    renderSubjectsAndTotalTimeFirestore(...firestoreArgs);
  }
}

// Render subject list and total time from Firestore
export async function renderSubjectsAndTotalTimeFirestore(
  subjectList,
  totalTimeElement,
  addSubjectClickListener,
  formatTime,
  userRef,
  localStorage,
  loader,
  emptyState
) {
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    let subjects = userSnap.data().subjects || [];
    subjectList.innerHTML = "";

    if (emptyState)
      emptyState.style.display = subjects.length === 0 ? "block" : "none";

    let totalMs = 0;

    subjects.forEach((subj) => {
      const li = createSubjectListItem(
        subj,
        async (e) => {
          e.stopPropagation();
          subjects = subjects.filter((s) => s.name !== subj.name);
          await updateDoc(userRef, { subjects });
          localStorage.setItem("subjects", JSON.stringify(subjects));
          li.remove();
          updateTotalTimeDisplay(subjects, totalTimeElement);
          if (emptyState)
            emptyState.style.display = subjects.length === 0 ? "block" : "none";
        },
        () => addSubjectClickListener(li, subj.name)
      );

      subjectList.appendChild(li);
      totalMs += convertTimeToMilliseconds(subj.time);
    });

    localStorage.setItem("subjects", JSON.stringify(subjects));
    if (totalTimeElement) {
      totalTimeElement.textContent = formatTime(totalMs);
    }
  } catch (error) {
    console.error("Error fetching subjects from Firestore:", error);
  } finally {
    if (loader) loader.classList.remove("active");
  }
}

// Convert time string (hh:mm:ss) to milliseconds
function convertTimeToMilliseconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 3) return 0;
  return +parts[0] * 3600000 + +parts[1] * 60000 + +parts[2] * 1000;
}

// Update total time in the UI
function updateTotalTimeDisplay(subjects, totalTimeElement) {
  const totalMs = subjects.reduce(
    (acc, s) => acc + convertTimeToMilliseconds(s.time),
    0
  );
  if (totalTimeElement) {
    totalTimeElement.textContent = formatTime(totalMs);
  }
}
