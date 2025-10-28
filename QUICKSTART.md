# ⚡ Quick Start Guide - Wolf of D Street

## Get Running in 5 Minutes!

### Step 1: Install Dependencies
```bash
npm install
```

Or use the installation script:
```bash
chmod +x install.sh
./install.sh
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable "Firestore Database"
4. Get your config from Project Settings → General → Your apps
5. Copy the values into `src/firebase.js`

```javascript
// Replace these in src/firebase.js
const firebaseConfig = {
  apiKey: "PASTE_YOUR_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  // ... etc
};
```

### Step 3: Set Up Firestore Rules

In Firebase Console → Firestore → Rules tab, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamId} {
      allow read, write: if true;
    }
    match /transactions/{transactionId} {
      allow read, create, update: if true;
      allow delete: if false;
    }
  }
}
```

Click "Publish".

### Step 4: Change Admin Password

Open `src/pages/AdminLogin.jsx` and change line 9:

```javascript
const ADMIN_PASSWORD = 'YOUR_SECURE_PASSWORD'; // Change this!
```

### Step 5: Start the App

```bash
npm run dev
```

Open http://localhost:5173

---

## 🎮 Testing the App

### Test as a Team:
1. Enter team name: "Test Team"
2. Enter capital: "10000"
3. Click "Start Trading"
4. Buy some stocks
5. Check portfolio

### Test as Admin:
1. Go to http://localhost:5173/admin
2. Enter admin password
3. See the leaderboard
4. Click on a team to see details

---

## 📺 Adding Video

1. Get a YouTube video URL
2. Convert to embed format:
   - Original: `https://youtube.com/watch?v=ABC123`
   - Embed: `https://www.youtube.com/embed/ABC123`
3. Paste in video URL field

---

## 🚀 Deploy to Production

### Option 1: Firebase Hosting (Easiest)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify
Just drag and drop the `dist` folder to netlify.com

---

## ✅ Pre-Event Checklist

- [ ] Firebase config updated
- [ ] Security rules published
- [ ] Admin password changed
- [ ] Test with 2-3 teams
- [ ] Test admin panel
- [ ] Test buy/sell
- [ ] Test on different devices
- [ ] Have backup internet ready
- [ ] Prepare video URLs
- [ ] Test with 40 simultaneous teams

---

## 🆘 Common Issues

**Firebase errors?**
→ Check your config in `src/firebase.js`

**Admin panel not working?**
→ Check password in `src/pages/AdminLogin.jsx`

**Video not embedding?**
→ Use YouTube embed URL, not regular URL

**Build fails?**
→ Make sure all dependencies installed: `npm install`

---

## 📞 Need More Help?

See detailed guides:
- `SETUP.md` - Complete setup instructions
- `README.md` - Full documentation
- `PROJECT_INFO.md` - Feature list
- `PROJECT_STRUCTURE.md` - Code structure

---

**You're all set! Good luck with your event! 🐺📈**


