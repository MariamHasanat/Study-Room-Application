  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);