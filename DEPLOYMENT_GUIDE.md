# 🔥 Production Firebase Configuration Template

## **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Project name: **"wolf-of-d-street"**
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## **Step 2: Enable Firestore Database**

1. In Firebase Console → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select location closest to your users
5. Click **"Done"**

## **Step 3: Get Web App Configuration**

1. Go to **"Project Settings"** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Web app"** icon (`</>`)
4. App nickname: **"wolf-of-d-street-web"**
5. Click **"Register app"**
6. **Copy the configuration object**

## **Step 4: Update src/firebase.js**

Replace the demo configuration with your real Firebase config:

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

// With your real config (example):
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "wolf-of-d-street-xxxxx.firebaseapp.com",
  projectId: "wolf-of-d-street-xxxxx",
  storageBucket: "wolf-of-d-street-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## **Step 5: Test Firebase Connection**

1. Save the updated `firebase.js` file
2. Refresh your development server (`npm run dev`)
3. Open browser console (F12)
4. Look for Firebase connection messages
5. Try logging in as Team Alpha
6. Check Firebase Console → Firestore → Data

## **Step 6: Configure Firestore Security Rules**

In Firebase Console → Firestore → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to teams collection
    match /teams/{teamId} {
      allow read, write: if true; // For demo - secure this later
    }
    
    // Allow read/write access to transactions collection
    match /transactions/{transactionId} {
      allow read, write: if true; // For demo - secure this later
    }
    
    // Allow read/write access to settings collection
    match /settings/{settingId} {
      allow read, write: if true; // For demo - secure this later
    }
    
    // Allow read/write access to attendance collection
    match /attendance/{attendanceId} {
      allow read, write: if true; // For demo - secure this later
    }
  }
}
```

## **Step 7: Deploy to Production**

### **Option A: Vercel (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click **"New Project"**
   - Import your repository
   - Click **"Deploy"**

3. **Configure Environment Variables:**
   - In Vercel dashboard → Project → Settings → Environment Variables
   - Add your Firebase config as environment variables

### **Option B: Netlify**

1. **Push to GitHub** (same as above)

2. **Deploy with Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Click **"New site from Git"**
   - Connect GitHub repository
   - Click **"Deploy site"**

## **Step 8: Configure Production Firebase**

1. **Add Authorized Domains:**
   - Firebase Console → Authentication → Settings
   - Add your deployed domain (e.g., `your-app.vercel.app`)

2. **Update Security Rules:**
   - Consider implementing proper authentication
   - Add admin-only access for sensitive operations

## **Step 9: Test Production Deployment**

1. **Visit your deployed URL**
2. **Test team login** (Team Alpha / wolf2024alpha)
3. **Test admin login** (password: wolf2024)
4. **Verify Firebase data** appears in Firestore
5. **Test trading functionality**

---

## 🎯 **Your Live Application Will Be Available At:**

- **Vercel:** `https://your-app-name.vercel.app`
- **Netlify:** `https://your-app-name.netlify.app`

## 📱 **Share With Teams:**

Send this information to your participants:

```
🌐 Website: https://your-app-name.vercel.app
👥 Team Login: Use provided credentials
🔑 Admin Access: Password: wolf2024
📱 Mobile Friendly: Works on all devices
```

---

**Once you provide your Firebase configuration, I'll help you complete the setup and get your live URL! 🚀**
