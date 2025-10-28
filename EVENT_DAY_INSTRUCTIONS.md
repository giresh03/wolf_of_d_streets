# 🎬 Event Day Instructions - Wolf of D Street

## 🚀 **LAUNCH CHECKLIST**

### **30 Minutes Before Event:**

1. **Start the Server:**
   ```bash
   npm run dev
   ```
   ✅ Server runs at: http://localhost:5173

2. **Test System:**
   - Open http://localhost:5173
   - Register a test team
   - Login and verify trading works
   - Open admin panel: http://localhost:5173/admin
   - Verify Round 1 is active

3. **Prepare Materials:**
   - Write down round passwords
   - Share team URL with participants
   - Keep admin panel open on your device

---

## 📢 **OPENING ANNOUNCEMENT (5 min)**

**Say to Participants:**

"Welcome to Wolf of D Street! Here's how it works:

1. **Open the website**: http://localhost:5173 on your device

2. **Register your team**:
   - Click 'Register'
   - Enter your team name (unique)
   - Create a password (min 6 characters)
   - Remember your credentials!

3. **You'll get ₹10,000** initial capital

4. **Trade 2 stocks** across **12 rounds**

5. **How to trade:**
   - Watch the stock market video
   - Pause when you see interesting prices
   - Read the price from the graph
   - Enter the price manually
   - Enter how many shares
   - Click Buy or Sell

6. **Goal:** Highest portfolio value wins!

Let's begin!"

---

## 🎯 **RUNNING THE 12 ROUNDS**

### **Round 1 (Active by Default):**

1. **Announce:** "Round 1 begins now! Watch the video."
2. **Wait:** 5-10 minutes for teams to trade
3. **Monitor:** Check admin panel for activity

### **Round 2-12:**

**For Each Round:**

1. **Announce:** "Moving to Round 2 in 30 seconds!"
2. **Go to Admin Panel** → Round Manager
3. **Enter Password:** `round2wolf`
4. **Click:** "Unlock & Activate"
5. **Confirm:** "✅ Round 2 activated successfully!"
6. **Announce:** "Round 2 is live! New video available."
7. **Wait:** 5-10 minutes
8. **Repeat** for remaining rounds

### **Timing Guide:**
- Each round: 5-10 minutes
- Total time: 60-120 minutes
- Adjust based on team activity

---

## 🏆 **DETERMINING THE WINNER**

### **After Round 12:**

1. **Go to Admin Panel**
2. **Check Leaderboard** (sorted by portfolio value)
3. **Top 3 Teams:**
   ```
   1st: Team Alpha   - ₹12,500 (+25%)
   2nd: Team Beta    - ₹11,800 (+18%)
   3rd: Team Gamma   - ₹11,200 (+12%)
   ```

4. **Click on Team** to see detailed breakdown
5. **Verify Results**
6. **Announce Winners!**

---

## 📋 **TEAM QUICK REFERENCE CARD**

**(Print and distribute to teams)**

```
╔════════════════════════════════════════╗
║   WOLF OF D STREET - QUICK GUIDE       ║
╠════════════════════════════════════════╣
║                                        ║
║ 🔐 LOGIN:                              ║
║ URL: http://localhost:5173             ║
║ Register with team name + password     ║
║                                        ║
║ 💰 STARTING CAPITAL:                   ║
║ ₹10,000                                ║
║                                        ║
║ 📊 STOCKS:                             ║
║ • Stock 1 (Purple)                     ║
║ • Stock 2 (Pink)                       ║
║                                        ║
║ 🎯 HOW TO TRADE:                       ║
║ 1. Watch video                         ║
║ 2. Pause video                         ║
║ 3. Read price from graph               ║
║ 4. Enter price manually                ║
║ 5. Enter quantity                      ║
║ 6. Click Buy or Sell                   ║
║                                        ║
║ 🏆 GOAL:                               ║
║ Highest Portfolio Value Wins!          ║
║                                        ║
║ 📱 NEED HELP?                          ║
║ Ask event organizers                   ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🆘 **TROUBLESHOOTING**

### **Team Can't Login:**
- **Check:** Team name spelling
- **Check:** Password correct (case-sensitive)
- **Solution:** Try re-registering with different name

### **Video Not Playing:**
- **Check:** Internet connection
- **Check:** Browser supports video
- **Solution:** Refresh page or try different browser

### **Transaction Not Saving:**
- **Check:** Price entered correctly
- **Check:** Quantity is valid number
- **Solution:** Try again or contact admin

### **Team Forgot Password:**
- **Admin:** Go to team details
- **Admin:** Reset team data
- **Team:** Re-register with same name

---

## 📊 **ADMIN DASHBOARD GUIDE**

### **Main Sections:**

1. **Round Manager (Top)**
   - See current active round
   - Unlock next rounds with password
   - Reset to Round 1 if needed

2. **Leaderboard (Left)**
   - All teams sorted by portfolio value
   - Search teams by name
   - Click to see details

3. **Team Details (Right)**
   - Capital and shares
   - Transaction history
   - Reset option

### **Common Admin Actions:**

| Action | Steps |
|--------|-------|
| Activate Round 2 | Type `round2wolf` → Click Unlock |
| Check Team | Click team name in leaderboard |
| View Transactions | Select team → See transaction list |
| Reset Team | Select team → Click Reset Team |
| Logout | Click Logout button (top-right) |

---

## ⏱️ **EVENT TIMELINE**

### **Sample 90-Minute Event:**

```
0:00 - 0:05   Opening & Instructions
0:05 - 0:10   Team Registration
0:10 - 0:15   Round 1
0:15 - 0:20   Round 2
0:20 - 0:25   Round 3
0:25 - 0:30   Round 4
0:30 - 0:35   Round 5
0:35 - 0:40   Round 6
0:40 - 0:50   Break (Optional)
0:50 - 0:55   Round 7
0:55 - 1:00   Round 8
1:00 - 1:05   Round 9
1:05 - 1:10   Round 10
1:10 - 1:15   Round 11
1:15 - 1:20   Round 12
1:20 - 1:30   Results & Winner Announcement
```

---

## 🎯 **WINNING STRATEGIES (For Teams)**

1. **Observe Carefully** - Read graph prices accurately
2. **Buy Low, Sell High** - Classic trading principle
3. **Diversify** - Trade both stocks
4. **Time Your Trades** - Don't rush decisions
5. **Track Your Progress** - Monitor portfolio value
6. **Learn from History** - Review past transactions
7. **Manage Capital** - Don't spend everything at once
8. **Team Collaboration** - One watches, one enters data

---

## 📞 **SUPPORT CONTACTS**

**During Event:**
- Tech Support: [Your contact]
- Co-organizer: [Their contact]
- Venue Staff: [Their contact]

**After Event:**
- Feedback: [Your email]
- Issues: [Support email]

---

## ✅ **FINAL CHECKLIST**

### **Before Starting:**
- [ ] Server running (`npm run dev`)
- [ ] Tested team login
- [ ] Tested admin panel
- [ ] Round 1 active
- [ ] Round passwords written down
- [ ] Team URL shared
- [ ] Admin panel open
- [ ] Backup device ready
- [ ] Internet stable

### **After Event:**
- [ ] Screenshot final leaderboard
- [ ] Export data (if needed)
- [ ] Thank participants
- [ ] Announce winner
- [ ] Collect feedback
- [ ] Stop server

---

## 🎊 **YOU'RE READY!**

**Everything is set up and working:**

✅ Team login system
✅ Dual-stock trading
✅ Manual price entry
✅ 12-round management
✅ Complete transaction tracking
✅ Admin control panel
✅ Leaderboard system
✅ Responsive design

**Start your event and have fun! 🐺📈💰**

---

**For detailed documentation, see:**
- `README.md` - Full project documentation
- `QUICKSTART.md` - Quick setup guide
- `TEAM_LOGIN_SYSTEM.md` - Login system details
- `DUAL_STOCK_SYSTEM.md` - Trading system info
- `ROUND_SYSTEM_DOCUMENTATION.md` - Round management
- `ADMIN_QUICK_REFERENCE.md` - Admin guide


