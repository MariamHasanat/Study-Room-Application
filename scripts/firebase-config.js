// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"; // This is critical for authentication

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv2RtkuQTmGU71iBbzlOBwEveysrLDxBs",
    authDomain: "study-room-39cd2.firebaseapp.com",
    projectId: "study-room-39cd2",
    storageBucket: "study-room-39cd2.firebasestorage.app",
    messagingSenderId: "222916943081",
    appId: "1:222916943081:web:274ba8c916a248da21e478",
    measurementId: "G-BJLSL9STXP",
    databaseURL: "https://study-room-39cd2-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const firestore = getFirestore(app);
// Initialize Realtime Database
export const database = getDatabase(app);
// Initialize Firebase Authentication
export const auth = getAuth(app); // Ensure 'auth' is exported