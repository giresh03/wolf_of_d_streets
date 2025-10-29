# Wolf of D Street - Stock Market Simulation

A full-stack web application for college club events featuring stock market simulation with real-time trading, admin controls, and team management.

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wolf-of-d-street)

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/wolf-of-d-street)

## 🔧 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Firebase**: Update `src/firebase.js` with your Firebase config
4. **Run locally**: `npm run dev`
5. **Deploy**: Push to GitHub and deploy with Vercel/Netlify

## 📱 Features

- **Team Authentication**: 50 pre-defined teams with credentials
- **Real-time Trading**: Buy/sell stocks with live portfolio updates
- **Admin Panel**: Round management, team tracking, leaderboard
- **OC Portal**: Dedicated interface for organizing committee to manage Round 2 fake news game
- **Video Integration**: Stock market analysis videos with play/pause controls
- **Responsive Design**: Works on desktop and mobile devices

## 🔥 Firebase Setup

1. Create Firebase project
2. Enable Firestore Database
3. Update `src/firebase.js` with your config
4. Configure security rules

## 🎯 Usage

- **Teams**: Login at `/` with provided credentials and trade stocks
- **Admin**: Access admin panel at `/admin` to manage rounds and track teams
- **OC Members**: Access OC portal at `/oc` to manage Round 2 fake news game
- **Event Leads**: Monitor participation and manage competition flow

## 🎮 Portals Overview

### Team Login (`/`)
- 50 teams with unique credentials
- Real-time stock trading
- Portfolio management
- Transaction history

### Admin Panel (`/admin`)
- Password: `wolf2024`
- Round management (12 rounds)
- Team credentials & attendance
- Real-time leaderboard
- Manual price entry

### OC Portal (`/oc`) - NEW!
- Password: `ocwolf2024`
- Team credentials display
- Search and select teams
- Add/deduct money (±₹300)
- Round 2 fake news game management
- Real-time capital updates

## 📚 Documentation

- `OC_PORTAL_GUIDE.md` - Complete OC portal guide
- `OC_QUICK_REFERENCE.md` - Printable quick reference for event day
- `OC_CREDENTIALS_REFERENCE.md` - Credentials and tracking sheet
- `OC_PORTAL_IMPLEMENTATION.md` - Technical implementation details
- `ADMIN_QUICK_REFERENCE.md` - Admin panel guide
- `TEAM_CREDENTIALS_REFERENCE.md` - Team credentials list

Built with React, Vite, Tailwind CSS, and Firebase.