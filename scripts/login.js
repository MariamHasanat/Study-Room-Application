// Import Firebase SDK
import { app, firestore } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {  signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Initialize auth instance
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
const auth = getAuth(app);

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  // Collect user input
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validate input
  if (!email || !password) {
    alert("Both fields are required.");
    return;
  }

  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Optionally, retrieve user data from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);
    let userData = {};
    if (userSnap.exists()) {
      userData = userSnap.data();
    }

    // Store user data
    localStorage.setItem('userName', JSON.stringify({ ...userData, email: userCredential.user.email }));
    alert("Login successful!");
    window.location.href = "../pages/home.html"; // Redirect to home page
  } catch (error) {
    let message = "Failed to login. Please try again.";
    if (error.code === 'auth/user-not-found') {
      message = "User not found. Please check your email.";
    } else if (error.code === 'auth/wrong-password') {
      message = "Incorrect password. Please try again.";
    }
    alert(message);
  }
});

// Google login button handler
const googleBtn = document.getElementById("google-login-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Optionally, store user data in Firestore
      const email = result.user.email;
      const userRef = doc(firestore, "users", email);
      await setDoc(userRef, {
        name: result.user.displayName,
        email: email,
        createdAt: new Date().toISOString(),
        photourl: result.user.photoURL
      }, { merge: true });
      localStorage.setItem('userName', JSON.stringify({
        name: result.user.displayName,
        email: email,
        photourl: result.user.photoURL
      }));
      alert("Login with Google successful!");
      window.location.href = "../pages/home.html";
    } catch (error) {
      let message = "Failed to login with Google. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Google login popup was closed before completing sign in.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = "Cancelled previous Google login popup. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        message = "Popup was blocked. Please allow popups and try again.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Please check your connection and try again.";
      }
      console.error("Google sign-in error:", error);
      alert(message);
    }
  });
}
