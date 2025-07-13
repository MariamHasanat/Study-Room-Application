import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Utility for subject click events
export function addSubjectClickListener(subjectElement, subjectName, database, userData, sanitizeEmail, deleteHandler) {
    // Add click event for starting study session
    subjectElement.addEventListener("click", async (e) => {
        // Don't start study if clicking on delete button
        if (e.target.classList.contains('delete-subject-btn')) {
            return;
        }
        
        try {
            // Store timestamp in Realtime Database
            const timestamp = new Date().toISOString();
            const safeEmail = sanitizeEmail(userData.email);
            const userSubjectRef = database ? ref(database, `users/${safeEmail}/subjects/${subjectName}`) : null;
            if (userSubjectRef) await set(userSubjectRef, { startTime: timestamp });
            // Redirect to study page with subject name as a query parameter
            window.location.href = `study.html?subject=${encodeURIComponent(subjectName)}`;
        } catch (error) {
            console.error("Error storing timestamp in Realtime Database: ", error);
            alert("Failed to log subject activity. Please try again.");
        }
    });

    // Add delete button functionality
    const deleteBtn = subjectElement.querySelector('.delete-subject-btn');
    if (deleteBtn && deleteHandler) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering the study session
            deleteHandler.showDeleteModal(subjectName);
        });
    }
}
