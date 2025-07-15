// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIyJrUNU4wPh5qfgSBmJFKr5YCgxVk3yg",
  authDomain: "study-app-6a83f.firebaseapp.com",
  projectId: "study-app-6a83f",
  storageBucket: "study-app-6a83f.firebasestorage.app",
  messagingSenderId: "692125666188",
  appId: "1:692125666188:web:be1b0e6c83ff049de764a9",
  measurementId: "G-Z065SG7R39",
  databaseURL: "https://study-app-6a83f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
