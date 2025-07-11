import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Utility for subject click events
export function addSubjectClickListener(
  subjectElement,
  subjectName,
  database,
  userData,
  sanitizeEmail
) {
  // Add click listener only to the main area, not the entire element
  const mainArea = subjectElement.querySelector(".subject-main-area");
  if (mainArea) {
    mainArea.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // Store timestamp in Realtime Database
        const timestamp = new Date().toISOString();
        const safeEmail = sanitizeEmail(userData.email);
        const userSubjectRef = database
          ? ref(database, `users/${safeEmail}/subjects/${subjectName}`)
          : null;
        if (userSubjectRef) await set(userSubjectRef, { startTime: timestamp });
        // Redirect to study page with subject name as a query parameter
        window.location.href = `study.html?subject=${encodeURIComponent(
          subjectName
        )}`;
      } catch (error) {
        console.error("Error storing timestamp in Realtime Database: ", error);
        alert("Failed to log subject activity. Please try again.");
      }
    });
  }
}
