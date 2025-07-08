// // Import Firebase SDK
// import { firestore, auth } from "./firebase-config.js";
// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// import {setDoc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// // Form submission handler
// document.querySelector("form").addEventListener("submit", async (e) => {
//   e.preventDefault(); // Prevent page reload

//   // Collect user input
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;

//   // Validate input
//   if (!email || !password) {
//     alert("Both fields are required.");
//     return;
//   }

//   try {
//     // Login with email
//     await signInWithEmailAndPassword(auth, email, password);

//     // Retrieve user data from Firestore
//     const userRef = doc(firestore, "users", email);
//     const userSnap = await getDoc(userRef);

//     if (!userSnap.exists()) {
//       alert("User not found. Please check your email.");
//       return;
//     }

//     const userData = userSnap.data();

//     // Check if password matches (You should use Firebase Auth for real apps)
//     if (password === userData.password) {
//       alert("Login successful!");
//       localStorage.setItem('userName', JSON.stringify(userData));
//       window.location.href = "../pages/home.html"; // Redirect to home page
//     } else {
//       alert("Incorrect password. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error retrieving document: ", error);
//     alert("Failed to login. Please try again.");
//   }


//   document.addEventListener("DOMContentLoaded",function(){
//     const provider = new GoogleAuthProvider();
//     const googleBtn = document.getElementById("google-login-btn");

//     if(googleBtn){
//       googleBtn.addEventListener("click",async()=>{
//         try{
//           const result = await signInWithPopup(auth,provider);
//           const user = result.user;

//           const userRef = doc(firestore, "users",user.email);
//           await setDoc(userRef, {
//             name:user.displayName,
//             email:user.email,
//             photoURL:user.photoURL,
//             createdAt: new Date().toISOString()
//           },{merge:true});

//           //save to lcocalStorage if end
//           localStorage.setItem('userName',JSON.stringify({
//             name: user.displayName,
//             email: user.email,
//             photoURL: user.photoURL
//          }));
//          window.location.href="../pages/home.html";
        
//       } catch(error){
//         alert("Google sign in failed: "+ error.message);}
//       });
      
//     }else {
//       console.error("Google sign in button not found in DOM.");
//     }
//   })
// });


// Import Firebase SDK
import { firestore, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ---------------------
// 1. Email/Password login
// ---------------------
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Both fields are required.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(firestore, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found. Please check your email.");
      return;
    }

    const userData = userSnap.data();

    if (password === userData.password) {
      alert("Login successful!");
      localStorage.setItem("userName", JSON.stringify(userData));
      window.location.href = "../pages/home.html";
    } else {
      alert("Incorrect password.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Failed to login. Please try again.");
  }
});

// ---------------------
// 2. Google login
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
  const provider = new GoogleAuthProvider();
  const googleBtn = document.getElementById("google-login-btn");

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(firestore, "users", user.email);
        await setDoc(
          userRef,
          {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );

        localStorage.setItem(
          "userName",
          JSON.stringify({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );

        window.location.href = "../pages/home.html";
      } catch (error) {
        alert("Google sign in failed: " + error.message);
        console.error(error);
      }
    });
  } else {
    console.error("Google sign in button not found in DOM.");
  }
});
