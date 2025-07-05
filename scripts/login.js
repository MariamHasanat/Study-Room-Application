// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
    await signInWithEmailAndPassword(auth, email, password);
    // Retrieve user data from Firestore
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      localStorage.setItem('userName', JSON.stringify(userData));
    }

    alert("Login successful!");
    window.location.href = "../pages/home.html"; // Redirect to home page

  }

  catch (error) {
    console.error("Login failed using Auth: ", error);
    alert("Failed to login. Please try again!");
  }

  /* if (!userSnap.exists()) {
     alert("User not found. Please check your email.");
     return;
   }
 
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
 } */
});

const googleBTN = document.getElementById("google-btn");

if (googleBTN) {

  googleBTN.addEventListener("click", async () => {

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const googleUser = result.user;
      const userRef = doc(firestore, "users", googleUser.email);
      await setDoc(userRef, {
        name: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });

      localStorage.setItem('userName', JSON.stringify({
        name: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL
      }));

      window.location.href = "../pages/home.html"; // Redirect to home page

    }
    catch (error) {
      console.error("Error while logging via Google: ", error);
      alert("Google Sign-in failed!");
    }
  })
}
else
  console.error("Google Sign-in button not found in the DOM!");
