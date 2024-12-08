// Parse URL parameters to extract subject name
const urlParams = new URLSearchParams(window.location.search);
const subjectName = urlParams.get("subject");

// Display subject title
const subjectTitleElement = document.getElementById("subject-title");
subjectTitleElement.textContent = subjectName || "Unknown Subject";

// Timer Variables
let startTime = Date.now();
let timerInterval;

// Function to format elapsed time
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Start Timer
const studyTimerElement = document.getElementById("study-timer");
timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    studyTimerElement.textContent = formatTime(elapsedTime);
}, 1000);

// Stop Study Button Event
document.getElementById("stop-study-btn").addEventListener("click", () => {
    clearInterval(timerInterval);

    // Store session data (e.g., study duration) in localStorage or Firebase
    const studyDuration = Date.now() - startTime;
    alert(`Study session ended. Total time: ${formatTime(studyDuration)}`);

    // Redirect back to home page
    window.location.href = "home.html";
});
