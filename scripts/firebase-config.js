
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import {getFirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  import {getDatabase} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import {getAuth} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBXnKwREiERhEzjcvpM8TuJfBb52bcY5M8",
    authDomain: "study-faece.firebaseapp.com",
    projectId: "study-faece",
    storageBucket: "study-faece.firebasestorage.app",
    messagingSenderId: "675967228650",
    appId: "1:675967228650:web:f726ae1400807d12c69593",
    measurementId: "G-XYFDZGWC5T",
    databaseURL: "https://study-faece-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);
  export const firestore = getFirestore(app);
  export const database = getDatabase(app);
  export const auth = getAuth(app);