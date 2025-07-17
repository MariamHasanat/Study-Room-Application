// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup, getAuth, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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

  if (password.length < 4 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    alert("Password must be at least 4 characters long and include uppercase, lowercase, and a number.");
    return;
  }

  try {
    // Add user info to Firestore
    const userRef = doc(firestore, "users", email); // Use email as a unique document ID
    await setDoc(userRef, {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully.");
    window.location.href = "../pages/login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to create account. Please try again.");
  }
});

const googleSignUpBtn = document.getElementById("google-signup-btn"); // Ensure this ID exists in your signup.html

if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user; // The signed-in user info

            // Handle storing user data in Firestore if it's a new user
            const userRef = doc(firestore, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // If user doesn't exist in Firestore, create their document
                await setDoc(userRef, {
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    subjects: [] // Initialize subjects for new Google users
                });
            }

            // Save essential user data to local storage
            localStorage.setItem('userName', JSON.stringify({
                name: userSnap.exists() ? userSnap.data().name : (user.displayName || user.email.split('@')[0]),
                email: user.email
            }));

            alert("Account created/logged in successfully with Google!");
            window.location.href = "../pages/home.html";

        } catch (error) {
            console.error("Error during Google Sign-Up/Login:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                alert("Google Sign-Up was cancelled or the popup was closed.");
            } else {
                alert("Failed to sign up/log in with Google. Please try again.");
            }
        }
    });
}
