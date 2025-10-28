# 📈 Stock Trading Logic Implementation - Wolf of D Street

## ✅ What's Been Implemented:

### 1. **Initial Capital Set to ₹10,000**
- Default starting capital: **₹10,000**
- Pre-filled in the capital input form
- Can be changed by teams before starting

### 2. **Core Trading Variables**

| Variable | Purpose |
|----------|---------|
| `initialCapital` | Starting capital (₹10,000) |
| `currentCapital` | Money remaining after transactions |
| `shares` | Total number of shares owned |
| `stockPrice` | Current stock price from video |
| `portfolioValue` | capital + (shares × currentPrice) |

### 3. **BUY Logic Implementation**

```javascript
When Team Buys:
1. totalBuyCost = sharesToBuy × currentPrice
2. currentCapital = currentCapital - totalBuyCost
3. shares = shares + sharesToBuy
4. portfolioValue = currentCapital + (shares × currentPrice)
```

**Validations:**
- ✅ Check if quantity is valid (> 0)
- ✅ Check if enough capital available
- ✅ Show error: "❌ Capital Finished. You cannot buy. Try selling shares first."

**Success Message:**
```
✅ BUY Success!

Shares Bought: 10
Price: ₹50
Total Cost: ₹500

Capital Remaining: ₹9,500
Total Shares: 10
Portfolio Value: ₹10,000
```

### 4. **SELL Logic Implementation**

```javascript
When Team Sells:
1. totalSellValue = sharesToSell × currentPrice
2. currentCapital = currentCapital + totalSellValue
3. shares = shares - sharesToSell
4. portfolioValue = currentCapital + (shares × currentPrice)
```

**Validations:**
- ✅ Check if quantity is valid (> 0)
- ✅ Check if enough shares to sell
- ✅ Show error: "❌ Not enough shares to sell. You only have X shares."
- ✅ Show error: "❌ No shares to sell. Try buying shares first."

**Success Message:**
```
✅ SELL Success!

Shares Sold: 5
Price: ₹60
Total Revenue: ₹300

Capital Now: ₹800
Remaining Shares: 5
Portfolio Value: ₹1,100

Profit: ₹100 📈
```

### 5. **Portfolio Value Calculation**

```javascript
portfolioValue = currentCapital + (shares × currentPrice)
```

**This updates in real-time** as stock price changes from video!

### 6. **Complete Example Walkthrough**

#### **Initial State:**
- Initial Capital: ₹10,000
- Current Capital: ₹10,000
- Shares: 0
- Portfolio Value: ₹10,000

#### **Step 1: BUY 100 shares at ₹50**
```
Total Buy Cost = 100 × ₹50 = ₹5,000
Current Capital = 10,000 - 5,000 = ₹5,000
Shares = 0 + 100 = 100
Portfolio Value = 5,000 + (100 × 50) = ₹10,000
```
✅ No profit yet, just converted cash to shares

#### **Step 2: Price changes to ₹60 (from video)**
```
Current Capital = ₹5,000 (unchanged)
Shares = 100 (unchanged)
Portfolio Value = 5,000 + (100 × 60) = ₹11,000
```
📈 Potential profit: ₹1,000 (10%)

#### **Step 3: SELL 50 shares at ₹60**
```
Total Sell Value = 50 × ₹60 = ₹3,000
Current Capital = 5,000 + 3,000 = ₹8,000
Shares = 100 - 50 = 50
Portfolio Value = 8,000 + (50 × 60) = ₹11,000
```
✅ Realized profit: ₹1,000 (10%)

#### **Step 4: Price drops to ₹40**
```
Current Capital = ₹8,000 (unchanged)
Shares = 50 (unchanged)
Portfolio Value = 8,000 + (50 × 40) = ₹10,000
```
📉 Back to initial value

### 7. **Capital Zero Scenarios**

#### **Scenario A: All capital used, no shares**
```
Current Capital: ₹0
Shares: 0
Portfolio Value: ₹0
```
❌ **Message:** "Capital Finished. You cannot buy. Sell your shares to recover capital."

#### **Scenario B: All capital used, have shares**
```
Current Capital: ₹0
Shares: 100
Portfolio Value: ₹0 + (100 × 50) = ₹5,000
```
💡 **Message:** "No capital left. Sell shares to recover money and continue trading."

**Team can still SELL** to recover capital!

### 8. **UI Display**

#### **Portfolio Summary (4 Cards):**
```
┌─────────────────────┐ ┌─────────────────────┐
│ Initial Capital     │ │ Current Capital     │
│ ₹10,000.00         │ │ ₹5,000.00          │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ Shares Owned        │ │ Portfolio Value     │
│ 100                 │ │ ₹11,000.00         │
└─────────────────────┘ └─────────────────────┘

Profit/Loss: 📈 ₹1,000.00 (10.00%)
```

#### **Holdings Panel:**
```
Total Shares: 100
Current Price: ₹60.00
Stock Value: ₹6,000.00
```

#### **Recent Transactions:**
```
🟢 BUY  100 shares @ ₹50
🔴 SELL  50 shares @ ₹60
```

### 9. **Trading Controls**

#### **Stock Price Updates:**
- 📈 Update Price (Demo) - Random price
- 📊 Price Up (+10%) - Increase by 10%
- 📉 Price Down (-10%) - Decrease by 10%

#### **Video Controls:**
- ▶️ Play / ⏸️ Pause - Control video playback
- 🔄 Restart - Reset video to beginning

### 10. **Database Structure**

#### **Team Data:**
```javascript
{
  teamName: "Team Alpha",
  initialCapital: 10000,
  currentCapital: 5000,
  shares: 100,
  portfolioValue: 11000,
  totalTransactions: 2,
  lastUpdated: "2024-01-01T12:00:00.000Z"
}
```

#### **Transaction Data:**
```javascript
{
  teamId: "team_123",
  teamName: "Team Alpha",
  type: "buy",
  stockPrice: 50,
  shares: 100,
  totalCost: 5000,
  capitalAfter: 5000,
  sharesAfter: 100,
  portfolioValueAfter: 10000,
  timestamp: "2024-01-01T12:00:00.000Z"
}
```

### 11. **Leaderboard Logic**

Teams sorted by **portfolioValue** (descending):
```
1. Team Alpha   - ₹11,000  (+10%)
2. Team Beta    - ₹10,500  (+5%)
3. Team Gamma   - ₹9,800   (-2%)
```

### 12. **How Video-Based Trading Works**

1. **Team pauses video** at specific frame
2. **Reads stock price** from graph (or uses simulated price)
3. **Decides to Buy or Sell** based on analysis
4. **Enters quantity** of shares
5. **Clicks Buy/Sell** button
6. **Logic applies** and updates database
7. **Portfolio updates** in real-time
8. **Continues watching** video for next opportunity

## 🎯 Key Features:

✅ **Proper validation** - Prevents invalid trades
✅ **Clear error messages** - Helps teams understand issues
✅ **Detailed success messages** - Shows full transaction details
✅ **Real-time portfolio value** - Updates as price changes
✅ **Profit/Loss tracking** - Shows performance vs initial capital
✅ **Transaction history** - Recent trades displayed
✅ **Capital protection** - Can still sell when capital is zero
✅ **Responsive design** - Works on all devices

## 📱 Mobile Support:

- Touch-friendly buttons
- Responsive layout
- Clear visual feedback
- Easy number input
- Smooth scrolling

## 🏆 Winner Determination:

**Team with highest `portfolioValue` wins!**

Formula: `portfolioValue = currentCapital + (shares × currentPrice)`

This rewards teams who:
- Buy at low prices
- Sell at high prices
- Time their trades well
- Manage risk effectively

---

**Your trading simulation is now ready with proper stock market logic! 📈💰**

Teams can practice real trading strategies and learn about timing, risk management, and portfolio optimization.


