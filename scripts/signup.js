// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js"; // Import 'auth'
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"; // Import Auth methods

// Form submission handler for manual signup
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
        // IMPORTANT: For real applications, use Firebase Auth's createUserWithEmailAndPassword
        // and store additional user data in Firestore AFTER successful authentication.
        const userRef = doc(firestore, "users", email); // Use email as a unique document ID
        // Check if user already exists (by email)
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            alert("An account with this email already exists. Please login instead.");
            return;
        }

        await setDoc(userRef, {
            name,
            email,
            password, // AGAIN: Do NOT store passwords like this in a real app!
            createdAt: new Date().toISOString(),
            subjects: [] // Initialize subjects for new users
        });

        alert("Account created successfully.");
        window.location.href = "../pages/login.html"; // Redirect to login page
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to create account. Please try again.");
    }
});

// Google Sign-Up/Login Button Handler (can be reused from login.js)
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