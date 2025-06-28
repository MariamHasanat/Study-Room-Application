// Import Firebase SDK
import { firestore, auth, googleProvider } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Debug: Check if DOM is loaded
console.log("Login.js loaded");

// Form submission handler for email/password login
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
    // Use Firebase Auth for email/password authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in localStorage
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0]
    };
    
    localStorage.setItem('userName', JSON.stringify(userData));
    alert("Login successful!");
    window.location.href = "../pages/home.html"; // Redirect to home page
    
  } catch (error) {
    console.error("Error during login: ", error);
    
    // Fallback to Firestore check for existing users
    try {
      const userRef = doc(firestore, "users", email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User not found. Please check your email or sign up.");
        return;
      }

      const userData = userSnap.data();

      // Check if password matches (legacy support)
      if (password === userData.password) {
        alert("Login successful!");
        localStorage.setItem('userName', JSON.stringify(userData));
        window.location.href = "../pages/home.html";
      } else {
        alert("Incorrect password. Please try again.");
      }
    } catch (fallbackError) {
      console.error("Fallback error: ", fallbackError);
      alert("Failed to login. Please try again.");
    }
  }
});

// Debug: Check if Google button exists
const googleButton = document.getElementById("googleSignIn");
console.log("Google button found:", googleButton);

// Google Sign-In handler
if (googleButton) {
  googleButton.addEventListener("click", async () => {
    console.log("Google Sign-In button clicked!");
    try {
      console.log("Attempting Google Sign-In...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("Google Sign-In successful:", user);
      
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
        // Continue with login even if Firestore save fails
      }
      
      localStorage.setItem('userName', JSON.stringify(userData));
      alert("Google Sign-In successful!");
      window.location.href = "../pages/home.html";
      
    } catch (error) {
      console.error("Error during Google Sign-In: ", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        alert("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("Pop-up was blocked. Please allow pop-ups for this site and try again.");
      } else {
        alert("Failed to sign in with Google. Please try again.");
      }
    }
  });
} else {
  console.error("Google Sign-In button not found!");
}
