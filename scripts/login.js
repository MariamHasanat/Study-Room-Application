// Import Firebase SDK
import { firestore , auth} from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
    await signInWithEmailAndPassword(auth , email, password)
    // Retrieve user data from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found. Please check your email.");
      return;
    }

    const userData = userSnap.data();

    // Check if password matches (You should use Firebase Auth for real apps)
    if (password === userData.password) {
      alert("Login successful!");
      localStorage.setItem('userName', JSON.stringify(userData));
      window.location.href = "../pages/home.html"; // Redirect to home page
    } else {
      alert("Incorrect password. Please try again.");
    }
  } catch (error) {
    console.error("Error retrieving document: ", error);
    alert("Failed to login. Please try again.");
  }
});

// Google Sign-in Handler
const googleProvider = new GoogleAuthProvider();

document.getElementById("google-login").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userRef = doc(firestore, "users", user.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If not exist, create basic user entry (optional)
      alert("New Google user detected, please sign up fully later.");
    }

    const userData = userSnap.exists() ? userSnap.data() : { email: user.email, name: user.displayName };
    localStorage.setItem("userName", JSON.stringify(userData));
    alert("Logged in with Google successfully!");
    window.location.href = "../pages/home.html";
  } catch (error) {
    console.error("Google sign-in failed:", error);
    alert("Google login failed. Try again.");
  }
});
