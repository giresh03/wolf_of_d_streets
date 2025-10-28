# 🔥 Firebase Setup Instructions

## **Step 1: Get Your Firebase Configuration**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: **"wolf-of-d-street"**
3. Enable **Firestore Database** (Start in test mode)
4. Go to **Project Settings** → **Your apps** → **Web app**
5. Copy your configuration object

## **Step 2: Update src/firebase.js**

Replace the demo config in `src/firebase.js` with your real Firebase config:

```javascript
// Replace this demo config:
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// With your real config:
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## **Step 3: Test Firebase Connection**

After updating the config:
1. Refresh your local development server
2. Check browser console for Firebase connection
3. Try logging in as Team Alpha
4. Check Firebase Console → Firestore → Data to see if data appears

## **Step 4: Deploy to Production**

### **Option A: Vercel (Recommended)**
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically

### **Option B: Netlify**
1. Go to [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy with default settings

## **Step 5: Configure Production Firebase**

1. In Firebase Console → **Authentication** → **Settings**
2. Add your deployed domain to **Authorized domains**
3. Update Firestore security rules for production

---

**Once you provide your Firebase config, I'll help you update the files and deploy! 🚀**
