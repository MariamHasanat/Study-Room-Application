// Import Firebase SDK
import { app, firestore } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
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
    // Login with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
