Here’s a clear map showing the flow of Firebase usage in your application:

---

## **Firebase Usage Flow Map**

```
[ App Start / User Login ]
           |
           v
[ firebase-config.js ]
  - Initializes Firebase App
  - Exports Firestore and Realtime Database instances
           |
           v
[ home.js (and other scripts) ]
  |         |                |
  |         |                |
  |         |                |
  |         |                |
  |         |                |
  |         |                |
  v         v                v
[ Firestore ]         [ Realtime Database ]
  |                          |
  |                          |
  |                          |
  |                          |
