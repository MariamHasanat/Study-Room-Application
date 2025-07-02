// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
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
    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    // Retrieve user data from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      alert("User profile not found. Please contact support.");
      return;
    }
    const userData = userSnap.data();
    alert("Login successful!");
    localStorage.setItem("userName", JSON.stringify(userData));
    window.location.href = "../pages/home.html"; // Redirect to home page
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Failed to login. Please try again.");
  }
});

// Google Auth logic
const googleBtn = document.getElementById("google-login-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user exists in Firestore, if not, add them
      const userRef = doc(firestore, "users", user.email);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          createdAt: new Date().toISOString(),
          subjects: [],
        });
      }
      // Store user info in localStorage
      localStorage.setItem(
        "userName",
        JSON.stringify({
          name: user.displayName || "",
          email: user.email,
        })
      );
      window.location.href = "../pages/home.html";
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Google sign-in failed. Please try again.");
    }
  });
}
