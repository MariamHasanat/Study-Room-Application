// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {getDatabase} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtzBaSYWCqcv38rExJTIYBmMAUTNy6LTw",
  authDomain: "fir-bootcamp-b3ff2.firebaseapp.com",
  projectId: "fir-bootcamp-b3ff2",
  storageBucket: "fir-bootcamp-b3ff2.firebasestorage.app",
  messagingSenderId: "809482825068",
  appId: "1:809482825068:web:70faae583154ede55c1749",

  databaseURL: "https://fir-bootcamp-b3ff2-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app); // link with Realtime Database
export const firestore = getFirestore(app);
export const auth = getAuth(app);
