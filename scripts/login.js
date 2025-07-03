import { loginAndSignup } from "./auth-utils.js";

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload
    loginAndSignup();
});
