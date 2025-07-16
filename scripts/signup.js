// Import Firebase SDK
import { firestore, auth, googleProvider } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

  if (password.length < 4 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    alert("Password must be at least 4 characters long and include uppercase, lowercase, and a number.");
    return;
  }

  try {
    // Add user info to Firestore
    const userRef = doc(firestore, "users", email); // Use email as a unique document ID
    await setDoc(userRef, {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to create account. Please try again.");
  }
});

// Google Sign-Up functionality
document.getElementById("google-signup-btn").addEventListener("click", async () => {
  try {
    // Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in Firestore
    const userRef = doc(firestore, "users", user.email);
    const userSnap = await getDoc(userRef);
    
    let userData;
    if (!userSnap.exists()) {
      // Create new user document
      userData = {
        name: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        subjects: [],
        authProvider: 'google'
      };
      await setDoc(userRef, userData);
      alert("Account created successfully with Google!");
    } else {
      userData = userSnap.data();
      alert("Welcome back! Signing you in...");
    }
    
    // Store user data in localStorage
    localStorage.setItem('userName', JSON.stringify(userData));
    
    window.location.href = "../pages/home.html";
    
  } catch (error) {
    console.error("Error with Google sign-up: ", error);
    alert("Failed to sign up with Google. Please try again.");
  }
});
