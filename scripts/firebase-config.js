  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import {getFirestore} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  import {getDatabase} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuL_FwjRmFleSY05Ts2vN27g6HTLgwpq4",
  authDomain: "fir-bootcamp-35241.firebaseapp.com",
  projectId: "fir-bootcamp-35241",
  storageBucket: "fir-bootcamp-35241.firebasestorage.app",
  messagingSenderId: "917639417912",
  appId: "1:917639417912:web:a0f5c015260ee8140656cd",
  databaseURL: "https://fir-bootcamp-35241-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const firestore = getFirestore(app);
 export const database = getDatabase(app);
 export const auth = getAuth(app);