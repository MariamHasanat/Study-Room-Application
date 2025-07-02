import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAJ5F0wnOn0kyiBWN_SAMqKY1RlqYXXxks",
  authDomain: "fir-bootcamp-afb03.firebaseapp.com",
  projectId: "fir-bootcamp-afb03",
  storageBucket: "fir-bootcamp-afb03.firebasestorage.app",
  messagingSenderId: "58876289845",
  appId: "1:58876289845:web:3dde7f92269724c802e27c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
