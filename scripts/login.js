// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get additional user info from Firestore
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "User",
    };

    if (userSnap.exists()) {
      userData = { ...userData, ...userSnap.data() };
    }

    alert("Login successful!");
    localStorage.setItem("userName", JSON.stringify(userData));
    window.location.href = "../pages/home.html"; // Redirect to home page
  } catch (error) {
    console.error("Error signing in: ", error);

    // Handle specific Firebase Auth errors
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email. Please sign up first.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else if (error.code === "auth/too-many-requests") {
      alert("Too many failed login attempts. Please try again later.");
    } else {
      alert("Failed to login. Please try again.");
    }
  }
});

// Google Login functionality
const googleProvider = new GoogleAuthProvider();

document
  .getElementById("google-login-btn")
  .addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get additional user info from Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Google User",
        photoURL: user.photoURL || "",
      };

      if (userSnap.exists()) {
        userData = { ...userData, ...userSnap.data() };
      }

      alert("Login successful with Google!");
      localStorage.setItem("userName", JSON.stringify(userData));
      window.location.href = "../pages/home.html"; // Redirect to home page
    } catch (error) {
      console.error("Error with Google login:", error);

      // Handle specific errors
      if (error.code === "auth/popup-closed-by-user") {
        alert("Login was cancelled. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        alert(
          "Popup was blocked by your browser. Please allow popups and try again."
        );
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        alert(
          "An account already exists with the same email address but different sign-in credentials."
        );
      } else {
        alert("Failed to login with Google. Please try again.");
      }
    }
  });
