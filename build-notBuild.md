Here’s a summary of the Firebase-related functions you have already built in your application, and what you have not built yet (based on your code and context):

---

## **Functions You Have Built**

### **Firestore (Cloud Firestore)**
- **Create a new user document:**  
  Using `setDoc` to create a new user document if it doesn’t exist (in signup.js).
- **Get user document:**  
  Using `getDoc(userRef)` to fetch user data (subjects list, etc.).
- **Update user document:**  
  Using `updateDoc(userRef, { subjects: arrayUnion(...) })` to add a new subject.
- **Set user document:**  
  (You import `setDoc`, but it’s not shown in use—could be used to create/overwrite a user document.)
- **Render subjects from Firestore:**  
  `renderSubjectsAndTotalTimeFirestore` fetches subjects and updates the UI.
- **Sync localStorage with Firestore:**  
  After fetching from Firestore, you update localStorage with the latest subjects.
- **Error handling for missing user documents:**  
  Fallback if a user document does not exist in Firestore.

### **Realtime Database**
- **Write study start timestamp:**  
  When a subject is clicked, you use `set(ref(database, ...), { startTime: ... })` to log the start time for that subject.
- **Write study end timestamp and session duration:**  
  You have already built the logic to track and store session end time and duration.
  Your app updates both the UI and the databases correctly when a study session ends.

---

## **Functions You Have Not Built (or Not Shown in Code)**

### **Firestore**
- **Delete a subject:**  
  No function to remove a subject from the Firestore subjects array.
- **Update a subject’s time:**  
  No function to update the `time` field for a subject in Firestore.
- **Listen for real-time updates:**  
  No use of Firestore’s `onSnapshot` for real-time UI updates.

### **Realtime Database**
- **Read study session data:**  
  No function to read back the study session start times or history.
- **Listen for real-time changes:**  
  No use of `onValue` or similar to listen for changes in the Realtime Database.

---

## **Other Useful Features Not Built**
- **Authentication:**  
  No code for user sign-up, login, or authentication with Firebase Auth.
- **Subject editing:**  
  No function to rename or edit a subject.
