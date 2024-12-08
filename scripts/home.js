const userData = JSON.parse(localStorage.getItem('userName'));

const heading = document.querySelector('.user-name');

heading.innerHTML = userData.name;

const addSubjectBtn = document.getElementById("add-subject-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addBtn = document.getElementById("add-btn");
const addSubjectForm = document.getElementById("add-subject-form");
const formOverlay = document.getElementById("form-overlay");

addSubjectBtn.addEventListener("click", function () {
    addSubjectForm.classList.remove("hidden");
    formOverlay.style.display = "block"; // Show overlay
});

cancelBtn.addEventListener("click", function () {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none"; // Hide overlay
});

addBtn.addEventListener("click", function () {
    const subjectName = document.getElementById("subject-name-input").value.trim();
    if (subjectName) {
        const subjectList = document.getElementById("subject-list");
        const newSubject = document.createElement("li");
        newSubject.className = "subject-info";
        newSubject.innerHTML = `
            <span class="color">
                <span class="material-symbols-outlined">play_arrow</span>
            </span>
            <span class="subject-name">${subjectName}</span>
            <span class="subject-time">00:00:00</span>
        `;
        subjectList.appendChild(newSubject);
        document.getElementById("subject-name-input").value = "";
        addSubjectForm.classList.add("hidden");
        formOverlay.style.display = "none"; // Hide overlay
    } else {
        alert("Please enter a subject name.");
    }
});

formOverlay.addEventListener("click", function () {
    addSubjectForm.classList.add("hidden");
    formOverlay.style.display = "none"; // Hide overlay if clicked outside
});
