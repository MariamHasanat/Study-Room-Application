
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getFirestore  } from  "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  import { getDatabase } from  "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDYtSkIwVv_2iUfstlarQMJq6qyDfB1UII",
    authDomain: "fir-bootcamp-ca11a.firebaseapp.com",
    projectId: "fir-bootcamp-ca11a",
    storageBucket: "fir-bootcamp-ca11a.firebasestorage.app",
    messagingSenderId: "1028489722774",
    appId: "1:1028489722774:web:d6b66fdae52ef80d0efbb7",
    databaseURL: "https://fir-bootcamp-ca11a-default-rtdb.firebaseio.com/",
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const firestore = getFirestore(app);
  export const database = getDatabase(app);
  export const auth = getAuth(app);
  export const provider = new GoogleAuthProvider();