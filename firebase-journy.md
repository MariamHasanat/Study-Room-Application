Here’s a clear step-by-step explanation of how your web app links to Firebase and uses Firestore and Realtime Database, starting from firebase-config.js:

---

### 1. **Firebase Configuration and Initialization (firebase-config.js)**

- **Import Firebase SDK modules** for app, Firestore, and Realtime Database:
  ```js
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  ```

- **Define your Firebase project configuration:**
  ```js
  export const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      // ...other config...
      databaseURL: "https://<your-project-id>.firebaseio.com/"
  };
  ```

- **Initialize the Firebase app and services:**
  ```js
  export const app = initializeApp(firebaseConfig);
  export const database = getDatabase(app);    // For Realtime Database
  export const firestore = getFirestore(app);  // For Firestore
  ```

---

### 2. **Using Firestore in Your App**

- **Import Firestore methods where needed:**
  ```js
  import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  ```

- **Get a reference to a Firestore document:**
  ```js
  const userRef = doc(firestore, "users", userEmail);
  ```

- **Read data:**
  ```js
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
      const data = userSnap.data();
      // ...use data...
  }
  ```

- **Write/update data:**
  ```js
  await setDoc(userRef, { ...data }); // Overwrites the document
  await updateDoc(userRef, { subjects: arrayUnion(newSubject) }); // Updates fields
  ```

---

### 3. **Using Realtime Database in Your App**

- **Import Realtime Database methods where needed:**
  ```js
  import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  ```

- **Get a reference to a location in the database:**
  ```js
  const userSubjectRef = ref(database, `users/${safeEmail}/subjects/${subjectName}`);
  ```

- **Write data:**
  ```js
  await set(userSubjectRef, { startTime: timestamp });
  ```

---

### 4. **How It All Connects in Your App**

- firebase-config.js exports `app`, `firestore`, and `database`.
- Other scripts (like home.js, subject-utils.js) import these and use the Firestore and Realtime Database methods as shown above.
- All Firestore and Realtime Database operations are performed using the modular v9+ syntax (functions like `doc`, `getDoc`, `ref`, `set`).

---

**Summary:**  
- firebase-config.js is the single source of truth for connecting your app to Firebase.
- You use the exported `firestore` and `database` objects with the appropriate SDK methods to read/write data in Firestore and Realtime Database throughout your app.

If you want a code sample for a specific operation or a diagram, let me know!