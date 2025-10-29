# OC Portal Guide - Wolf of D Street

## Overview
The OC (Organizing Committee) Portal is a dedicated interface for OC members to manage team money during Round 2 - Fake News Game. This portal allows OC members to quickly add or deduct money from teams based on their performance in identifying fake news.

## Access Information

### OC Portal Login
- **URL**: `https://your-domain.com/oc`
- **Password**: `ocwolf2024` (Change this in production!)

### Navigation Links
- OC Portal is accessible from:
  - Team Login page
  - Admin Panel
  - Admin Login page

## Features

### 1. **Team Credentials Display**
- View all team names and passwords
- Real-time attendance status (✓ for present teams)
- Current capital display for each team
- Search functionality to quickly find teams

### 2. **Search Functionality**
- Search bar at the top of the team list
- Type team name to filter results
- Case-insensitive search

### 3. **Team Selection**
- Click on any team row to select it
- Selected team is highlighted with green background
- Selected team info appears in the right panel

### 4. **Money Management**
The right panel shows:
- **Selected Team Name**: Clearly displayed
- **Current Capital**: Real-time team capital
- **Portfolio Value**: Total value including stocks
- **Amount Input**: Enter amount to add/deduct (default: ₹300)
- **Quick Amount Buttons**: 
  - ₹300 (default for fake news game)
  - ₹500
  - ₹1000
- **Reason Input**: Optional field to record reason
- **Add Money Button**: Green button to add money
- **Deduct Money Button**: Red button to deduct money

## Round 2 - Fake News Game Rules

### How It Works
1. Auctioneer announces a news item (real or fake)
2. Team leader raises pluck card if they think they know the answer
3. Team leader states whether the news is REAL or FAKE
4. OC member verifies the answer
5. OC member updates team capital accordingly

### Scoring Rules
| Scenario | Action | Amount |
|----------|--------|--------|
| Correct identification (Real news) | Add Money | +₹300 |
| Correct identification (Fake news) | Add Money | +₹300 |
| Wrong identification (Real news) | Deduct Money | -₹300 |
| Wrong identification (Fake news) | Deduct Money | -₹300 |

## Step-by-Step Usage

### Adding Money to a Team
1. **Search/Find Team**: Use the search bar or scroll to find the team
2. **Select Team**: Click on the team row (it will highlight green)
3. **Enter Amount**: Default is ₹300, or use quick buttons (₹300, ₹500, ₹1000)
4. **Add Reason** (Optional): E.g., "Correct fake news identification"
5. **Click "Add Money"**: Green ➕ button
6. **Confirm**: Click OK in the confirmation dialog
7. **Success**: You'll see a success message

### Deducting Money from a Team
1. **Search/Find Team**: Use the search bar or scroll to find the team
2. **Select Team**: Click on the team row (it will highlight green)
3. **Enter Amount**: Enter the amount to deduct (e.g., 300)
4. **Add Reason** (Optional): E.g., "Incorrect fake news identification"
5. **Click "Deduct Money"**: Red ➖ button
6. **Confirm**: Click OK in the confirmation dialog
7. **Success**: You'll see a success message

### Clearing Selection
- Click the "Clear Selection" button to deselect current team
- This resets the form to default state

## Important Notes

### Real-Time Updates
- Team data refreshes every 2 seconds automatically
- Changes are reflected immediately across all portals
- Team capital updates are synced with Firebase

### Safeguards
- **Cannot deduct more than current capital**: System will alert if deduction exceeds available capital
- **Confirmation dialogs**: All transactions require confirmation before executing
- **Clear feedback**: Success/error messages for every action

### Data Storage
- **Firebase Mode** (Production): All changes are stored in Firebase and synced across all devices
- **LocalStorage Mode** (Demo): Changes stored locally in browser

## Team Credentials Feature

### What It Shows
- Team number (1, 2, 3, etc.)
- Team name
- Team password (for reference)
- Current capital
- Attendance status (✓ for present)

### Sorting and Filtering
- Teams are sorted alphabetically by name
- Search filters teams in real-time
- Present teams marked with green checkmark

## Security

### Password Protection
- Only OC members with correct password can access
- Separate from Admin password
- Change default password in production

### Change OC Password
Edit this line in `/src/pages/OCLogin.jsx`:
```javascript
const OC_PASSWORD = 'ocwolf2024'; // Change this!
```

## Troubleshooting

### Issue: Team not found
- **Solution**: Make sure team has logged in at least once
- Teams appear in OC portal only after their first login

### Issue: Capital not updating
- **Solution**: 
  - Check internet connection (Firebase mode)
  - Refresh the page
  - Verify team is selected before clicking add/deduct

### Issue: Cannot deduct money
- **Solution**: 
  - Check if team has sufficient capital
  - System prevents deductions that would result in negative capital
  - Verify the amount entered

### Issue: Changes not reflected in team's view
- **Solution**: 
  - Team may need to refresh their trading page
  - Wait 2 seconds for auto-refresh
  - Check Firebase connection status

## Best Practices

### During the Event
1. **Test Before Round 2**: Test the system with a dummy team before the actual round
2. **Keep Portal Open**: Keep OC portal open throughout Round 2
3. **Double Check**: Always verify the correct team is selected before making changes
4. **Record Reasons**: Use the reason field to maintain audit trail
5. **Monitor Real-Time**: Watch the capital updates to ensure system is working

### Communication
- Coordinate with other OC members to avoid duplicate entries
- Have one designated OC member per section/group of teams
- Communicate with admin if any issues arise

### After Round 2
- Verify all team capitals are correctly updated
- Check admin leaderboard to confirm changes
- Document any issues for future improvements

## Quick Reference Card

### Common Actions
| Action | Steps |
|--------|-------|
| Add ₹300 | Select team → Click "Add Money" → Confirm |
| Deduct ₹300 | Select team → Click "Deduct Money" → Confirm |
| Find team | Type name in search bar |
| Clear selection | Click "Clear Selection" button |
| Logout | Click "Logout" button (top right) |

### Default Settings
- **Default Amount**: ₹300
- **Password**: `ocwolf2024`
- **Refresh Rate**: 2 seconds

## Contact & Support
If you encounter any issues during the event, contact the technical team or admin immediately.

## Additional Features

### Team Status Indicators
- **Green Checkmark (✓)**: Team is present
- **Highlighted Row**: Currently selected team
- **Bold Capital**: Current available cash

### Navigation
- Access admin panel from bottom links
- Return to team login page anytime
- Logout returns to OC login page

---

**Remember**: The OC Portal is a powerful tool. Always double-check before making changes to team capital!


