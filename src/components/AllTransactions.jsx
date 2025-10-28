import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const AllTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [useFirebase, setUseFirebase] = useState(false);
  const [filterTeam, setFilterTeam] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    setUseFirebase(!!db);
    loadAllData();
    
    // Refresh every 2 seconds for real-time updates
    const interval = setInterval(loadAllData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadAllTransactions(), loadAllTeams()]);
    setLastRefresh(new Date());
  };

  const loadAllTransactions = async () => {
    if (!useFirebase) {
      // Load from localStorage
      const transactions = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('transactions_')) {
          const teamTransactions = JSON.parse(localStorage.getItem(key) || '[]');
          transactions.push(...teamTransactions);
        }
      }
      setAllTransactions(transactions.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      ));
      return;
    }

    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAllTransactions(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadAllTeams = async () => {
    if (!useFirebase) {
      const teams = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('teamData_')) {
          const teamData = JSON.parse(localStorage.getItem(key) || '{}');
          teams.push(teamData);
        }
      }
      setAllTeams(teams);
      return;
    }

    try {
      const teamsRef = collection(db, 'teams');
      const querySnapshot = await getDocs(teamsRef);
      
      const teams = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAllTeams(teams);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const filteredTransactions = filterTeam === 'all' 
    ? allTransactions 
    : allTransactions.filter(t => t.teamName === filterTeam);

  const totalTransactions = allTransactions.length;
  const buyCount = allTransactions.filter(t => t.type === 'buy').length;
  const sellCount = allTransactions.filter(t => t.type === 'sell').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-500/20 rounded-lg p-3 text-center">
          <p className="text-blue-200 text-xs sm:text-sm">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{totalTransactions}</p>
        </div>
        <div className="bg-green-500/20 rounded-lg p-3 text-center">
          <p className="text-green-200 text-xs sm:text-sm">Buy Orders</p>
          <p className="text-2xl font-bold text-white">{buyCount}</p>
        </div>
        <div className="bg-red-500/20 rounded-lg p-3 text-center">
          <p className="text-red-200 text-xs sm:text-sm">Sell Orders</p>
          <p className="text-2xl font-bold text-white">{sellCount}</p>
        </div>
        <div className="bg-purple-500/20 rounded-lg p-3 text-center">
          <p className="text-purple-200 text-xs sm:text-sm">Active Teams</p>
          <p className="text-2xl font-bold text-white">{allTeams.length}</p>
        </div>
      </div>

      {/* All Teams Holdings */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">📊 All Teams Holdings</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs">Live: {lastRefresh.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-white/10 border-b border-white/20">
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">Team</th>
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">Capital</th>
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">S1</th>
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">S2</th>
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">Portfolio</th>
                <th className="px-2 sm:px-3 py-2 text-white font-semibold">P/L</th>
              </tr>
            </thead>
            <tbody>
              {allTeams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No teams have logged in yet
                  </td>
                </tr>
              ) : (
                allTeams
                  .sort((a, b) => {
                    const aValue = (a.currentCapital || 0) + (a.stock1Shares || 0) * 100 + (a.stock2Shares || 0) * 100;
                    const bValue = (b.currentCapital || 0) + (b.stock1Shares || 0) * 100 + (b.stock2Shares || 0) * 100;
                    return bValue - aValue;
                  })
                  .map((team, index) => {
                    const portfolioValue = (team.currentCapital || 0) + 
                      ((team.stock1Shares || 0) * (team.stock1Price || 0)) + 
                      ((team.stock2Shares || 0) * (team.stock2Price || 0));
                    const profitLoss = portfolioValue - (team.initialCapital || 10000);
                    
                    return (
                      <tr key={team.id || index} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-2 sm:px-3 py-2 text-white font-medium">{team.teamName}</td>
                        <td className="px-2 sm:px-3 py-2 text-blue-400">₹{(team.currentCapital || 0).toFixed(0)}</td>
                        <td className="px-2 sm:px-3 py-2 text-purple-400">{team.stock1Shares || 0}</td>
                        <td className="px-2 sm:px-3 py-2 text-pink-400">{team.stock2Shares || 0}</td>
                        <td className="px-2 sm:px-3 py-2 text-yellow-400 font-bold">₹{portfolioValue.toFixed(0)}</td>
                        <td className={`px-2 sm:px-3 py-2 font-semibold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(0)}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Transactions */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">📝 All Transactions</h2>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="all">All Teams</option>
            {allTeams.map(team => (
              <option key={team.id || team.teamName} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">No transactions yet</p>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id || index}
                className={`bg-white/5 rounded-lg p-3 border-l-4 ${
                  transaction.stockName === 'Stock 1' ? 'border-purple-500' : 'border-pink-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold text-sm ${
                        transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'buy' ? '🟢 BUY' : '🔴 SELL'}
                      </span>
                      <span className="text-white font-medium text-sm">{transaction.teamName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        transaction.stockName === 'Stock 1' ? 'bg-purple-500' : 'bg-pink-500'
                      }`}>
                        {transaction.stockName}
                      </span>
                    </div>
                    <div className="text-gray-300 text-xs">
                      {transaction.shares} shares @ ₹{transaction.stockPrice} = ₹{(transaction.totalCost || transaction.totalValue || 0).toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      After: Capital ₹{(transaction.capitalAfter || 0).toFixed(0)} | S1: {transaction.stock1SharesAfter || 0} | S2: {transaction.stock2SharesAfter || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
