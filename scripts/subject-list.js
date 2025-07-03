// subject-list.js
// This file is responsible for displaying and managing the list of subjects (adding, deleting) on the user interface.

// Import necessary functions and libraries from other files and Firebase SDK.
import { formatTime } from './time-utils.js'; // Function to convert time from milliseconds to HH:MM:SS format.
// Import Firestore SDK functions needed to fetch, update, and delete documents.
import { getDoc, doc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// Import the Firestore instance initialized in firebase-config.js.
import { firestore } from "./firebase-config.js";

/**
 * Helper function to delete a subject from Firestore and Local Storage.
 * This process is done step-by-step to ensure quick UI updates followed by database synchronization.
 * @param {string} subjectName - The name of the subject to be deleted.
 * @param {string} userEmail - The current user's email (used as the document ID in Firestore).
 * @param {HTMLElement} subjectListElement - The UL HTML element that displays the list of subjects.
 * @param {HTMLElement} totalTimeElement - The element that displays the total study time.
 * @param {HTMLElement} emptyState - The HTML element that appears when there are no subjects.
 * @param {Function} renderFirestoreCallback - Function to re-fetch and render subjects from Firestore.
 * @param {Array} firestoreArgs - An array of arguments needed to call renderFirestoreCallback.
 */
async function deleteSubject(subjectName, userEmail, subjectListElement, totalTimeElement, emptyState, renderFirestoreCallback, firestoreArgs) {
    // Important step: Ask for user confirmation before deleting to prevent accidental deletions.
    if (!confirm(`Are you sure you want to delete the subject "${subjectName}"?`)) {
        return; // If the user cancels the deletion, stop the function here.
    }

    // 1. Update Local Storage first:
    // This provides an immediate response to the user on the UI, as the subject disappears as soon as clicked.
    let localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    // Filter the array to remove the subject that matches subjectName.
    localSubjects = localSubjects.filter(subj => subj.name !== subjectName);
    // Save the updated array back to Local Storage.
    localStorage.setItem("subjects", JSON.stringify(localSubjects));

    // 2. Re-render the UI locally:
    // The local rendering function is called immediately to reflect the change (deletion) on the UI.
    // The same original arguments are passed to ensure the list is rebuilt correctly.
    renderSubjectsAndTotalTimeLocalFirst(subjectListElement, totalTimeElement, emptyState, renderFirestoreCallback, firestoreArgs);

    // 3. Delete the subject from Firestore:
    // This part handles the update in the cloud database.
    try {
        // Get a reference to the user's document in Firestore using their email as the ID.
        const userDocRef = doc(firestore, "users", userEmail);
        // Fetch the current snapshot of the document to check its existence and get data.
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            let currentSubjects = userDocSnap.data().subjects || []; // Get the current array of subjects.
            // Filter the array to remove the object representing the deleted subject.
            const updatedSubjects = currentSubjects.filter(subj => subj.name !== subjectName);
            // Update the user's document in Firestore with the new array of subjects.
            await updateDoc(userDocRef, { subjects: updatedSubjects });
            console.log(`Subject "${subjectName}" deleted successfully from Firestore.`);
        }
    } catch (error) {
        console.error("Error deleting subject from Firestore:", error);
        alert("Failed to delete subject from the database. Please try again.");
        // In case of failure, you might want to re-add the subject to localStorage or re-fetch from Firestore
        // to keep data in sync if the user is still online.
        // You can re-call renderFirestoreCallback here to ensure the UI is updated from the DB.
        renderFirestoreCallback(...firestoreArgs);
    }
}

/**
 * Renders subjects and total study time, prioritizing data from Local Storage first.
 * This provides a fast initial load while waiting for Firestore data.
 * @param {HTMLElement} subjectList - The UL HTML element for displaying subjects.
 * @param {HTMLElement} totalTimeElement - The element to display total study time.
 * @param {HTMLElement} emptyState - The element to show when no subjects are present.
 * @param {Function} renderSubjectsAndTotalTimeFirestore - Callback to render subjects from Firestore.
 * @param {Array} firestoreArgs - Arguments for the Firestore rendering callback.
 */
export function renderSubjectsAndTotalTimeLocalFirst(subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs) {
    const localSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    subjectList.innerHTML = ""; // Clear existing list items before rendering.

    // Show/hide empty state based on local subjects count.
    if (localSubjects.length === 0) {
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (emptyState) emptyState.style.display = "none";
    }

    let totalMs = 0; // Initialize total milliseconds for time calculation.

    // Loop through local subjects to create and append list items.
    localSubjects.forEach(subj => {
        const li = document.createElement("li");
        li.className = "subject-info";
        li.innerHTML = `
            <span class="color">
                <span class="material-symbols-outlined">play_arrow</span>
            </span>
            <span class="subject-name">${subj.name}</span>
            <span class="subject-time">${subj.time || "00:00:00"}</span>
            <span class="delete-subject-btn material-symbols-outlined">delete</span> `;
        subjectList.appendChild(li);

        // Add event listener for the delete button.
        const deleteButton = li.querySelector(".delete-subject-btn");
        if (deleteButton) {
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation(); // **IMPORTANT**: Prevent the parent <li> click event from firing (which might navigate to a details page).
                const userData = JSON.parse(localStorage.getItem("userName"));
                if (userData && userData.email) {
                    // Call the deleteSubject function with necessary arguments.
                    deleteSubject(subj.name, userData.email, subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, firestoreArgs);
                } else {
                    console.error("User email not found for deletion. Cannot delete subject.");
                    alert("Cannot delete subject: user information is missing.");
                }
            });
        }

        // Use the passed-in click handler (for navigating to subject details page or other interactions).
        if (firestoreArgs && typeof firestoreArgs[2] === 'function') {
            firestoreArgs[2](li, subj.name); // This is likely `addSubjectClickListener`
        }

        // Calculate total time for each subject.
        if (subj.time) {
            const parts = subj.time.split(":");
            if (parts.length === 3) {
                const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                totalMs += ms;
            }
        }
    });

    // Update the total time display.
    if (totalTimeElement) {
        totalTimeElement.textContent = formatTime(totalMs);
    }

    // Call the Firestore fetch function with all required arguments to sync data.
    if (typeof renderSubjectsAndTotalTimeFirestore === 'function') {
        renderSubjectsAndTotalTimeFirestore(...firestoreArgs);
    }
}

/**
 * Renders subjects and total study time by fetching data directly from Firestore.
 * This ensures data consistency with the cloud database.
 * @param {HTMLElement} subjectList - The UL HTML element for displaying subjects.
 * @param {HTMLElement} totalTimeElement - The element to display total study time.
 * @param {Function} addSubjectClickListener - Callback for adding click listeners to subjects.
 * @param {Function} formatTime - Function to format time.
 * @param {DocumentReference} userRef - Firestore document reference for the current user.
 * @param {Storage} localStorage - The browser's localStorage object.
 * @param {HTMLElement} loader - The loading spinner element.
 * @param {HTMLElement} emptyState - The element to show when no subjects are present.
 */
export async function renderSubjectsAndTotalTimeFirestore(subjectList, totalTimeElement, addSubjectClickListener, formatTime, userRef, localStorage, loader, emptyState) {
    try {
        const userSnap = await getDoc(userRef); // Fetch user document from Firestore.
        if (userSnap.exists()) {
            const subjects = userSnap.data().subjects || []; // Get subjects array from Firestore data.
            subjectList.innerHTML = ""; // Clear the list before re-building it with Firestore data.
            let totalMs = 0; // Reset total milliseconds for recalculation.

            // Loop through subjects fetched from Firestore.
            subjects.forEach(subj => {
                const li = document.createElement("li");
                li.className = "subject-info";
                li.innerHTML = `
                    <span class="color">
                        <span class="material-symbols-outlined">play_arrow</span>
                    </span>
                    <span class="subject-name">${subj.name}</span>
                    <span class="subject-time">${subj.time || "00:00:00"}</span>
                    <span class="delete-subject-btn material-symbols-outlined">delete</span> `;
                subjectList.appendChild(li);

                // Add event listener for the delete button (same as in renderSubjectsAndTotalTimeLocalFirst).
                const deleteButton = li.querySelector(".delete-subject-btn");
                if (deleteButton) {
                    deleteButton.addEventListener("click", (event) => {
                        event.stopPropagation(); // Prevent parent <li> click.
                        const userData = JSON.parse(localStorage.getItem("userName"));
                        if (userData && userData.email) {
                            // Pass all arguments needed to re-render the Firestore view correctly after deletion.
                            deleteSubject(subj.name, userData.email, subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, [subjectList, totalTimeElement, addSubjectClickListener, formatTime, userRef, localStorage, loader, emptyState]);
                        } else {
                            console.error("User email not found for deletion. Cannot delete subject.");
                            alert("Cannot delete subject: user information is missing.");
                        }
                    });
                }

                // Apply the provided click listener for the subject itself.
                addSubjectClickListener(li, subj.name);

                // Calculate total time.
                if (subj.time) {
                    const parts = subj.time.split(":");
                    if (parts.length === 3) {
                        const ms = (+parts[0]) * 3600000 + (+parts[1]) * 60000 + (+parts[2]) * 1000;
                        totalMs += ms;
                    }
                }
            });

            // Update localStorage with the latest subjects from Firestore.
            localStorage.setItem("subjects", JSON.stringify(subjects));
            // Update total time in the UI.
            if (totalTimeElement) {
                totalTimeElement.textContent = formatTime(totalMs);
            }
            // Hide/show empty state based on Firestore data.
            if (emptyState) emptyState.style.display = subjects.length === 0 ? "block" : "none";
        } else {
            // If the user's document doesn't exist in Firestore, show the empty state.
            if (emptyState) emptyState.style.display = "block";
            // Also, clear any local subjects to ensure consistency.
            localStorage.removeItem("subjects");
            subjectList.innerHTML = ""; // Clear the UI list.
            if (totalTimeElement) totalTimeElement.textContent = "00:00:00"; // Reset total time display.
        }
    } catch (error) {
        console.error("Error fetching subjects from Firestore:", error);
        // In case of an error fetching from Firestore, ensure local subjects are still displayed.
        renderSubjectsAndTotalTimeLocalFirst(subjectList, totalTimeElement, emptyState, renderSubjectsAndTotalTimeFirestore, [subjectList, totalTimeElement, addSubjectClickListener, formatTime, userRef, localStorage, loader, emptyState]);
    } finally {
        if (loader) loader.classList.remove("active"); // Hide loader once rendering is complete.
    }
}