import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VideoGallery from '../components/VideoGallery';

const TradingPage = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [initialCapital, setInitialCapital] = useState(null);
  const [currentCapital, setCurrentCapital] = useState(null); // Remaining money
  
  // Stock 1
  const [stock1Price, setStock1Price] = useState('');
  const [stock1Quantity, setStock1Quantity] = useState('');
  const [stock1Shares, setStock1Shares] = useState(0);
  
  // Stock 2
  const [stock2Price, setStock2Price] = useState('');
  const [stock2Quantity, setStock2Quantity] = useState('');
  const [stock2Shares, setStock2Shares] = useState(0);
  
  const [transactions, setTransactions] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);

  // Check authentication and load team data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('teamAuthenticated');
    const savedTeamName = localStorage.getItem('teamName');
    const savedTeamId = localStorage.getItem('teamId');
    
    if (!isAuthenticated || !savedTeamName || !savedTeamId) {
      navigate('/');
      return;
    }

    const firebaseAvailable = !!db;
    setUseFirebase(firebaseAvailable);
    setTeamName(savedTeamName);
    
    // Load team data with Firebase availability check
    loadTeamDataDirectly(savedTeamId, firebaseAvailable);
  }, [navigate]);

  const loadTeamDataDirectly = async (teamId, firebaseAvailable) => {
    if (!firebaseAvailable) {
      // Use localStorage fallback
      const savedData = localStorage.getItem(`teamData_${teamId}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setInitialCapital(data.initialCapital || 10000);
        setCurrentCapital(data.currentCapital || 10000);
        setStock1Shares(data.stock1Shares || 0);
        setStock2Shares(data.stock2Shares || 0);
        
        const savedTransactions = localStorage.getItem(`transactions_${teamId}`);
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } else {
        // No data found - set defaults
        setInitialCapital(10000);
        setCurrentCapital(10000);
        setStock1Shares(0);
        setStock2Shares(0);
        
        // Save to localStorage
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify({
          teamName: localStorage.getItem('teamName'),
          initialCapital: 10000,
          currentCapital: 10000,
          stock1Shares: 0,
          stock2Shares: 0,
          portfolioValue: 10000,
          totalTransactions: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }));
      }
      return;
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamSnap = await getDoc(teamRef);
      
      if (teamSnap.exists()) {
        const data = teamSnap.data();
        setInitialCapital(data.initialCapital || 10000);
        setCurrentCapital(data.currentCapital || 10000);
        setStock1Shares(data.stock1Shares || 0);
        setStock2Shares(data.stock2Shares || 0);
        
        // Load transactions
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('teamId', '==', teamId));
        const querySnapshot = await getDocs(q);
        const loadedTransactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(loadedTransactions);
      } else {
        // Team data doesn't exist in Firebase yet - set defaults
        setInitialCapital(10000);
        setCurrentCapital(10000);
        setStock1Shares(0);
        setStock2Shares(0);
        
        // Create team data in Firebase
        await setDoc(teamRef, {
          teamName: localStorage.getItem('teamName'),
          initialCapital: 10000,
          currentCapital: 10000,
          stock1Shares: 0,
          stock2Shares: 0,
          portfolioValue: 10000,
          totalTransactions: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      // Fallback to localStorage or defaults
      const savedData = localStorage.getItem(`teamData_${teamId}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setInitialCapital(data.initialCapital || 10000);
        setCurrentCapital(data.currentCapital || 10000);
        setStock1Shares(data.stock1Shares || 0);
        setStock2Shares(data.stock2Shares || 0);
      } else {
        // Set defaults if nothing found
        setInitialCapital(10000);
        setCurrentCapital(10000);
        setStock1Shares(0);
        setStock2Shares(0);
      }
    }
  };

  // BUY STOCK 1
  const handleBuyStock1 = async () => {
    const sharesToBuy = parseInt(stock1Quantity);
    const currentPrice = parseFloat(stock1Price);

    // Validation
    if (!sharesToBuy || sharesToBuy <= 0) {
      alert('⚠️ Please enter a valid number of shares to buy');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('⚠️ Please enter a valid stock price');
      return;
    }

    const totalBuyCost = sharesToBuy * currentPrice;

    if (currentCapital < totalBuyCost) {
      alert('❌ Capital Finished. You cannot buy. Try selling shares first.');
      return;
    }

    try {
      const teamId = localStorage.getItem('teamId');
      
      // Apply BUY logic
      const newCapital = currentCapital - totalBuyCost;
      const newStock1Shares = stock1Shares + sharesToBuy;
      const newPortfolioValue = newCapital + (newStock1Shares * (parseFloat(stock1Price) || 0)) + (stock2Shares * (parseFloat(stock2Price) || 0));

      const teamData = {
        currentCapital: newCapital,
        stock1Shares: newStock1Shares,
        stock2Shares: stock2Shares,
        portfolioValue: newPortfolioValue,
        lastUpdated: new Date().toISOString()
      };

      if (useFirebase) {
        // Update Firestore
        await setDoc(doc(db, 'teams', teamId), teamData, { merge: true });

        // Add transaction
        await addDoc(collection(db, 'transactions'), {
          teamId,
          teamName,
          stockName: 'Stock 1',
          type: 'buy',
          stockPrice: currentPrice,
          shares: sharesToBuy,
          totalCost: totalBuyCost,
          capitalAfter: newCapital,
          stock1SharesAfter: newStock1Shares,
          stock2SharesAfter: stock2Shares,
          portfolioValueAfter: newPortfolioValue,
          timestamp: new Date().toISOString()
        });
      } else {
        // Update localStorage
        const existingData = JSON.parse(localStorage.getItem(`teamData_${teamId}`) || '{}');
        const updatedData = { ...existingData, ...teamData };
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify(updatedData));

        // Add transaction to localStorage
        const newTransaction = {
          id: Date.now(),
          teamId,
          teamName,
          stockName: 'Stock 1',
          type: 'buy',
          stockPrice: currentPrice,
          shares: sharesToBuy,
          totalCost: totalBuyCost,
          capitalAfter: newCapital,
          stock1SharesAfter: newStock1Shares,
          stock2SharesAfter: stock2Shares,
          portfolioValueAfter: newPortfolioValue,
          timestamp: new Date().toISOString()
        };
        
        const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
        const updatedTransactions = [newTransaction, ...existingTransactions];
        localStorage.setItem(`transactions_${teamId}`, JSON.stringify(updatedTransactions));
      }

      // Update state
      setCurrentCapital(newCapital);
      setStock1Shares(newStock1Shares);
      setStock1Quantity('');
      
      const newTransactions = [{
        id: Date.now(),
        stockName: 'Stock 1',
        type: 'buy',
        stockPrice: currentPrice,
        shares: sharesToBuy,
        totalCost: totalBuyCost,
        timestamp: new Date()
      }, ...transactions];
      setTransactions(newTransactions);

      alert(`✅ STOCK 1 BUY Success!\n\nShares Bought: ${sharesToBuy}\nPrice: ₹${currentPrice}\nTotal Cost: ₹${totalBuyCost.toFixed(2)}\n\nCapital Remaining: ₹${newCapital.toFixed(2)}\nStock 1 Shares: ${newStock1Shares}\nPortfolio Value: ₹${newPortfolioValue.toFixed(2)}`);
    } catch (error) {
      console.error('Error buying Stock 1:', error);
      alert('❌ Failed to buy Stock 1. Please try again.');
    }
  };

  // SELL STOCK 1
  const handleSellStock1 = async () => {
    const sharesToSell = parseInt(stock1Quantity);
    const currentPrice = parseFloat(stock1Price);

    // Validation
    if (!sharesToSell || sharesToSell <= 0) {
      alert('⚠️ Please enter a valid number of shares to sell');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('⚠️ Please enter a valid stock price');
      return;
    }

    const totalSellValue = sharesToSell * currentPrice;

    if (stock1Shares < sharesToSell) {
      alert('❌ Not enough Stock 1 shares to sell. You only have ' + stock1Shares + ' shares.');
      return;
    }

    if (stock1Shares === 0) {
      alert('❌ No Stock 1 shares to sell. Try buying shares first.');
      return;
    }

    try {
      const teamId = localStorage.getItem('teamId');
      
      // Apply SELL logic
      const newCapital = currentCapital + totalSellValue;
      const newStock1Shares = stock1Shares - sharesToSell;
      const newPortfolioValue = newCapital + (newStock1Shares * (parseFloat(stock1Price) || 0)) + (stock2Shares * (parseFloat(stock2Price) || 0));

      const teamData = {
        currentCapital: newCapital,
        stock1Shares: newStock1Shares,
        stock2Shares: stock2Shares,
        portfolioValue: newPortfolioValue,
        lastUpdated: new Date().toISOString()
      };

      if (useFirebase) {
        // Update Firestore
        await setDoc(doc(db, 'teams', teamId), teamData, { merge: true });

        // Add transaction
        await addDoc(collection(db, 'transactions'), {
          teamId,
          teamName,
          stockName: 'Stock 1',
          type: 'sell',
          stockPrice: currentPrice,
          shares: sharesToSell,
          totalValue: totalSellValue,
          capitalAfter: newCapital,
          stock1SharesAfter: newStock1Shares,
          stock2SharesAfter: stock2Shares,
          portfolioValueAfter: newPortfolioValue,
          timestamp: new Date().toISOString()
        });
      } else {
        // Update localStorage
        const existingData = JSON.parse(localStorage.getItem(`teamData_${teamId}`) || '{}');
        const updatedData = { ...existingData, ...teamData };
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify(updatedData));

        // Add transaction to localStorage
        const newTransaction = {
          id: Date.now(),
          teamId,
          teamName,
          stockName: 'Stock 1',
          type: 'sell',
          stockPrice: currentPrice,
          shares: sharesToSell,
          totalValue: totalSellValue,
          capitalAfter: newCapital,
          stock1SharesAfter: newStock1Shares,
          stock2SharesAfter: stock2Shares,
          portfolioValueAfter: newPortfolioValue,
          timestamp: new Date().toISOString()
        };
        
        const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
        const updatedTransactions = [newTransaction, ...existingTransactions];
        localStorage.setItem(`transactions_${teamId}`, JSON.stringify(updatedTransactions));
      }

      // Update state
      setCurrentCapital(newCapital);
      setStock1Shares(newStock1Shares);
      setStock1Quantity('');
      
      const newTransactions = [{
        id: Date.now(),
        stockName: 'Stock 1',
        type: 'sell',
        stockPrice: currentPrice,
        shares: sharesToSell,
        totalValue: totalSellValue,
        timestamp: new Date()
      }, ...transactions];
      setTransactions(newTransactions);

      const profitLoss = newPortfolioValue - initialCapital;
      const profitLossText = profitLoss >= 0 ? `Profit: ₹${profitLoss.toFixed(2)} 📈` : `Loss: ₹${Math.abs(profitLoss).toFixed(2)} 📉`;

      alert(`✅ STOCK 1 SELL Success!\n\nShares Sold: ${sharesToSell}\nPrice: ₹${currentPrice}\nTotal Revenue: ₹${totalSellValue.toFixed(2)}\n\nCapital Now: ₹${newCapital.toFixed(2)}\nStock 1 Shares: ${newStock1Shares}\nPortfolio Value: ₹${newPortfolioValue.toFixed(2)}\n\n${profitLossText}`);
    } catch (error) {
      console.error('Error selling Stock 1:', error);
      alert('❌ Failed to sell Stock 1. Please try again.');
    }
  };

  // BUY STOCK 2
  const handleBuyStock2 = async () => {
    const sharesToBuy = parseInt(stock2Quantity);
    const currentPrice = parseFloat(stock2Price);

    // Validation
    if (!sharesToBuy || sharesToBuy <= 0) {
      alert('⚠️ Please enter a valid number of shares to buy');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('⚠️ Please enter a valid stock price');
      return;
    }

    const totalBuyCost = sharesToBuy * currentPrice;

    if (currentCapital < totalBuyCost) {
      alert('❌ Capital Finished. You cannot buy. Try selling shares first.');
      return;
    }

    try {
      const teamId = localStorage.getItem('teamId');
      const newCapital = currentCapital - totalBuyCost;
      const newStock2Shares = stock2Shares + sharesToBuy;
      const newPortfolioValue = newCapital + (stock1Shares * (parseFloat(stock1Price) || 0)) + (newStock2Shares * (parseFloat(stock2Price) || 0));

      const teamData = {
        currentCapital: newCapital,
        stock1Shares: stock1Shares,
        stock2Shares: newStock2Shares,
        portfolioValue: newPortfolioValue,
        lastUpdated: new Date().toISOString()
      };

      if (useFirebase) {
        await setDoc(doc(db, 'teams', teamId), teamData, { merge: true });
        await addDoc(collection(db, 'transactions'), {
          teamId, teamName, stockName: 'Stock 2', type: 'buy',
          stockPrice: currentPrice, shares: sharesToBuy, totalCost: totalBuyCost,
          capitalAfter: newCapital, stock1SharesAfter: stock1Shares, stock2SharesAfter: newStock2Shares,
          portfolioValueAfter: newPortfolioValue, timestamp: new Date().toISOString()
        });
      } else {
        const existingData = JSON.parse(localStorage.getItem(`teamData_${teamId}`) || '{}');
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify({ ...existingData, ...teamData }));
        const newTransaction = {
          id: Date.now(), teamId, teamName, stockName: 'Stock 2', type: 'buy',
          stockPrice: currentPrice, shares: sharesToBuy, totalCost: totalBuyCost,
          capitalAfter: newCapital, stock1SharesAfter: stock1Shares, stock2SharesAfter: newStock2Shares,
          portfolioValueAfter: newPortfolioValue, timestamp: new Date().toISOString()
        };
        const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
        localStorage.setItem(`transactions_${teamId}`, JSON.stringify([newTransaction, ...existingTransactions]));
      }

      setCurrentCapital(newCapital);
      setStock2Shares(newStock2Shares);
      setStock2Quantity('');
      setTransactions([{ id: Date.now(), stockName: 'Stock 2', type: 'buy', stockPrice: currentPrice,
        shares: sharesToBuy, totalCost: totalBuyCost, timestamp: new Date() }, ...transactions]);

      alert(`✅ STOCK 2 BUY Success!\n\nShares Bought: ${sharesToBuy}\nPrice: ₹${currentPrice}\nTotal Cost: ₹${totalBuyCost.toFixed(2)}\n\nCapital Remaining: ₹${newCapital.toFixed(2)}\nStock 2 Shares: ${newStock2Shares}\nPortfolio Value: ₹${newPortfolioValue.toFixed(2)}`);
    } catch (error) {
      console.error('Error buying Stock 2:', error);
      alert('❌ Failed to buy Stock 2. Please try again.');
    }
  };

  // SELL STOCK 2
  const handleSellStock2 = async () => {
    const sharesToSell = parseInt(stock2Quantity);
    const currentPrice = parseFloat(stock2Price);

    // Validation
    if (!sharesToSell || sharesToSell <= 0) {
      alert('⚠️ Please enter a valid number of shares to sell');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('⚠️ Please enter a valid stock price');
      return;
    }

    const totalSellValue = sharesToSell * currentPrice;

    if (stock2Shares < sharesToSell) {
      alert('❌ Not enough Stock 2 shares to sell. You only have ' + stock2Shares + ' shares.');
      return;
    }

    if (stock2Shares === 0) {
      alert('❌ No Stock 2 shares to sell. Try buying shares first.');
      return;
    }

    try {
      const teamId = localStorage.getItem('teamId');
      const newCapital = currentCapital + totalSellValue;
      const newStock2Shares = stock2Shares - sharesToSell;
      const newPortfolioValue = newCapital + (stock1Shares * (parseFloat(stock1Price) || 0)) + (newStock2Shares * (parseFloat(stock2Price) || 0));

      const teamData = {
        currentCapital: newCapital,
        stock1Shares: stock1Shares,
        stock2Shares: newStock2Shares,
        portfolioValue: newPortfolioValue,
        lastUpdated: new Date().toISOString()
      };

      if (useFirebase) {
        await setDoc(doc(db, 'teams', teamId), teamData, { merge: true });
        await addDoc(collection(db, 'transactions'), {
          teamId, teamName, stockName: 'Stock 2', type: 'sell',
          stockPrice: currentPrice, shares: sharesToSell, totalValue: totalSellValue,
          capitalAfter: newCapital, stock1SharesAfter: stock1Shares, stock2SharesAfter: newStock2Shares,
          portfolioValueAfter: newPortfolioValue, timestamp: new Date().toISOString()
        });
      } else {
        const existingData = JSON.parse(localStorage.getItem(`teamData_${teamId}`) || '{}');
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify({ ...existingData, ...teamData }));
        const newTransaction = {
          id: Date.now(), teamId, teamName, stockName: 'Stock 2', type: 'sell',
          stockPrice: currentPrice, shares: sharesToSell, totalValue: totalSellValue,
          capitalAfter: newCapital, stock1SharesAfter: stock1Shares, stock2SharesAfter: newStock2Shares,
          portfolioValueAfter: newPortfolioValue, timestamp: new Date().toISOString()
        };
        const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
        localStorage.setItem(`transactions_${teamId}`, JSON.stringify([newTransaction, ...existingTransactions]));
      }

      setCurrentCapital(newCapital);
      setStock2Shares(newStock2Shares);
      setStock2Quantity('');
      setTransactions([{ id: Date.now(), stockName: 'Stock 2', type: 'sell', stockPrice: currentPrice,
        shares: sharesToSell, totalValue: totalSellValue, timestamp: new Date() }, ...transactions]);

      const profitLoss = newPortfolioValue - initialCapital;
      const profitLossText = profitLoss >= 0 ? `Profit: ₹${profitLoss.toFixed(2)} 📈` : `Loss: ₹${Math.abs(profitLoss).toFixed(2)} 📉`;

      alert(`✅ STOCK 2 SELL Success!\n\nShares Sold: ${sharesToSell}\nPrice: ₹${currentPrice}\nTotal Revenue: ₹${totalSellValue.toFixed(2)}\n\nCapital Now: ₹${newCapital.toFixed(2)}\nStock 2 Shares: ${newStock2Shares}\nPortfolio Value: ₹${newPortfolioValue.toFixed(2)}\n\n${profitLossText}`);
    } catch (error) {
      console.error('Error selling Stock 2:', error);
      alert('❌ Failed to sell Stock 2. Please try again.');
    }
  };

  const calculatePortfolioValue = () => {
    // Portfolio Value = Current Capital + (Stock1 Shares * Stock1 Price) + (Stock2 Shares * Stock2 Price)
    const stock1PriceValue = parseFloat(stock1Price) || 0;
    const stock2PriceValue = parseFloat(stock2Price) || 0;
    return currentCapital + (stock1Shares * stock1PriceValue) + (stock2Shares * stock2PriceValue);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('teamAuthenticated');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              🐺 Wolf of D Street
            </h1>
            <p className="text-blue-300 text-sm sm:text-base lg:text-lg">Stock Market Trading Simulation</p>
          </div>
          <div className="text-right">
            {!useFirebase && (
              <p className="text-yellow-400 text-xs sm:text-sm mt-2">
                ⚠️ Running in demo mode (local storage)
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 mb-2">
              <p className="text-gray-300 text-xs sm:text-sm">Team:</p>
              <p className="text-white font-bold text-sm sm:text-lg">{teamName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Side: Video Player */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Portfolio Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">💼 Portfolio Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm">Initial Capital</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-400">₹{initialCapital?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm">Current Capital</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-400">₹{currentCapital?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm">Stock 1 Shares</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-400">{stock1Shares || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm">Stock 2 Shares</p>
                    <p className="text-lg sm:text-2xl font-bold text-pink-400">{stock2Shares || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm">Portfolio Value</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-400">₹{calculatePortfolioValue().toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Profit/Loss Indicator */}
                {initialCapital && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Profit/Loss:</span>
                      <span className={`text-lg font-bold ${
                        calculatePortfolioValue() >= initialCapital ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {calculatePortfolioValue() >= initialCapital ? '📈' : '📉'} ₹
                        {(calculatePortfolioValue() - initialCapital).toFixed(2)} 
                        ({(((calculatePortfolioValue() - initialCapital) / initialCapital) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Gallery Section */}
              <VideoGallery 
                onVideoSelect={(url) => setVideoUrl(url)}
                currentVideoUrl={videoUrl}
                onPlayPause={setIsPlaying}
                isPlaying={isPlaying}
              />

            </div>

            {/* Right Side: Trading Controls */}
            <div className="space-y-4 sm:space-y-6">
              {/* STOCK 1 Trading Panel */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl border-2 border-purple-500">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📊 Stock 1 Trading</h3>
                
                <div className="mb-3 sm:mb-4">
                  <label className="block text-white mb-2 font-medium text-sm sm:text-base">Stock 1 Price (from graph)</label>
                  <input
                    type="number"
                    value={stock1Price}
                    onChange={(e) => setStock1Price(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl sm:text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter price"
                  />
                  <p className="text-purple-300 text-xs mt-1">Pause video and enter price you see on graph</p>
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-white mb-2 font-medium text-sm sm:text-base">Quantity (shares)</label>
                  <input
                    type="number"
                    value={stock1Quantity}
                    onChange={(e) => setStock1Quantity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleBuyStock1}
                    className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-105 text-sm sm:text-base"
                  >
                    🟢 Buy Stock 1
                  </button>
                  <button
                    onClick={handleSellStock1}
                    className="flex-1 bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 text-sm sm:text-base"
                  >
                    🔴 Sell Stock 1
                  </button>
                </div>
              </div>

              {/* STOCK 2 Trading Panel */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl border-2 border-pink-500">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📈 Stock 2 Trading</h3>
                
                <div className="mb-3 sm:mb-4">
                  <label className="block text-white mb-2 font-medium text-sm sm:text-base">Stock 2 Price (from graph)</label>
                  <input
                    type="number"
                    value={stock2Price}
                    onChange={(e) => setStock2Price(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xl sm:text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Enter price"
                  />
                  <p className="text-pink-300 text-xs mt-1">Pause video and enter price you see on graph</p>
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="block text-white mb-2 font-medium text-sm sm:text-base">Quantity (shares)</label>
                  <input
                    type="number"
                    value={stock2Quantity}
                    onChange={(e) => setStock2Quantity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleBuyStock2}
                    className="flex-1 bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-105 text-sm sm:text-base"
                  >
                    🟢 Buy Stock 2
                  </button>
                  <button
                    onClick={handleSellStock2}
                    className="flex-1 bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 text-sm sm:text-base"
                  >
                    🔴 Sell Stock 2
                  </button>
                </div>
              </div>

              {/* Capital Warning */}
              {currentCapital <= 0 && stock1Shares === 0 && stock2Shares === 0 && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 sm:p-3 text-red-200 text-center text-xs sm:text-sm">
                  ⚠️ Capital Finished. You cannot buy. Sell your shares to recover capital.
                </div>
              )}
              
              {currentCapital <= 0 && (stock1Shares > 0 || stock2Shares > 0) && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-2 sm:p-3 text-yellow-200 text-center text-xs sm:text-sm">
                  💡 No capital left. Sell shares to recover money and continue trading.
                </div>
              )}

              {/* Portfolio Holdings */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📊 Holdings & Transactions</h3>
                
                {/* Stock 1 Holdings */}
                <div className="mb-4">
                  <h4 className="text-purple-400 font-bold mb-2">Stock 1</h4>
                  <div className="bg-white/5 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Shares Owned:</span>
                      <span className="text-white font-bold">{stock1Shares}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Current Price:</span>
                      <span className="text-purple-400 font-bold">₹{(parseFloat(stock1Price) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-gray-300 text-sm">Total Value:</span>
                      <span className="text-yellow-400 font-bold">₹{(stock1Shares * (parseFloat(stock1Price) || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Stock 2 Holdings */}
                <div className="mb-4">
                  <h4 className="text-pink-400 font-bold mb-2">Stock 2</h4>
                  <div className="bg-white/5 rounded-lg p-3 border-l-4 border-pink-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Shares Owned:</span>
                      <span className="text-white font-bold">{stock2Shares}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Current Price:</span>
                      <span className="text-pink-400 font-bold">₹{(parseFloat(stock2Price) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-1">
                      <span className="text-gray-300 text-sm">Total Value:</span>
                      <span className="text-yellow-400 font-bold">₹{(stock2Shares * (parseFloat(stock2Price) || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {stock1Shares === 0 && stock2Shares === 0 && (
                  <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-blue-200 text-center text-sm mb-4">
                    💡 You don't own any shares yet. Start trading!
                  </div>
                )}
                
                {/* Transaction History */}
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Recent Transactions</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {transactions.length === 0 ? (
                      <p className="text-gray-400 text-center py-2 text-xs sm:text-sm">No transactions yet</p>
                    ) : (
                      transactions.slice(0, 10).map((transaction, index) => (
                        <div key={index} className={`bg-white/5 rounded-lg p-2 border-l-4 ${
                          transaction.stockName === 'Stock 1' ? 'border-purple-500' : 'border-pink-500'
                        }`}>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className={transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                              {transaction.type === 'buy' ? '🟢 BUY' : '🔴 SELL'} - {transaction.stockName}
                            </span>
                            <span className="text-white">{transaction.shares || transaction.quantity} shares</span>
                          </div>
                          <div className="text-gray-400 text-xs">
                            @ ₹{transaction.stockPrice} = ₹{(transaction.totalCost || transaction.totalValue || 0).toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Footer Links */}
        <div className="text-center mt-6 sm:mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
          >
            ← Back to Login
          </a>
          <span className="text-gray-500">|</span>
          <a
            href="/admin"
            className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm"
          >
            Admin Panel →
          </a>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;