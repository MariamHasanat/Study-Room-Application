// Import Firebase SDK
import { db , auth } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithEmailAndPassword ,GoogleAuthProvider,  signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
    const userRef = doc(db, "users", email);
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
// Google Sign-In Button Event
document.getElementById("google-login-btn").addEventListener("click", signInWithGoogle);

// Function to handle Google Sign-In
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
   signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
    
      const userRef = doc(db, "users", user.email);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
      
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          subjects: []
        });
      }
      alert("Google login successful! Welcome, " + user.displayName);
      localStorage.setItem('userName', JSON.stringify({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));
      window.location.href = "../pages/home.html";
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert("Google login failed. Please try again.");
    });
}