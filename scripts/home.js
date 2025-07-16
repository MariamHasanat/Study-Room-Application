// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { renderSubjectsAndTotalTimeLocalFirst, renderSubjectsAndTotalTimeFirestore } from './subject-list.js';
import { addSubjectClickListener } from './subject-utils.js';
import { formatTime } from './time-utils.js';
import { setGreeting } from './greeting.js';
import { setupLogout } from './logout.js';
import { validateSubjectName, checkDuplicateSubject, showMessage, initEnhancedFeatures } from './enhanced-utils.js';

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
const editSubjectName = document.getElementById("edit-subject-name");
const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const saveTimeBtn = document.getElementById("save-time-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

// Delete confirmation elements
const deleteConfirmation = document.getElementById("delete-confirmation");
const deleteSubjectNameSpan = document.getElementById("delete-subject-name");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

// Global variables for edit/delete operations
let currentEditingSubject = null;
let currentDeletingSubject = null;

// Event Listeners
addSubjectBtn.addEventListener("click", () => {
    showFormWithOverlay(addSubjectForm);
});

cancelBtn.addEventListener("click", () => {
    hideAllForms();
});

formOverlay.addEventListener("click", () => {
    hideAllForms();
});

// Helper function to hide all forms
function hideAllForms() {
    addSubjectForm.classList.add("hidden");
    editTimeForm.classList.add("hidden");
    deleteConfirmation.classList.add("hidden");
    formOverlay.style.display = "none";
}

// Show form with overlay
function showFormWithOverlay(form) {
    hideAllForms();
    form.classList.remove("hidden");
    formOverlay.style.display = "block";
}

// Add Subject Functionality
addBtn.addEventListener("click", async () => {
    const subjectName = document.getElementById("subject-name-input").value.trim();

    // Enhanced validation
    const validation = validateSubjectName(subjectName);
    if (!validation.valid) {
        showMessage(validation.message, 'error');
        return;
    }

    // Check for duplicates
    const existingSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    if (checkDuplicateSubject(subjectName, existingSubjects)) {
        showMessage('هذه المادة موجودة بالفعل!', 'error');
        return;
    }

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", userData.email); // Use email as the document ID
        await updateDoc(userRef, {
            subjects: arrayUnion({ name: subjectName, time: "00:00:00" })
        });

        // Update Local Storage
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects.push({ name: subjectName, time: "00:00:00" });
        localStorage.setItem("subjects", JSON.stringify(subjects));

        // Refresh the subject list
        refreshSubjectList();

        // Show success message
        showMessage(`تم إضافة مادة "${subjectName}" بنجاح!`, 'success');

        // Reset form and hide overlay
        document.getElementById("subject-name-input").value = "";
        hideAllForms();

    } catch (error) {
        console.error("Error adding subject to Firestore: ", error);
        showMessage("فشل في إضافة المادة. حاول مرة أخرى.", 'error');
    }
});

// Edit time event listeners
cancelEditBtn.addEventListener("click", () => {
    hideAllForms();
});

saveTimeBtn.addEventListener("click", async () => {
    if (!currentEditingSubject) return;

    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    // Validate time inputs
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        alert("Please enter valid time values (Hours: 0-23, Minutes/Seconds: 0-59)");
        return;
    }

    const newTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    try {
        // Update Firestore
        const userRef = doc(firestore, "users", userData.email);
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        const updatedSubjects = subjects.map(subj => 
            subj.name === currentEditingSubject ? { ...subj, time: newTime } : subj
        );

        await updateDoc(userRef, { subjects: updatedSubjects });

        // Update localStorage
        localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

        // Refresh the subject list
        refreshSubjectList();

        showMessage(`تم تحديث وقت دراسة "${currentEditingSubject}" بنجاح!`, 'success');

        hideAllForms();
        currentEditingSubject = null;

    } catch (error) {
        console.error("Error updating subject time: ", error);
        showMessage("فشل في تحديث الوقت. حاول مرة أخرى.", 'error');
    }
});

// Delete confirmation event listeners
cancelDeleteBtn.addEventListener("click", () => {
    hideAllForms();
    currentDeletingSubject = null;
});

confirmDeleteBtn.addEventListener("click", async () => {
    if (!currentDeletingSubject) return;

    try {
        // Get current subjects
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        const subjectToDelete = subjects.find(subj => subj.name === currentDeletingSubject);
        
        if (!subjectToDelete) {
            alert("Subject not found.");
            return;
        }

        // Remove from Firestore
        const userRef = doc(firestore, "users", userData.email);
        await updateDoc(userRef, {
            subjects: arrayRemove(subjectToDelete)
        });

        // Remove from localStorage
        const updatedSubjects = subjects.filter(subj => subj.name !== currentDeletingSubject);
        localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

        // Refresh the subject list
        refreshSubjectList();

        showMessage(`تم حذف مادة "${currentDeletingSubject}" بنجاح!`, 'success');

        hideAllForms();
        currentDeletingSubject = null;

    } catch (error) {
        console.error("Error deleting subject: ", error);
        showMessage("فشل في حذف المادة. حاول مرة أخرى.", 'error');
    }
});

function sanitizeEmail(email) {
    return email.replace(/\./g, ',');
}

// Function to refresh the subject list
function refreshSubjectList() {
    const loader = document.getElementById("loader");
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
            (li, name) => addSubjectClickListener(li, name, database, userData, sanitizeEmail),
            formatTime,
            userRef,
            localStorage,
            loader,
            emptyStateElem
        ]
    );
    
    // Add event listeners for edit and delete buttons after rendering
    setTimeout(addEditDeleteListeners, 100);
}

// Function to add event listeners for edit and delete buttons
function addEditDeleteListeners() {
    // Edit button listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const subjectName = btn.getAttribute('data-subject');
            showEditTimeForm(subjectName);
        });
    });

    // Delete button listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const subjectName = btn.getAttribute('data-subject');
            showDeleteConfirmation(subjectName);
        });
    });
}

// Function to show edit time form
function showEditTimeForm(subjectName) {
    currentEditingSubject = subjectName;
    editSubjectName.textContent = `Edit time for: ${subjectName}`;
    
    // Get current time for this subject
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const subject = subjects.find(subj => subj.name === subjectName);
    
    if (subject && subject.time) {
        const [hours, minutes, seconds] = subject.time.split(':');
        hoursInput.value = parseInt(hours);
        minutesInput.value = parseInt(minutes);
        secondsInput.value = parseInt(seconds);
    } else {
        hoursInput.value = 0;
        minutesInput.value = 0;
        secondsInput.value = 0;
    }
    
    showFormWithOverlay(editTimeForm);
}

// Function to show delete confirmation
function showDeleteConfirmation(subjectName) {
    currentDeletingSubject = subjectName;
    deleteSubjectNameSpan.textContent = subjectName;
    showFormWithOverlay(deleteConfirmation);
}

// Fetch and render subjects from localStorage first, then Firestore
window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    
    // Initialize enhanced features
    initEnhancedFeatures();
    
    refreshSubjectList();
});

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);
