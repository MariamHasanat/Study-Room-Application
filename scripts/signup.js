// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
    const user = userCredential.user;

    // Add additional user info to Firestore
    const userRef = doc(firestore, "users", user.uid); // Use Firebase Auth UID as document ID
    await setDoc(userRef, {
      name,
      email,
      uid: user.uid,
      subjects: [], // Initialize empty subjects array
      createdAt: new Date().toISOString(),
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error creating account: ", error);

    // Handle specific Firebase Auth errors
    if (error.code === "auth/email-already-in-use") {
      alert(
        "An account with this email already exists. Please use a different email or try logging in."
      );
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please choose a stronger password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else {
      alert("Failed to create account. Please try again.");
    }
  }
});

// Google Sign Up functionality
const googleProvider = new GoogleAuthProvider();

document
  .getElementById("google-signup-btn")
  .addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(firestore, "users", user.uid);

      // Add user info to Firestore (this will create or update the document)
      await setDoc(
        userRef,
        {
          name: user.displayName || "Google User",
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL || "",
          provider: "google",
          subjects: [], // Initialize empty subjects array
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      ); // merge: true will not overwrite existing data

      alert("Account created/signed in successfully with Google!");
      window.location.href = "../pages/home.html"; // Redirect to home page
    } catch (error) {
      console.error("Error with Google sign up:", error);

      // Handle specific errors
      if (error.code === "auth/popup-closed-by-user") {
        alert("Sign up was cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        alert(
          "Popup was blocked by your browser. Please allow popups and try again."
        );
      } else {
        alert("Failed to sign up with Google. Please try again.");
      }
    }
  });
