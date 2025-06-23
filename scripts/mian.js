import {db} from './firebase-config';

import {collection, getDocs} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

const querySnapshot = await getDocs(collection(db,"users"));

querySnapshot.array.forEach((doc) => {
    const data = doc.data();
    console.log(`👤 ${data.name} - ${data.email} - Age: ${data.age}`);
});