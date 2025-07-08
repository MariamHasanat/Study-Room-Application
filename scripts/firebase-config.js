import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5g6OFoCmhmL0uLirsClppDVWNjTMNCAI",
  authDomain: "bootcamp-e63bc.firebaseapp.com",
  databaseURL: "https://bootcamp-e63bc-default-rtdb.firebaseio.com",
  projectId: "bootcamp-e63bc",
  storageBucket: "bootcamp-e63bc.firebasestorage.app",
  messagingSenderId: "600564189769",
  appId: "1:600564189769:web:0b375c8efa3667d78acd98",
  measurementId: "G-Z0WNBSZ3X6"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);    
export const firestore = getFirestore(app);          
export const auth = getAuth(app);  
