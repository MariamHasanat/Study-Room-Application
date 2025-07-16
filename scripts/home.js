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
  formOverlay.style.display = "none";
});

// Helper function to sanitize email for Firestore keys if needed
function sanitizeEmail(email) {
  return email.replace(/\./g, ",");
}

// Add Subject Functionality without location.reload()
addBtn.addEventListener("click", async () => {
  const subjectName = document
    .getElementById("subject-name-input")
    .value.trim();

  if (!subjectName) {
    alert("Please enter a subject name.");
    return;
  }

  try {
    // Reference to user document
    const userRef = doc(firestore, "users", userData.email);

    // Update Firestore: add new subject to the array
    await updateDoc(userRef, {
      subjects: arrayUnion({ name: subjectName, time: "00:00:00" }),
    });

    // Update localStorage: add new subject
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjects.push({ name: subjectName, time: "00:00:00" });
    localStorage.setItem("subjects", JSON.stringify(subjects));

    // Re-render the subject list and total time from local first
    renderSubjectsAndTotalTimeLocalFirst(
      subjectList,
      document.querySelector(".total-time-value"),
      document.getElementById("empty-state"),
      renderSubjectsAndTotalTimeFirestore,
      [
        subjectList,
        document.querySelector(".total-time-value"),
        (li, name) =>
          addSubjectClickListener(li, name, database, userData, sanitizeEmail),
        formatTime,
        userRef,
        localStorage,
        document.getElementById("loader"),
        document.getElementById("empty-state"),
      ]
    );

    // Reset form and hide overlay
    document.getElementById("subject-name-input").value = "";
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none";
  } catch (error) {
    console.error("Error adding subject to Firestore: ", error);
    alert("Failed to add subject. Please try again.");
  }
});

// Fetch and render subjects from localStorage first, then Firestore on page load
window.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("active");
  const subjectListElem = document.getElementById("subject-list");
  const totalTimeElem = document.querySelector(".total-time-value");
  const emptyStateElem = document.getElementById("empty-state");
  const userRef = doc(firestore, "users", userData.email);
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
