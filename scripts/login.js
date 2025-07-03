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
