// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {getDatabase} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {getfirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyCckyD2uckeVLTahstOQHgTegvXt0FFR84",
  authDomain: "fir-bootcamp-26e6c.firebaseapp.com",
  projectId: "fir-bootcamp-26e6c",
  storageBucket: "fir-bootcamp-26e6c.firebasestorage.app",
  messagingSenderId: "1069259462287",
  appId: "1:1069259462287:web:c4134bef00abc0e52a82fa",
  measurementId: "G-KVCSJ7EF6R",
  databaseURL: "https://fir-bootcamp-26e6c-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getfirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Debug: Check if Firebase is initialized
console.log("Firebase initialized:", app);
console.log("Auth initialized:", auth);
console.log("Google provider initialized:", googleProvider);
