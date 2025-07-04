// Import Firebase SDK
import { firestore } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth, provider } from './firebase-config.js';
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
 
document.addEventListener("DOMContentLoaded",function(){
  const googleBtn =document.getElementById("google-btn");

  if(googleBtn){
    googleBtn.addEventListener("click",async () =>{
      try{
        const result = await signInWithPopup(auth,provider);
        const user = result.user;
        // store user info in firestore
        const userRef = doc(firestore,"users",user.email);
        await setDoc(userRef,{
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createAt:new Date().toISOString()
        },{merge:true});
        // save data in local storage
        localStorage.setItem('userName',JSON.stringify({
          name:user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }));
        window.location.href = "../pages/home.html";
      }catch(error){
        alert("Google sign-in failed: " + error.message);
      }
    });
  }else{
    console.error("Google sign-in button not found in DOM.")
  }
});

// document.getElementById("google-btn").addEventListener("click", () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;

//       console.log("Login successful!", user.displayName);
//       window.location.href = "../pages/home.html";
//     })
//     .catch((error) => {
//       console.error("Login failed!", error);
//     });
// });