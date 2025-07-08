  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

  import {getAuth} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDsS4_FIP-B4aK0MbnZLh83SGFor7UcHzw",
    authDomain: "fir-bootcamp-fef97.firebaseapp.com",
    projectId: "fir-bootcamp-fef97",
    storageBucket: "fir-bootcamp-fef97.firebasestorage.app",
    messagingSenderId: "60168151546",
    appId: "1:60168151546:web:511ec2e97bfb6747c80443",
    measurementId: "G-5ESE9CHQXP"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const firestores = getFirestore(app);
  export const auth = getAuth(app);


