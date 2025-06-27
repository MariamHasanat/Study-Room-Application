// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
    // Login with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    // Optionally, fetch user profile from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      localStorage.setItem('userName', JSON.stringify(userSnap.data()));
    }
    alert("Login successful!");
    window.location.href = "../pages/home.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const provider = new GoogleAuthProvider();
  const googleBtn = document.getElementById("google-signin-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Optionally, store user info in Firestore
        const userRef = doc(firestore, "users", user.email);
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString()
        }, { merge: true });
        // Save to localStorage if needed
        localStorage.setItem('userName', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));
        window.location.href = "../pages/home.html";
      } catch (error) {
        alert("Google sign-in failed: " + error.message);
      }
    });
  } else {
    console.error("Google sign-in button not found in DOM.");
  }
});
