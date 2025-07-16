// Import Firebase SDK
import { firestore, auth, googleProvider } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

// Google Sign-In functionality
document.getElementById("google-signin-btn").addEventListener("click", async () => {
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
    } else {
      userData = userSnap.data();
    }
    
    // Store user data in localStorage
    localStorage.setItem('userName', JSON.stringify(userData));
    
    alert("Google sign-in successful!");
    window.location.href = "../pages/home.html";
    
  } catch (error) {
    console.error("Error with Google sign-in: ", error);
    alert("Failed to sign in with Google. Please try again.");
  }
});
