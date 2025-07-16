// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBo_QW_51HsxGhtgxul5Rig5vE2H6IRCw",
  authDomain: "study-room-firebase-bootcamp.firebaseapp.com",
  projectId: "study-room-firebase-bootcamp",
  storageBucket: "study-room-firebase-bootcamp.firebasestorage.app",
  messagingSenderId: "210580883766",
  appId: "1:210580883766:web:f8f491b4bf4eadbd784b97",
  measurementId: "",
  databaseURL: "https://study-room-firebase-bootcamp-default-rtdb.firebaseio.com/"//real-time database URL
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
