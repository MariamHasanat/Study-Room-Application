import { loginAndSignup } from "./auth-utils.mjs";

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload
    loginAndSignup();
});
