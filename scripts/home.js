// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
import {
  doc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  renderSubjectsAndTotalTimeLocalFirst,
  renderSubjectsAndTotalTimeFirestore,
} from "./subject-list.js";
import { addSubjectClickListener } from "./subject-utils.js";
import { formatTime } from "./time-utils.js";
import { setGreeting } from "./greeting.js";
import { setupLogout } from "./logout.js";

// Load user data from local storage
const userData = JSON.parse(localStorage.getItem("userName"));
if (!userData || !userData.name || !userData.email) {
  window.location.href = "../pages/login.html";
}
const heading = document.querySelector(".user-name");
if (heading) heading.innerHTML = userData.name;

// Greeting logic
const greetingDiv = document.querySelector(".header-greeting");
setGreeting(greetingDiv, userData);

// DOM Elements
const addSubjectBtn = document.getElementById("add-subject-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addBtn = document.getElementById("add-btn");
const addSubjectForm = document.getElementById("add-subject-form");
const formOverlay = document.getElementById("form-overlay");
const subjectList = document.getElementById("subject-list");

// Edit time form elements
const editTimeForm = document.getElementById("edit-time-form");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const saveTimeBtn = document.getElementById("save-time-btn");
const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");

// Delete confirmation form elements
const deleteConfirmationForm = document.getElementById(
  "delete-confirmation-form"
);
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const deleteMessage = document.getElementById("delete-message");

// Variable to store current subject being edited or deleted
let currentEditingSubject = null;
let currentDeletingSubject = null;

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
  editTimeForm.classList.add("hidden");
  deleteConfirmationForm.classList.add("hidden");
  formOverlay.style.display = "none";
});

// Edit time form event listeners
cancelEditBtn.addEventListener("click", () => {
  editTimeForm.classList.add("hidden");
  formOverlay.style.display = "none";
  currentEditingSubject = null;
});

// Delete confirmation form event listeners
cancelDeleteBtn.addEventListener("click", () => {
  deleteConfirmationForm.classList.add("hidden");
  formOverlay.style.display = "none";
  currentDeletingSubject = null;
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!currentDeletingSubject) return;

  try {
    // Update Firestore - remove the subject
    const userRef = doc(firestore, "users", userData.uid || userData.email);
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const updatedSubjects = subjects.filter(
      (subj) => subj.name !== currentDeletingSubject
    );

    await updateDoc(userRef, { subjects: updatedSubjects });

    // Update Local Storage
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // Remove from UI
    const subjectElement = document
      .querySelector(`[data-subject="${currentDeletingSubject}"]`)
      .closest(".subject-info");
    subjectElement.remove();

    // Update total time
    updateTotalTime();

    // Show/hide empty state if needed
    const emptyState = document.getElementById("empty-state");
    if (updatedSubjects.length === 0 && emptyState) {
      emptyState.style.display = "block";
    }

    // Hide form
    deleteConfirmationForm.classList.add("hidden");
    formOverlay.style.display = "none";
    currentDeletingSubject = null;

    alert("Subject deleted successfully!");
  } catch (error) {
    console.error("Error deleting subject from Firestore: ", error);
    alert("Failed to delete subject. Please try again.");
  }
});

saveTimeBtn.addEventListener("click", async () => {
  if (!currentEditingSubject) return;

  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  // Validate input
  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    alert(
      "Please enter valid time values (Hours: 0-23, Minutes: 0-59, Seconds: 0-59)"
    );
    return;
  }

  const newTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  try {
    // Update Firestore
    const userRef = doc(firestore, "users", userData.uid || userData.email);
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const updatedSubjects = subjects.map((subj) =>
      subj.name === currentEditingSubject ? { ...subj, time: newTime } : subj
    );

    await updateDoc(userRef, { subjects: updatedSubjects });

    // Update Local Storage
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // Update UI
    const subjectElement = document
      .querySelector(`[data-subject="${currentEditingSubject}"]`)
      .closest(".subject-info");
    const timeElement = subjectElement.querySelector(".subject-time");
    timeElement.textContent = newTime;

    // Update total time
    updateTotalTime();

    // Hide form
    editTimeForm.classList.add("hidden");
    formOverlay.style.display = "none";
    currentEditingSubject = null;

    alert("Study time updated successfully!");
  } catch (error) {
    console.error("Error updating time in Firestore: ", error);
    alert("Failed to update time. Please try again.");
  }
});

// Function to update total time display
function updateTotalTime() {
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  let totalMs = 0;
  subjects.forEach((subj) => {
    if (subj.time) {
      const parts = subj.time.split(":");
      if (parts.length === 3) {
        const ms = +parts[0] * 3600000 + +parts[1] * 60000 + +parts[2] * 1000;
        totalMs += ms;
      }
    }
  });
  const totalTimeElement = document.querySelector(".total-time-value");
  if (totalTimeElement) {
    totalTimeElement.textContent = formatTime(totalMs);
  }
}

// Function to handle edit and delete button clicks
function setupEditDeleteButtons() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-time-btn")) {
      e.stopPropagation(); // Prevent triggering subject click
      const subjectName = e.target.getAttribute("data-subject");
      openEditTimeForm(subjectName);
    } else if (e.target.classList.contains("delete-subject-btn")) {
      e.stopPropagation(); // Prevent triggering subject click
      const subjectName = e.target.getAttribute("data-subject");
      openDeleteConfirmation(subjectName);
    }
  });
}

// Function to open edit time form
function openEditTimeForm(subjectName) {
  currentEditingSubject = subjectName;

  // Get current time for the subject
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  const subject = subjects.find((subj) => subj.name === subjectName);

  if (subject && subject.time) {
    const timeParts = subject.time.split(":");
    hoursInput.value = parseInt(timeParts[0]) || 0;
    minutesInput.value = parseInt(timeParts[1]) || 0;
    secondsInput.value = parseInt(timeParts[2]) || 0;
  } else {
    hoursInput.value = 0;
    minutesInput.value = 0;
    secondsInput.value = 0;
  }

  editTimeForm.classList.remove("hidden");
  formOverlay.style.display = "block";
}

// Function to open delete confirmation
function openDeleteConfirmation(subjectName) {
  currentDeletingSubject = subjectName;
  deleteMessage.textContent = `Are you sure you want to delete "${subjectName}"?`;
  deleteConfirmationForm.classList.remove("hidden");
  formOverlay.style.display = "block";
}

formOverlay.addEventListener("click", () => {
  addSubjectForm.classList.add("hidden");
  formOverlay.style.display = "none";
});

// Add Subject Functionality
addBtn.addEventListener("click", async () => {
  const subjectName = document
    .getElementById("subject-name-input")
    .value.trim();

  if (!subjectName) {
    alert("Please enter a subject name.");
    return;
  }

  try {
    // Update Firestore
    const userRef = doc(firestore, "users", userData.uid || userData.email);
    await updateDoc(userRef, {
      subjects: arrayUnion({ name: subjectName, time: "00:00:00" }),
    });

    // Update Local Storage
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjects.push({ name: subjectName, time: "00:00:00" });
    localStorage.setItem("subjects", JSON.stringify(subjects));

    // Update UI
    const newSubject = document.createElement("li");
    newSubject.className = "subject-info";
    newSubject.innerHTML = `
            <div class="subject-main-area">
                <span class="color">
                    <span class="material-symbols-outlined">play_arrow</span>
                </span>
                <span class="subject-name">${subjectName}</span>
            </div>
            <div class="subject-actions">
                <span class="subject-time">00:00:00</span>
                <button class="edit-time-btn" data-subject="${subjectName}">Edit</button>
                <button class="delete-subject-btn" data-subject="${subjectName}">Delete</button>
            </div>
        `;
    subjectList.appendChild(newSubject);

    // Add click event to the new subject (modular version)
    addSubjectClickListener(
      newSubject,
      subjectName,
      database,
      userData,
      sanitizeEmail
    ); // Setup edit and delete buttons for the new subject
    setupEditDeleteButtons();

    // Hide empty state image if visible
    const emptyState = document.getElementById("empty-state");
    if (emptyState) emptyState.style.display = "none";

    // Reset form and hide overlay
    document.getElementById("subject-name-input").value = "";
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
  } catch (error) {
    console.error("Error adding subject to Firestore: ", error);
    alert("Failed to add subject. Please try again.");
  }
});

function sanitizeEmail(email) {
  return email.replace(/\./g, ",");
}

// Fetch and render subjects from localStorage first, then Firestore
window.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("active");
  const subjectListElem = document.getElementById("subject-list");
  const totalTimeElem = document.querySelector(".total-time-value");
  const emptyStateElem = document.getElementById("empty-state");
  const userRef = doc(firestore, "users", userData.uid || userData.email);
  renderSubjectsAndTotalTimeLocalFirst(
    subjectListElem,
    totalTimeElem,
    emptyStateElem,
    renderSubjectsAndTotalTimeFirestore,
    [
      subjectListElem,
      totalTimeElem,
      (li, name) =>
        addSubjectClickListener(li, name, database, userData, sanitizeEmail),
      formatTime,
      userRef,
      localStorage,
      loader,
      emptyStateElem,
    ]
  );
});

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);

// Setup edit and delete buttons functionality
setupEditDeleteButtons();
