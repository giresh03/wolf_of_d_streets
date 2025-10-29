# 🚀 Deploy OC Portal to Production

## ✅ Build Successful!

Your OC portal is integrated and ready to deploy to: **wolfofdstreet.vercel.app**

---

## 🎯 What's Included in Deployment

### New Features:
- ✅ OC Portal Login (`/oc`)
- ✅ OC Portal Dashboard (`/oc/portal`)
- ✅ Team Credentials & Attendance
- ✅ Money Management for Round 2
- ✅ Password masking with show/hide toggle
- ✅ Search and select teams
- ✅ Add/Deduct money functionality
- ✅ Real-time updates

### All Portals Integrated:
- ✅ Team Login (`/`)
- ✅ Trading Page (`/trading`)
- ✅ Admin Panel (`/admin` & `/admin/dashboard`)
- ✅ OC Portal (`/oc` & `/oc/portal`) - NEW!

---

## 📋 Deployment Steps

### Step 1: Commit All Changes

```bash
cd /Users/gireshkumar/wolf_of_d_street

# Add all OC portal files
git add src/pages/OCLogin.jsx
git add src/pages/OCPortal.jsx
git add src/App.jsx
git add src/pages/AdminPanel.jsx
git add src/pages/TeamLogin.jsx
git add src/pages/AdminLogin.jsx
git add src/pages/TradingPage.jsx
git add src/components/TeamCredentials.jsx
git add firestore.rules
git add README.md

# Add OC documentation
git add OC_*.md
git add ROUND_2_FAKE_NEWS_WORKFLOW.md

# Commit
git commit -m "Add OC Portal for organizing committee - Round 2 fake news game management"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

### Step 3: Deploy to Vercel (Automatic)

Vercel will automatically deploy when you push to GitHub!

**OR manually deploy:**

```bash
# If you have Vercel CLI
vercel --prod

# Or
npm run build
vercel deploy --prod
```

---

## 🌐 After Deployment

Your site will be live at: **https://wolfofdstreet.vercel.app**

### Access URLs:

| Portal | URL | Password |
|--------|-----|----------|
| Team Login | https://wolfofdstreet.vercel.app/ | Individual team passwords |
| Trading | https://wolfofdstreet.vercel.app/trading | After login |
| Admin Login | https://wolfofdstreet.vercel.app/admin | `wolf2024` |
| Admin Dashboard | https://wolfofdstreet.vercel.app/admin/dashboard | After admin login |
| **OC Login** | **https://wolfofdstreet.vercel.app/oc** | **`ocwolf2024`** |
| **OC Portal** | **https://wolfofdstreet.vercel.app/oc/portal** | **After OC login** |

---

## 🔐 OC Portal Credentials

**URL**: https://wolfofdstreet.vercel.app/oc  
**Password**: `ocwolf2024`

**Share only with OC members!**

---

## 🔥 Deploy Firebase Rules (Required!)

After deploying to Vercel, deploy your Firebase rules:

### Method 1: Firebase Console

1. Go to: https://console.firebase.google.com
2. Select: **wolf-of-d-street**
3. Click **Firestore Database** → **Rules** tab
4. Copy content from `/Users/gireshkumar/wolf_of_d_street/firestore.rules`
5. Paste and click **Publish**

---

## ✅ Verification Checklist

After deployment, verify:

### Test All Portals:
- [ ] https://wolfofdstreet.vercel.app/ - Team login works
- [ ] https://wolfofdstreet.vercel.app/trading - Trading page loads
- [ ] https://wolfofdstreet.vercel.app/admin - Admin login works
- [ ] https://wolfofdstreet.vercel.app/admin/dashboard - Admin dashboard loads
- [ ] https://wolfofdstreet.vercel.app/oc - **OC login works**
- [ ] https://wolfofdstreet.vercel.app/oc/portal - **OC portal loads**

### Test OC Portal Features:
- [ ] Team credentials display
- [ ] Password show/hide toggle works
- [ ] Search teams functionality
- [ ] Select team (green highlight)
- [ ] Add money to team
- [ ] Deduct money from team
- [ ] Capital updates in real-time
- [ ] Changes sync to admin panel

---

## 🎮 OC Portal Features

### Tab 1: Credentials & Attendance
- Full team list with all 50 teams
- Team names and passwords (masked by default)
- Show/Hide passwords toggle
- Attendance tracking
- Login status indicators
- Search and filter

### Tab 2: Manage Money
- Search and select teams
- Default ₹300 amount
- Quick buttons (₹300, ₹500, ₹1000)
- Add money button (green)
- Deduct money button (red)
- Real-time capital updates
- Round 2 fake news game rules

---

## 📞 Share with Team

### For OC Members:
```
🎯 OC Portal Access

URL: https://wolfofdstreet.vercel.app/oc
Password: ocwolf2024

Features:
- View team credentials
- Manage Round 2 fake news game
- Add/Deduct ₹300 for correct/wrong answers
- Real-time updates

Documentation: See OC_PORTAL_GUIDE.md
```

### For Admin:
```
🔐 Admin Panel Access

URL: https://wolfofdstreet.vercel.app/admin
Password: wolf2024

Tabs:
- Rounds: Manage 12 rounds
- Credentials: Team attendance
- Leaderboard: Rankings
```

---

## 🚀 Deployment Command Summary

```bash
# Navigate to project
cd /Users/gireshkumar/wolf_of_d_street

# Add all changes
git add .

# Commit
git commit -m "Add OC Portal with credentials and money management"

# Push (auto-deploys to Vercel)
git push origin main

# Or manual Vercel deploy
vercel --prod
```

---

## ⚡ Quick Deploy (Copy-Paste)

```bash
cd /Users/gireshkumar/wolf_of_d_street && \
git add . && \
git commit -m "Add OC Portal for Round 2 fake news game management" && \
git push origin main
```

---

## 📚 Documentation Included

All OC portal documentation will be deployed:
- `OC_PORTAL_GUIDE.md` - Complete guide
- `OC_QUICK_REFERENCE.md` - Quick reference card
- `OC_CREDENTIALS_REFERENCE.md` - Team credentials
- `OC_PORTAL_IMPLEMENTATION.md` - Technical docs
- `ROUND_2_FAKE_NEWS_WORKFLOW.md` - Workflow guide

---

## ✨ Your Complete System (After Deployment)

### Live Site: **wolfofdstreet.vercel.app**

**Portals:**
1. **Team Portal** - 50 teams can login and trade
2. **Admin Portal** - Manage rounds, view leaderboard, team credentials
3. **OC Portal** - NEW! Manage Round 2 fake news game

**All integrated, all deployed to same domain!**

---

**Ready to deploy? Run the commands above!** 🚀

