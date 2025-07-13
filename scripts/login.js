import { firestore, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

//login using email and password  
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Both fields are required.");
    return;
  }

  try {
    // Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      localStorage.setItem('userName', JSON.stringify(userData));
      alert("Login successful!");
      window.location.href = "../pages/home.html";
    } else {
      // If user exists in Auth but not in Firestore, create basic data
      await setDoc(userRef, {
        name: user.displayName || email.split('@')[0],
        email: email,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('userName', JSON.stringify({
        name: user.displayName || email.split('@')[0],
        email: email
      }));
      
      alert("Login successful!");
      window.location.href = "../pages/home.html";
    }

  } catch (error) {
    console.error("Login error:", error);
    
    // More specific error messages
    if (error.code === 'auth/user-not-found') {
      alert("No account found with this email. Please check your email or create a new account.");
    } else if (error.code === 'auth/wrong-password') {
      alert("Incorrect password. Please try again.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Please enter a valid email address.");
    } else if (error.code === 'auth/too-many-requests') {
      alert("Too many failed attempts. Please try again later.");
    } else {
      alert("Failed to login: " + error.message);
    }
  }
});

// Google Sign-In
document.addEventListener("DOMContentLoaded", function () {
  const provider = new GoogleAuthProvider();
  const googleBtn = document.getElementById("google-signin-btn");

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
// Check if user data exists in Firestore
        const userRef = doc(firestore, "users", user.email);
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString()
        }, { merge: true });
// Store user data in localStorage
        localStorage.setItem('userName', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));

        alert("Google Sign-In successful!");
        window.location.href = "../pages/home.html";

      } catch (error) {
        console.error("Google Sign-In error:", error);
        alert("Failed to sign in with Google: " + error.message);
      }
    });
  }
});
