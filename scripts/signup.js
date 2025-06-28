// Import Firebase SDK
import { firestore, auth, googleProvider } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Form submission handler for email/password signup
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

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user info to Firestore
    const userRef = doc(firestore, "users", email);
    await setDoc(userRef, {
      uid: user.uid,
      name,
      email,
      createdAt: new Date().toISOString(),
      loginMethod: 'email'
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error creating account: ", error);
    
    if (error.code === 'auth/email-already-in-use') {
      alert("An account with this email already exists. Please try logging in instead.");
    } else if (error.code === 'auth/weak-password') {
      alert("Password is too weak. Please choose a stronger password.");
    } else {
      alert("Failed to create account. Please try again.");
    }
  }
});

// Google Sign-In handler
document.getElementById("googleSignIn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Store user data in localStorage
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    };
    
    // Save user data to Firestore for future reference
    try {
      await setDoc(doc(firestore, "users", user.email), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        loginMethod: 'google'
      }, { merge: true });
    } catch (firestoreError) {
      console.error("Error saving to Firestore: ", firestoreError);
      // Continue with signup even if Firestore save fails
    }
    
    localStorage.setItem('userName', JSON.stringify(userData));
    alert("Google Sign-Up successful!");
    window.location.href = "../pages/home.html";
    
  } catch (error) {
    console.error("Error during Google Sign-In: ", error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      alert("Sign-up was cancelled. Please try again.");
    } else if (error.code === 'auth/popup-blocked') {
      alert("Pop-up was blocked. Please allow pop-ups for this site and try again.");
    } else {
      alert("Failed to sign up with Google. Please try again.");
    }
  }
});
