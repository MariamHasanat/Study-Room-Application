// Logout logic
export function setupLogout(logoutBtn) {
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userName");
            localStorage.removeItem("subjects");
            window.location.href = "../pages/login.html";
        });
    }
}
