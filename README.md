# Study Room Application 📚

A web application for managing study time that helps students organize their subjects and track time spent on each subject.

## 🚀 Main Features

### 🔐 Authentication System

- **Login and Registration** using Firebase Authentication
- **Google Sign-in** for quick and secure access
- **Complete data protection** with password encryption
- **Data validation** with clear error messages

### 📖 Subject Management

- **Add new subjects** with custom names
- **Display subject list** with study time for each subject
- **Edit study times** manually for each subject
- **Delete subjects** with confirmation to prevent errors

### ⏱️ Time Tracking

- **Interactive study timer** working in real-time
- **Auto-save** study times to database
- **Total study time** for all subjects
- **Resume sessions** in case of page closure

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase
  - **Authentication**: Firebase Auth with Google OAuth
  - **Database**: Cloud Firestore for persistent data
  - **Realtime Database**: for tracking study sessions
- **Hosting**: Can be hosted on any web server

## 📁 Project Structure

```text
Study-Room-Application/
├── index.html                 # Main page
├── pages/                     # Application pages
│   ├── home.html             # Home page (subject list)
│   ├── login.html            # Login page
│   ├── signup.html           # Registration page
│   └── study.html            # Study page (timer)
├── scripts/                   # JavaScript files
│   ├── firebase-config.js    # Firebase configuration
│   ├── home.js              # Home page logic
│   ├── login.js             # Login logic
│   ├── signup.js            # Registration logic
│   ├── study.js             # Study page logic
│   └── [other utils]        # Helper files
├── static/                   # CSS files
│   ├── style.css            # General styles
│   ├── home.css             # Home page styles
│   ├── login.css            # Login styles
│   └── [other styles]       # Other styles
├── assets/                   # Images and icons
└── README.md                # This file
```

## ⚙️ How to Run

### 1. Requirements

- **Local web server** (like Live Server in VS Code)
- **Modern browser** supporting ES6+ modules
- **Internet connection** to connect to Firebase

### 2. Firebase Setup (Required for developers)

```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other settings
};
```

### 3. Running the Application

#### Using VS Code

1. Open the project in VS Code
2. Install "Live Server" extension
3. Right-click on `index.html`
4. Select "Open with Live Server"

## 📱 How to Use

### 1. Create New Account

- Go to registration page
- Enter required data or use Google Sign-in
- You'll be redirected to home page

### 2. Add Study Subject

- Click on "+ Subject" button
- Enter subject name
- Click "Add"

### 3. Start Study Session

- Click on **subject name** or **play icon**
- Timer page will open
- Timer starts automatically
- Click "Stop Study" to end session

### 4. Edit Subject Time

- Click "Edit" button next to subject
- Enter new hours, minutes, and seconds
- Click "Save"

### 5. Delete Subject

- Click "Delete" button next to subject
- Confirm deletion in popup window

## ✨ Recent Updates

### 🔄 Authentication System Updates

- **Google Sign-in**: Added Google Sign-in button in login and registration pages
- **Enhanced Security**: Using Firebase Auth instead of manual verification
- **Better Error Handling**: Specific error messages for each case

### ⚡ Subject Management Updates

- **Time Editing**: Ability to manually edit study time for any subject
- **Safe Deletion**: Confirmation window to prevent accidental deletion

---

> This project was developed with ❤️ to help students better organize their study time
