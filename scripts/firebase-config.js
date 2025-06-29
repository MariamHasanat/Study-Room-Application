
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import{getDatabase} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import{getFirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAEPDxb9DjqOnVPVTmJZ0kul3MODcguXi4",
    authDomain: "fir-bootcamp-45b64.firebaseapp.com",
    projectId: "fir-bootcamp-45b64",
    storageBucket: "fir-bootcamp-45b64.firebasestorage.app",
    messagingSenderId: "847105901177",
    appId: "1:847105901177:web:c75c57c543e3e3da894aa8",
    databaseURL:"https://fir-bootcamp-45b64-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const firestore=getFirestore(app);
  export const database=getDatabase(app)
