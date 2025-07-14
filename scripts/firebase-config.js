
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; 


  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAQ3W8NAM1ePgfafB_NHN_aWs0bjTdSJ9A",
    authDomain: "study-room-5d477.firebaseapp.com",
    databaseURL: "https://study-room-5d477-default-rtdb.firebaseio.com",
    projectId: "study-room-5d477",
    storageBucket: "study-room-5d477.firebasestorage.app",
    messagingSenderId: "302360508606",
    appId: "1:302360508606:web:0afe20f1b51e34cb6246ef",
    measurementId: "G-E4XNF0J924",
      databaseURL: "https://study-room-5d477-default-rtdb.firebaseio.com"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);
  export const database = getDatabase(app);
  export const firestore = getFirestore(app);
  export const auth = getAuth(app);
