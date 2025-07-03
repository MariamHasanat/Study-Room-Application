import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
// Logout logic
export function setupLogout(logoutBtn) {
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                localStorage.removeItem("userName");
                localStorage.removeItem("subjects");
                localStorage.removeItem("currentUser");
                window.location.href = "../pages/login.html";
            } catch (error) {
                console.error("Error during logout:", error);
                alert("Failed to log out. Please try again.");
            }
        });
    }
}
