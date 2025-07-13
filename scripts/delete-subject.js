// Delete subject functionality
import { firestore } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export function setupDeleteSubject() {
    const deleteModal = document.getElementById("delete-confirmation-modal");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    const subjectToDeleteSpan = document.getElementById("subject-to-delete");
    
    let subjectToDelete = null;
    let userData = null;

    // Show delete confirmation modal
    function showDeleteModal(subjectName) {
        subjectToDelete = subjectName;
        subjectToDeleteSpan.textContent = subjectName;
        deleteModal.classList.remove("hidden");
    }

    // Hide delete confirmation modal
    function hideDeleteModal() {
        deleteModal.classList.add("hidden");
        subjectToDelete = null;
    }

    // Delete subject from both localStorage and Firestore
    async function deleteSubject() {
        if (!subjectToDelete || !userData) return;

        try {
            // Remove from localStorage
            let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
            subjects = subjects.filter(subj => subj.name !== subjectToDelete);
            localStorage.setItem("subjects", JSON.stringify(subjects));

            // Remove from Firestore
            const userRef = doc(firestore, "users", userData.email);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                let subjects = userSnap.data().subjects || [];
                subjects = subjects.filter(subj => subj.name !== subjectToDelete);
                await updateDoc(userRef, { subjects });
            }

            // Remove from UI
            const subjectElements = document.querySelectorAll('.subject-info');
            subjectElements.forEach(element => {
                const subjectNameElement = element.querySelector('.subject-name');
                if (subjectNameElement && subjectNameElement.textContent === subjectToDelete) {
                    element.remove();
                }
            });

            // Show empty state if no subjects
            const subjectList = document.getElementById("subject-list");
            const emptyState = document.getElementById("empty-state");
            if (subjectList.children.length === 0 && emptyState) {
                emptyState.style.display = "block";
            }

            hideDeleteModal();
            alert("Subject deleted successfully!");

        } catch (error) {
            console.error("Error deleting subject:", error);
            alert("Failed to delete subject. Please try again.");
        }
    }



    // Event listeners
    confirmDeleteBtn.addEventListener("click", deleteSubject);
    cancelDeleteBtn.addEventListener("click", hideDeleteModal);

    // Close modal when clicking outside
    deleteModal.addEventListener("click", (e) => {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });

    // Return the function to show delete modal
    return {
        showDeleteModal,
        setUserData: (data) => { userData = data; }
    };
} 