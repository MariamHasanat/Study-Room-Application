
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
   import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

  
  //import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  
