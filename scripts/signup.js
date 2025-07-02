// Import Firebase SDK
import { firestore } from "./firebase-config.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
  console.log("i am in form");
  e.preventDefault(); // Prevent page reload

  // Collect user input
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    alert("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (
    password.length < 4 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    alert(
      "Password must be at least 4 characters long and include uppercase, lowercase, and a number."
    );
    return;
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Add user info to Firestore (without password)
    const userRef = doc(firestore, "users", email); // Use email as a unique document ID
    await setDoc(userRef, {
      name,
      email,
      createdAt: new Date().toISOString(),
      subjects: [],
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error creating user:", error);
    alert(error.message || "Failed to create account. Please try again.");
  }
});
