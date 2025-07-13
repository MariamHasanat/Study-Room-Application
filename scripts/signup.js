// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";  

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

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    alert("Password must include uppercase, lowercase, and a number.");
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user info to Firestore (without password for security)
    const userRef = doc(firestore, "users", email);
    await setDoc(userRef, {
      name,
      email,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully!");
    window.location.href = "../pages/login.html";
  } catch (error) {
    console.error("Error creating account: ", error);
    
    // More specific error messages
    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already registered. Please use a different email or try logging in.");
    } else if (error.code === 'auth/weak-password') {
      alert("Password is too weak. Please use a stronger password.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Please enter a valid email address.");
    } else {
      alert("Failed to create account: " + error.message);
    }
  }
});
