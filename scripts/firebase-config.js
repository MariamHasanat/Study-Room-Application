// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.auth.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLEVHT5MsiZnxp8cr7OqRb5YzxSK1j7AA",
  authDomain: "study-room-application-565e0.firebaseapp.com",
  projectId: "study-room-application-565e0",
  storageBucket: "study-room-application-565e0.firebasestorage.app",
  messagingSenderId: "953380253118",
  appId: "1:953380253118:web:acc4c36b20deff76531def",
  databaseURL:"https://study-room-application-565e0-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);


//*********** */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  alert(`Welcome ${user.displayName}`);
}