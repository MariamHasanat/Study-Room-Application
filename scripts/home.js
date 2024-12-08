const userData = JSON.parse(localStorage.getItem('userName'));

const heading = document.querySelector('.user-name');

heading.innerHTML = userData.name;

document.getElementById("add-subject-btn").addEventListener("click", function () {
    document.getElementById("add-subject-form").classList.remove("hidden");
});

document.getElementById("cancel-btn").addEventListener("click", function () {
    document.getElementById("add-subject-form").classList.add("hidden");
});

document.getElementById("add-btn").addEventListener("click", function () {
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
        document.getElementById("add-subject-form").classList.add("hidden");
    } else {
        alert("Please enter a subject name.");
    }
});
