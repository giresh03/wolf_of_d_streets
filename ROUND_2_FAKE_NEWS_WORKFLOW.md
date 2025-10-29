# Round 2 - Fake News Game Workflow

## 📋 Complete Process Flow

---

## 🎪 Game Setup

```
┌──────────────────────────────────────┐
│  BEFORE ROUND 2                      │
├──────────────────────────────────────┤
│  1. Admin announces Round 2          │
│  2. Admin sets Round 2 prices        │
│  3. OC members login to /oc          │
│  4. OC members ready at stations     │
│  5. Auctioneer prepares news items   │
└──────────────────────────────────────┘
```

---

## 🎯 Game Flow - Correct Answer

```
┌────────────────────────────────────────────────────────┐
│  FAKE NEWS - CORRECT IDENTIFICATION (+₹300)            │
└────────────────────────────────────────────────────────┘

Step 1: Announcement
┌──────────────────┐
│  🎤 Auctioneer   │  "Breaking News: XYZ Company launches
│  announces news  │   new product. Is this REAL or FAKE?"
└────────┬─────────┘
         │
         ▼
Step 2: Team Response
┌──────────────────┐
│  ✋ Team Leader  │  Raises pluck card quickly
│  raises card    │  First to respond
└────────┬─────────┘
         │
         ▼
Step 3: Team Answer
┌──────────────────┐
│  🗣️ Team says:   │  "This news is FAKE!"
│  "FAKE"          │  
└────────┬─────────┘
         │
         ▼
Step 4: Verification
┌──────────────────┐
│  ✅ Auctioneer   │  "Correct! This news was FAKE."
│  confirms        │  "Team Alpha gets +₹300"
└────────┬─────────┘
         │
         ▼
Step 5: OC Action - ADD MONEY
┌──────────────────────────────────────┐
│  OC MEMBER ACTIONS:                  │
│  1. 🔍 Search "Team Alpha"           │
│  2. 👆 Click on Team Alpha row       │
│  3. ✅ See green highlight           │
│  4. 💰 Amount already set to ₹300    │
│  5. ➕ Click "Add Money" button      │
│  6. ✓ Click OK in confirmation       │
│  7. 🎉 Success message appears       │
└────────┬─────────────────────────────┘
         │
         ▼
Step 6: System Update
┌──────────────────────────────────────┐
│  🔄 AUTOMATIC UPDATES:               │
│  • Team Alpha capital: 10,000→10,300 │
│  • Firebase database updated         │
│  • Admin panel refreshes             │
│  • Team sees updated capital         │
│  • All portals synced                │
└──────────────────────────────────────┘
```

---

## ❌ Game Flow - Wrong Answer

```
┌────────────────────────────────────────────────────────┐
│  REAL NEWS - WRONG IDENTIFICATION (-₹300)              │
└────────────────────────────────────────────────────────┘

Step 1: Announcement
┌──────────────────┐
│  🎤 Auctioneer   │  "Stock market reaches all-time high.
│  announces news  │   Is this REAL or FAKE?"
└────────┬─────────┘
         │
         ▼
Step 2: Team Response
┌──────────────────┐
│  ✋ Team Leader  │  Raises pluck card
│  raises card    │  
└────────┬─────────┘
         │
         ▼
Step 3: Team Answer
┌──────────────────┐
│  🗣️ Team says:   │  "This news is FAKE!"
│  "FAKE"          │  
└────────┬─────────┘
         │
         ▼
Step 4: Verification
┌──────────────────┐
│  ❌ Auctioneer   │  "Wrong! This news was REAL."
│  says wrong      │  "Team Beta loses ₹300"
└────────┬─────────┘
         │
         ▼
Step 5: OC Action - DEDUCT MONEY
┌──────────────────────────────────────┐
│  OC MEMBER ACTIONS:                  │
│  1. 🔍 Search "Team Beta"            │
│  2. 👆 Click on Team Beta row        │
│  3. ✅ See green highlight           │
│  4. 💰 Amount already set to ₹300    │
│  5. ➖ Click "Deduct Money" button   │
│  6. ✓ Click OK in confirmation       │
│  7. 🎉 Success message appears       │
└────────┬─────────────────────────────┘
         │
         ▼
Step 6: System Update
┌──────────────────────────────────────┐
│  🔄 AUTOMATIC UPDATES:               │
│  • Team Beta capital: 10,000→9,700   │
│  • Firebase database updated         │
│  • Admin panel refreshes             │
│  • Team sees updated capital         │
│  • All portals synced                │
└──────────────────────────────────────┘
```

---

## 🎯 Scoring Summary

| Situation | Team Action | Result | OC Action |
|-----------|-------------|--------|-----------|
| Real News | Says "REAL" | ✅ Correct | ➕ Add ₹300 |
| Real News | Says "FAKE" | ❌ Wrong | ➖ Deduct ₹300 |
| Fake News | Says "FAKE" | ✅ Correct | ➕ Add ₹300 |
| Fake News | Says "REAL" | ❌ Wrong | ➖ Deduct ₹300 |

---

## 👥 Team Roles

### Auctioneer
- Announces news items
- Waits for team responses
- Verifies answers (correct/wrong)
- Announces result to OC members

### Team Leaders
- Listen to news announcement
- Discuss with team (if time allows)
- Raise pluck card to respond
- State answer: "REAL" or "FAKE"

### OC Members
- Monitor assigned teams
- Listen to auctioneer's verification
- Search and select correct team in portal
- Add or deduct ₹300 based on result
- Verify success message

### Admin
- Oversees entire round
- Monitors leaderboard
- Handles disputes
- Ensures smooth operation

---

## 🔄 Quick Reference - OC Member Steps

### ✅ For CORRECT Answer (Add Money)
```
Search Team → Click Team → Click "Add Money" → Confirm → Done!
```

### ❌ For WRONG Answer (Deduct Money)
```
Search Team → Click Team → Click "Deduct Money" → Confirm → Done!
```

---

## 📊 Example Round 2 Scenario

### News Item 1: FAKE News
```
Auctioneer: "Company XYZ announces bankruptcy"
Team Alpha: Raises card → Says "FAKE"
Auctioneer: "Correct! ✅ +₹300"
OC Member: Searches Team Alpha → Add ₹300 → Confirm
Result: Team Alpha: 10,000 → 10,300
```

### News Item 2: REAL News
```
Auctioneer: "Stock market hits record high"
Team Beta: Raises card → Says "FAKE"
Auctioneer: "Wrong! ❌ This was REAL. -₹300"
OC Member: Searches Team Beta → Deduct ₹300 → Confirm
Result: Team Beta: 10,000 → 9,700
```

### News Item 3: REAL News
```
Auctioneer: "Government announces new policy"
Team Gamma: Raises card → Says "REAL"
Auctioneer: "Correct! ✅ +₹300"
OC Member: Searches Team Gamma → Add ₹300 → Confirm
Result: Team Gamma: 10,000 → 10,300
```

---

## ⚡ Speed is Key!

### Tips for Fast Processing:
1. **Pre-search teams** you're monitoring
2. **Keep portal open** and ready
3. **Listen carefully** to auctioneer's verification
4. **One click** to select team
5. **One click** to add/deduct
6. **Confirm immediately**
7. **Move to next** team

### Average Processing Time:
- Search team: **2 seconds**
- Select team: **1 second**
- Add/Deduct: **1 second**
- Confirm: **1 second**
- **Total: ~5 seconds per team!**

---

## 🛡️ Safety Checks

### Built-in Safeguards:
✅ **Confirmation dialog** - Prevents accidental clicks  
✅ **Visual highlight** - Confirms correct team selected  
✅ **Success message** - Confirms action completed  
✅ **Cannot go negative** - System prevents overdraft  
✅ **Real-time sync** - All portals update immediately  

---

## 📱 Multi-Device Setup

### Recommended Configuration:
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Device 1   │  │  Device 2   │  │  Device 3   │
│             │  │             │  │             │
│  OC Member  │  │  OC Member  │  │   Admin     │
│  Teams 1-17 │  │  Teams18-34 │  │  Dashboard  │
│             │  │             │  │             │
│  /oc portal │  │  /oc portal │  │  /admin     │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🎪 Complete Round 2 Timeline

```
┌──────────────────────────────────────────────────────┐
│  ROUND 2 TIMELINE                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  0:00  ⏰ Round 2 begins                            │
│  0:30  📢 First news announcement                   │
│  1:00  ✋ Teams respond                             │
│  1:30  ✅ Verification & OC updates                │
│  2:00  📢 Second news announcement                  │
│  2:30  ✋ Teams respond                             │
│  3:00  ✅ Verification & OC updates                │
│  ...   (Continue pattern)                           │
│  15:00 ⏰ Round 2 ends                              │
│  15:30 📊 Admin reviews leaderboard                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Success Metrics

### What to Track:
- ✅ All correct answers processed
- ✅ All wrong answers processed
- ✅ No duplicate entries
- ✅ No missed teams
- ✅ Real-time updates working
- ✅ All OC members coordinated

### After Round 2:
- Verify final capitals in admin panel
- Check for any anomalies
- Review any issues
- Update leaderboard
- Prepare for Round 3

---

## 🆘 Troubleshooting During Round

| Issue | Quick Fix |
|-------|-----------|
| Team not found | Team must login first |
| Portal frozen | Refresh page (F5) |
| Wrong team selected | Click "Clear Selection" |
| Internet down | Use manual backup sheet |
| Duplicate entry | Note it, admin will fix |
| Dispute | Pause, consult admin |

---

## 📝 Manual Backup Process

If system fails, use paper tracking:

```
Time | Team | Correct/Wrong | Amount | Initial
-----|------|---------------|--------|--------
2:30 | Alpha| ✅ Correct    | +300   | GK
2:45 | Beta | ❌ Wrong      | -300   | GK
3:00 | Gamma| ✅ Correct    | +300   | GK
```

Enter into system after connectivity restored.

---

## 🎉 Round 2 Completion

### After All News Items:
1. ✅ OC members verify all entries
2. ✅ Admin checks leaderboard
3. ✅ Announce top 3 teams
4. ✅ Prepare for Round 3
5. ✅ OC members can logout

---

## 💡 Pro Tips

### For Smooth Operation:
- **Practice before** the actual round
- **Stay alert** throughout
- **Communicate** with other OC members
- **Double-check** team selection
- **Be ready** for disputes
- **Have fun!** You're making this event awesome! 🎊

---

**Remember: You're an essential part of making this event successful!**

---

*Print this workflow and keep it handy during Round 2!*


