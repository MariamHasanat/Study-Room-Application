// home.js (أو اسم الملف الرئيسي لصفحة عرض المواد)

// Import Firebase SDK
import { firestore, database } from "./firebase-config.js";
// تأكد من استيراد doc و updateDoc و arrayUnion فقط إذا كنت تستخدمها
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { renderSubjectsAndTotalTimeLocalFirst, renderSubjectsAndTotalTimeFirestore } from './subject-list.js';
import { addSubjectClickListener } from './subject-utils.js'; // تأكد أن هذا الملف موجود ويحتوي على الدالة
import { formatTime } from './time-utils.js'; // تأكد أن هذا الملف موجود ويحتوي على الدالة
import { setGreeting } from './greeting.js'; // تأكد أن هذا الملف موجود ويحتوي على الدالة
import { setupLogout } from './logout.js'; // تأكد أن هذا الملف موجود ويحتوي على الدالة

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
const subjectList = document.getElementById("subject-list"); // يجب أن يكون موجودًا في home.html

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

// Add Subject Functionality
addBtn.addEventListener("click", async () => {
    const subjectNameInput = document.getElementById("subject-name-input");
    const subjectName = subjectNameInput.value.trim();

    if (!subjectName) {
        alert("الرجاء إدخال اسم المادة.");
        return;
    }

    try {
        // تحديث Firestore
        const userRef = doc(firestore, "users", userData.email); // استخدم البريد الإلكتروني كـ ID للمستند
        await updateDoc(userRef, {
            subjects: arrayUnion({ name: subjectName, time: "00:00:00" })
        });

        // تحديث Local Storage
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        subjects.push({ name: subjectName, time: "00:00:00" });
        localStorage.setItem("subjects", JSON.stringify(subjects));

        // إعادة عرض القائمة بالكامل بعد الإضافة لضمان التزامن
        const subjectListElem = document.getElementById("subject-list");
        const totalTimeElem = document.querySelector(".total-time-value");
        const emptyStateElem = document.getElementById("empty-state");

        // هنا نمرر جميع الوسائط التي تحتاجها دالة renderSubjectsAndTotalTimeLocalFirst و renderSubjectsAndTotalTimeFirestore
        // بما في ذلك معالج النقر الجديد لربط زر الحذف بشكل صحيح
        renderSubjectsAndTotalTimeLocalFirst(
            subjectListElem,
            totalTimeElem,
            emptyStateElem,
            renderSubjectsAndTotalTimeFirestore,
            [
                subjectListElem,
                totalTimeElem,
                (li, name) => addSubjectClickListener(li, name, database, userData, sanitizeEmail), // معالج النقر على المادة
                formatTime,
                userRef,
                localStorage,
                document.getElementById("loader"), // تأكد أن Loader عنصر موجود
                emptyStateElem
            ]
        );

        // إعادة تعيين النموذج وإخفاء الطبقة العلوية
        subjectNameInput.value = ""; // مسح حقل الإدخال
        addSubjectForm.classList.add("hidden");
        formOverlay.style.display = "none";

    } catch (error) {
        console.error("Error adding subject to Firestore: ", error);
        alert("فشل في إضافة المادة. يرجى المحاولة مرة أخرى.");
    }
});

function sanitizeEmail(email) {
    return email.replace(/\./g, ',');
}

// جلب وعرض المواد من localStorage أولاً، ثم من Firestore
window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("active");
    const subjectListElem = document.getElementById("subject-list");
    const totalTimeElem = document.querySelector(".total-time-value");
    const emptyStateElem = document.getElementById("empty-state");
    const userRef = doc(firestore, "users", userData.email);

    // استدعاء دالة العرض الرئيسية
    renderSubjectsAndTotalTimeLocalFirst(
        subjectListElem,
        totalTimeElem,
        emptyStateElem,
        renderSubjectsAndTotalTimeFirestore,
        [
            subjectListElem,
            totalTimeElem,
            // تأكد أن addSubjectClickListener يتم تمريره بشكل صحيح هنا
            (li, name) => addSubjectClickListener(li, name, database, userData, sanitizeEmail),
            formatTime,
            userRef,
            localStorage,
            loader,
            emptyStateElem
        ]
    );
});

// Logout logic
const logoutBtn = document.getElementById("logout-btn");
setupLogout(logoutBtn);