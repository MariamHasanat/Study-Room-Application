# Study Room Application

A web application for managing study time with Firebase Authentication and Firestore.

##  How to Run

### 1. Start Local Server
```bash
 Or using Live Server in VS Code
```

### 2. Open Application
Open your browser and go to: `http://localhost:8000`

##  Common Issues & Solutions

### Issue: Account Creation Fails
**Solution:**
1. Make sure you're running a local server (don't open files directly)
2. Check Firebase configuration
3. Ensure password contains:
   - At least 6 characters
   - Uppercase letter
   - Lowercase letter
   - Number

### Issue: Login Fails
**Solution:**
1. Make sure account was created successfully
2. Check email and password are correct
3. Check Console for errors

### Issue: Data Not Loading
**Solution:**
1. Check internet connection
2. Verify Firebase settings
3. Clear browser cache

## Project Structure

```
Study-Room-Application/
├── index.html              # Main page
├── pages/
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── home.html           # User dashboard
│   └── study.html          # Study page
├── scripts/
│   ├── firebase-config.js  # Firebase configuration
│   ├── login.js            # Login logic
│   ├── signup.js           # Signup logic
│   ├── home.js             # Dashboard logic
│   ├── study.js            # Study logic
│   ├── delete-subject.js   # Delete subjects
│   └── ...                 # Other files
├── static/
│   ├── style.css           # General styling
│   ├── login.css           # Login styling
│   ├── signup.css          # Signup styling
│   ├── home.css            # Dashboard styling
│   └── study.css           # Study page styling
└── assets/                 # Images and icons
```

##  Features

- **User Authentication**: Email/password and Google sign-in
- **Study Time Tracking**: Individual subject time tracking
- **Subject Management**: Add and delete subjects
- **Real-time Timer**: Live study session timer
- **Responsive Design**: Works on all devices
- **Data Persistence**: Firebase Firestore integration

##  Authentication

- Firebase Authentication
- Email/Password login
- Google Sign-in
- Secure password requirements
- User data stored in Firestore

##  Study Features

- **Add Subjects**: Create new study subjects
- **Delete Subjects**: Remove subjects with confirmation
- **Time Tracking**: Track study time per subject
- **Session Timer**: Real-time study session timer
- **Progress Storage**: Data saved to Firebase

##  Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Realtime Database)
- **Styling**: Custom CSS with responsive design
- **Icons**: Material Symbols, Custom SVG icons

##  Important Notes

1. **Must run local server** - Don't open files directly
2. **Internet connection required** - Firebase needs internet
3. **Use modern browser** - Chrome, Firefox, Safari
4. **Clear cache** if you encounter issues

## Troubleshooting

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages

## Quick Start

1. Clone or download the project
2. Run: Run As Live Server 
3. Create account and start studying!

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security

- Passwords are not stored in Firestore
- Firebase handles authentication securely
- HTTPS required for production
- Data encrypted in transit

---

**Happy Studying!** 