// Import Firebase SDK
import { firestore } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

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


const googleSignInBtn = document.getElementById("google-signin-btn");

if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider); // Use the imported 'auth' instance
            const user = result.user; // The signed-in user object

            // Check if this Google user exists in your Firestore 'users' collection
            const userRef = doc(firestore, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // If the user doesn't exist in Firestore, create their document
                await setDoc(userRef, {
                    name: user.displayName || user.email.split('@')[0], // Use Google display name, or part of email
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    subjects: [] // Initialize subjects for new Google users
                });
                // Update local storage with the newly created user data
                localStorage.setItem('userName', JSON.stringify({
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email
                }));
            } else {
                // If the user exists, just update local storage with their existing data
                localStorage.setItem('userName', JSON.stringify({
                    name: userSnap.data().name, // Use name from Firestore if available
                    email: user.email
                }));
            }

            alert("Login successful with Google!");
            window.location.href = "../pages/home.html"; // Redirect to home page

        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                alert("Google Sign-In was cancelled or the popup was closed.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                alert("Google Sign-In popup was already open. Please try again.");
            } else if (error.code === 'auth/operation-not-allowed') {
                alert("Google Sign-In is not enabled for this Firebase project. Please check your Firebase console.");
            }
            else {
                alert(`Failed to sign in with Google: ${error.message}. Please try again.`);
            }
        }
    });   }