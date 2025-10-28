# 🚀 Quick Setup Guide - Wolf of D Street

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

#### A. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create a project"
3. Enter project name: `wolf-of-d-street` (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

#### B. Enable Firestore Database

1. In Firebase Console, click on "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your preferred location (closest to your event location)
5. Click "Enable"

#### C. Enable Authentication (Optional - For Future)

1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Enable "Email/Password" provider
4. Save

#### D. Get Firebase Configuration

1. Click gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps" section
3. Click on the web icon `</>`
4. Register app name: "wolf-of-d-street"
5. Copy the `firebaseConfig` object

#### E. Update Firebase Config in Code

Open `src/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### F. Set Up Firestore Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click on "Rules" tab
3. Replace the default rules with the content from `firestore.rules` file:

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

4. Click "Publish"

### 3. Set Admin Password

1. Open `src/pages/AdminLogin.jsx`
2. Find this line (around line 9):
   ```javascript
   const ADMIN_PASSWORD = 'wolf2024';
   ```
3. Change `'wolf2024'` to your secure password

### 4. Run the Application

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 5. Test the Application

1. **Test Trading Page:**
   - Enter a team name and capital
   - Try buying/selling stocks
   - Check if data saves to Firebase

2. **Test Admin Panel:**
   - Go to http://localhost:5173/admin
   - Enter admin password
   - View leaderboard
   - Click on teams to see details

## Production Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

### Or Deploy to Other Platforms

- **Vercel**: `vercel`
- **Netlify**: Connect your Git repository
- **GitHub Pages**: Follow standard React deployment guide

## Important Notes

### For Event Day:

1. **Test with multiple teams** before the event
2. **Monitor Firebase usage** to avoid quota limits
3. **Have admin credentials** ready and secure
4. **Use stable internet** connection
5. **Keep Firebase Console** open to monitor real-time
6. **Test video URLs** work with iframe embedding

### Firebase Quota (Free Tier)

- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day
- **Storage**: 1 GB

For 40 teams with ~100 transactions each:
- ~4,000 writes ✓ (well within limit)
- ~10,000 reads ✓ (well within limit)

### Video URL Format

Accepted formats:
- YouTube: `https://www.youtube.com/embed/VIDEO_ID`
- Vimeo: `https://player.vimeo.com/video/VIDEO_ID`
- Direct links: Any URL that supports iframe embedding

To get YouTube embed URL:
1. Get YouTube video: `https://youtube.com/watch?v=ABC123`
2. Convert to embed: `https://www.youtube.com/embed/ABC123`

## Troubleshooting

### "Firebase: Error (auth/config-missing)"
- **Solution**: Update Firebase config in `src/firebase.js`

### "Permission denied" in console
- **Solution**: Check Firestore security rules are published

### Video not embedding
- **Solution**: Use embeddable URLs (YouTube embed, Vimeo embed)

### Admin panel not accessible
- **Solution**: Check admin password in `src/pages/AdminLogin.jsx`

### Build errors
- **Solution**: Make sure all dependencies installed: `npm install`

## Support

For issues during the event:
1. Check Firebase Console for errors
2. Check browser console (F12)
3. Restart development server
4. Clear browser cache if needed

## Success Checklist

- [ ] Dependencies installed
- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Security rules published
- [ ] Firebase config updated
- [ ] Admin password changed
- [ ] Test with 2-3 teams successful
- [ ] Admin panel working
- [ ] Video player working
- [ ] Buy/Sell working
- [ ] Data saving to Firebase
- [ ] Leaderboard updating


