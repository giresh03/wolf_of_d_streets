# 📁 Project Structure - Wolf of D Street

```
wolf_of_d_street/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS setup
│   ├── postcss.config.js            # PostCSS config
│   ├── index.html                   # HTML entry point
│   ├── firestore.rules              # Firebase security rules
│   └── .gitignore                   # Git ignore rules
│
├── 📄 Documentation
│   ├── README.md                    # Project overview and setup
│   ├── SETUP.md                     # Detailed setup instructions
│   ├── PROJECT_INFO.md              # Feature documentation
│   └── PROJECT_STRUCTURE.md         # This file
│
├── 🛠️ Scripts
│   └── install.sh                   # Installation script
│
└── 📂 src/                          # Source code directory
    │
    ├── 📄 Core Files
    │   ├── main.jsx                 # React entry point
    │   ├── App.jsx                  # Main app component with routing
    │   ├── firebase.js              # Firebase configuration
    │   └── index.css                # Global styles
    │
    └── 📂 pages/                    # Page components
        ├── TradingPage.jsx          # Main trading interface
        ├── AdminPanel.jsx           # Admin dashboard
        └── AdminLogin.jsx           # Admin authentication

```

## 📋 File Descriptions

### Configuration Files

#### `package.json`
- Defines project dependencies (React, Vite, Firebase, Tailwind)
- Contains npm scripts (dev, build, preview)
- Metadata and version info

#### `vite.config.js`
- Vite build tool configuration
- React plugin integration
- Development server settings

#### `tailwind.config.js`
- Tailwind CSS configuration
- Custom colors and theme extensions
- Content paths for purging unused CSS

#### `postcss.config.js`
- PostCSS setup for Tailwind
- Autoprefixer configuration

#### `index.html`
- HTML template
- Root div for React mounting
- Script tags for entry point

#### `firestore.rules`
- Firebase Firestore security rules
- Teams collection: read/write allowed
- Transactions collection: read/create allowed, delete disabled

---

### Source Files (`src/`)

#### Core Files

**`main.jsx`**
- React application entry point
- Renders App component to DOM
- Strict mode enabled

**`App.jsx`**
- Main application component
- React Router setup
- Defines all routes:
  - `/` → TradingPage
  - `/admin` → AdminLogin
  - `/admin/dashboard` → AdminPanel

**`firebase.js`**
- Firebase initialization
- Exports: `auth`, `db`, `storage`
- Configuration placeholder (to be updated)

**`index.css`**
- Global CSS styles
- Tailwind directives (@tailwind base/components/utilities)
- Base font and smooth scrolling

---

### Page Components

**`TradingPage.jsx`** (Main Team Interface)
- **Lines 1-20**: Imports and initial state
- **Lines 22-35**: Load saved team data on mount
- **Lines 37-56**: Load team data from Firebase
- **Lines 58-80**: Set initial capital handler
- **Lines 82-132**: Buy stocks handler
- **Lines 134-198**: Sell stocks handler
- **Lines 200-204**: Calculate portfolio value
- **Lines 206-400**: JSX render
  - Capital setup form (if not set)
  - Portfolio summary cards
  - Video player section
  - Trading controls (buy/sell)
  - Holdings display

**Features Implemented:**
✅ Capital input and setup
✅ Video player with play/pause
✅ Buy/sell with quantity input
✅ Real-time portfolio calculations
✅ Balance tracking
✅ Capital protection warnings
✅ Transaction history
✅ Portfolio holdings display
✅ Firebase integration

**`AdminPanel.jsx`** (Admin Dashboard)
- **Lines 1-10**: Imports
- **Lines 12-28**: Auth check and data refresh
- **Lines 30-60**: Load teams and calculate values
- **Lines 62-77**: Load team transactions
- **Lines 79-85**: Select team handler
- **Lines 87-104**: Reset team handler
- **Lines 106-115**: Filter teams
- **Lines 117-120**: Logout handler
- **Lines 122-300+**: JSX render
  - Header with logout
  - Search and sort controls
  - Leaderboard list
  - Team details panel
  - Transaction history

**Features Implemented:**
✅ Password authentication
✅ Real-time leaderboard
✅ Search and filter teams
✅ Team details view
✅ Transaction monitoring
✅ Reset team functionality
✅ Auto-refresh every 5 seconds
✅ Profit/loss calculations

**`AdminLogin.jsx`** (Admin Login Page)
- **Lines 1-10**: Imports
- **Lines 12-18**: State and password constant
- **Lines 20-28**: Login handler
- **Lines 30-65**: JSX render (login form)

**Features Implemented:**
✅ Password-protected login
✅ Session management
✅ Navigation to dashboard
✅ Back to trading page link

---

## 🔑 Key Components Breakdown

### TradingPage Component

**State Variables:**
- `teamName`: Team identifier
- `capital`: Initial capital input
- `initialCapital`: Set capital value
- `currentCapital`: Current balance
- `stockPrice`: Current stock price
- `stockQuantity`: Input for shares to trade
- `portfolio`: Array of stock holdings
- `transactions`: Transaction history
- `videoUrl`: Video embed URL
- `isPlaying`: Video play state
- `showCapitalForm`: UI state
- `balance`: Available balance

**Key Functions:**
- `handleSetCapital()`: Save initial capital to Firebase
- `handleBuy()`: Process stock purchase
- `handleSell()`: Process stock sale
- `calculatePortfolioValue()`: Total portfolio calculation

### AdminPanel Component

**State Variables:**
- `teams`: Array of all teams
- `selectedTeam`: Currently viewed team
- `teamTransactions`: Selected team's transactions
- `searchTerm`: Search filter
- `sortBy`: Sort criterion

**Key Functions:**
- `loadTeams()`: Fetch all teams from Firebase
- `loadTeamTransactions()`: Fetch team-specific transactions
- `handleSelectTeam()`: View team details
- `handleResetTeam()`: Reset team data
- `handleLogout()`: End admin session

---

## 📊 Data Flow

### Trading Flow
```
User Input → Validation → 
Update Firebase → 
Update Local State → 
Refresh UI
```

### Admin Flow
```
Login → 
Load Teams → 
Display Leaderboard → 
Select Team → 
Load Transactions → 
Display Details
```

---

## 🎨 Styling Approach

- **Utility-First**: Tailwind CSS classes directly in JSX
- **Responsive**: Mobile-first design with breakpoints
- **Modern**: Glassmorphism, gradients, shadows
- **Color Scheme**:
  - Blue: Primary actions, balances
  - Green: Buy, profits, success
  - Red: Sell, losses, errors
  - Yellow: Portfolio values
  - Purple: Admin panel
  - Gray: Backgrounds, secondary

---

## 🔐 Security Implementation

### Client-Side
- Input validation for buy/sell
- Capital check before transactions
- Admin password check

### Backend (Firebase)
- Firestore security rules
- Transaction immutability
- Read/write permissions

---

## 🚀 Build & Deployment

### Development
```bash
npm run dev      # Start dev server (http://localhost:5173)
```

### Production
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

---

## 📦 Dependencies Breakdown

### Production
- `react`: UI library
- `react-dom`: DOM rendering
- `react-router-dom`: Client-side routing
- `firebase`: Backend services

### Development
- `@vitejs/plugin-react`: Vite React plugin
- `vite`: Build tool
- `tailwindcss`: CSS framework
- `postcss`: CSS processing
- `autoprefixer`: CSS vendor prefixes

---

## 🎯 Naming Conventions

- **Components**: PascalCase (`TradingPage.jsx`)
- **Functions**: camelCase (`handleBuy`)
- **Variables**: camelCase (`teamName`)
- **Files**: PascalCase for components, lowercase for configs
- **Folders**: lowercase (`pages/`, `src/`)

---

## 📝 Code Organization Principles

1. **Single Responsibility**: Each component has one purpose
2. **Reusability**: Components can be easily extended
3. **Separation of Concerns**: UI, logic, and data separate
4. **Clear Naming**: Self-documenting code
5. **Comments**: Complex logic explained
6. **Consistent Formatting**: Prettier/ESLint ready

---

## 🔄 Update Path

To extend this project:
1. Add new components in `src/pages/` or `src/components/`
2. Update routes in `src/App.jsx`
3. Extend Firebase schema in component files
4. Add UI elements following existing patterns
5. Test thoroughly before event

---

**This structure supports 40 teams efficiently and can scale with proper Firebase configuration.**


