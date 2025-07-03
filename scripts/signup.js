// Import Firebase SDK
import { loginAndSignup } from "./auth-utils.js";
// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Form submitted, attempting login/signup...");
    loginAndSignup();
    console.log("Login/Signup  function called, redirecting if successful...");
});
