// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMOlVGRnfwTCa83YpF4gUpbYYMu4jMnBA",
    authDomain: "study-room-application.firebaseapp.com",
    projectId: "study-room-application",
    storageBucket: "study-room-application.firebasestorage.app",
    messagingSenderId: "102691908238",
    appId: "1:102691908238:web:b4d54c3fb01d5e0ca077df",
    measurementId: "G-DW46LFLGB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
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

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    alert("Password must be at least 8 characters long and include uppercase, lowercase, and a number.");
    return;
  }

  try {
    // Add user info to Firestore
    const userRef = doc(db, "users", email); // Use email as a unique document ID
    await setDoc(userRef, {
      name,
      email,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to create account. Please try again.");
  }
});
