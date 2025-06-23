
---

## What is Firestore’s `onSnapshot`?

- `onSnapshot` is a function from the Firestore SDK that lets your app **listen for real-time updates** to a document or collection.
- When the data changes in Firestore (by any user, anywhere), your callback runs immediately with the new data—no need to refresh or poll.

---

## How Can You Build It?

Suppose you want your subject list to update in real time when any subject is added/changed in Firestore.  
Here’s how you’d use `onSnapshot`:

```javascript
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get a reference to the user document
const userRef = doc(firestore, "users", userEmail);

// Listen for real-time updates
onSnapshot(userRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    // Update your UI with the new data
    renderSubjects(data.subjects);
  }
});
```
- `renderSubjects` would be your function to update the subject list in the UI.

---

## What is the Advantage?

- **Instant UI updates:** If you or another user adds/changes a subject, everyone listening sees the change immediately—no refresh needed.
- **Live collaboration:** Multiple users can see changes in real time (like Google Docs).
- **No polling:** More efficient than repeatedly fetching data.

---

## Summary

- `onSnapshot` = real-time sync between Firestore and your UI.
- Use it to keep your app’s data always up-to-date for all users.
- It’s easy to add—just replace your one-time `getDoc` with `onSnapshot` and update your UI in the callback.