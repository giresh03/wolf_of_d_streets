import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import RoundManager from '../components/RoundManager';
import TeamCredentials from '../components/TeamCredentials';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamTransactions, setTeamTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('portfolioValue');
  const [useFirebase, setUseFirebase] = useState(false);
  const [activeTab, setActiveTab] = useState('rounds'); // rounds, credentials, leaderboard

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    setUseFirebase(!!db);
    loadTeams();
    // Refresh data every 2 seconds for real-time updates
    const interval = setInterval(loadTeams, 2000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadTeams = async () => {
    if (!useFirebase) {
      // Load from localStorage
      const allTeams = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('teamData_')) {
          const teamId = key.replace('teamData_', '');
          const teamData = JSON.parse(localStorage.getItem(key) || '{}');
          const transactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
          
          allTeams.push({
            id: teamId,
            ...teamData,
            portfolioValue: calculatePortfolioValue(teamData),
            transactionCount: transactions.length
          });
        }
      }
      
      // Sort teams
      const sorted = allTeams.sort((a, b) => {
        if (sortBy === 'portfolioValue') {
          return b.portfolioValue - a.portfolioValue;
        } else if (sortBy === 'teamName') {
          return a.teamName?.localeCompare(b.teamName || '');
        }
        return 0;
      });

      setTeams(sorted);
      return;
    }

    try {
      const teamsRef = collection(db, 'teams');
      const querySnapshot = await getDocs(teamsRef);
      
      const loadedTeams = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        portfolioValue: calculatePortfolioValue(doc.data())
      }));

      // Sort teams
      const sorted = loadedTeams.sort((a, b) => {
        if (sortBy === 'portfolioValue') {
          return b.portfolioValue - a.portfolioValue;
        } else if (sortBy === 'teamName') {
          return a.teamName.localeCompare(b.teamName);
        }
        return 0;
      });

      setTeams(sorted);
    } catch (error) {
      console.error('Error loading teams:', error);
      // Fallback to localStorage
      loadTeamsFromLocalStorage();
    }
  };

  const loadTeamsFromLocalStorage = () => {
    const allTeams = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('teamData_')) {
        const teamId = key.replace('teamData_', '');
        const teamData = JSON.parse(localStorage.getItem(key) || '{}');
        
        allTeams.push({
          id: teamId,
          ...teamData,
          portfolioValue: calculatePortfolioValue(teamData)
        });
      }
    }
    
    const sorted = allTeams.sort((a, b) => {
      if (sortBy === 'portfolioValue') {
        return b.portfolioValue - a.portfolioValue;
      } else if (sortBy === 'teamName') {
        return a.teamName?.localeCompare(b.teamName || '');
      }
      return 0;
    });

    setTeams(sorted);
  };

  const calculatePortfolioValue = (teamData) => {
    const stock1Value = (teamData.stock1Shares || 0) * (teamData.stock1Price || 0);
    const stock2Value = (teamData.stock2Shares || 0) * (teamData.stock2Price || 0);
    return (teamData.currentCapital || 0) + stock1Value + stock2Value;
  };

  const loadTeamTransactions = async (teamId) => {
    if (!useFirebase) {
      // Load from localStorage
      const transactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
      setTeamTransactions(transactions);
      return;
    }

    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filtered = allTransactions.filter(t => t.teamId === teamId);
      setTeamTransactions(filtered);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Fallback to localStorage
      const transactions = JSON.parse(localStorage.getItem(`transactions_${teamId}`) || '[]');
      setTeamTransactions(transactions);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    loadTeamTransactions(team.id);
  };

  const handleResetTeam = async () => {
    if (!selectedTeam) return;
    
    if (window.confirm(`Are you sure you want to reset ${selectedTeam.teamName}? This will clear their portfolio and transactions.`)) {
      try {
        if (useFirebase) {
          const teamRef = doc(db, 'teams', selectedTeam.id);
          await updateDoc(teamRef, {
            portfolio: [],
            transactions: [],
            lastUpdated: new Date().toISOString()
          });
        } else {
          // Reset in localStorage
          const teamData = JSON.parse(localStorage.getItem(`teamData_${selectedTeam.id}`) || '{}');
          const resetData = {
            ...teamData,
            portfolio: [],
            currentCapital: teamData.initialCapital || 0,
            balance: teamData.initialCapital || 0,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(`teamData_${selectedTeam.id}`, JSON.stringify(resetData));
          localStorage.removeItem(`transactions_${selectedTeam.id}`);
        }
        
        alert('Team reset successfully!');
        loadTeams();
      } catch (error) {
        console.error('Error resetting team:', error);
        alert('Failed to reset team');
      }
    }
  };

  const filteredTeams = teams.filter(team =>
    team.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">🔐 Admin Dashboard</h1>
            <p className="text-purple-200 text-sm sm:text-base">Monitor all teams in real-time</p>
            {!useFirebase && (
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">
                ⚠️ Running in demo mode (local storage)
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('rounds')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'rounds'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🎯 Rounds
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'credentials'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            👥 Team Credentials
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* Round Manager Tab */}
        {activeTab === 'rounds' && <RoundManager />}

        {/* Team Credentials Tab */}
        {activeTab === 'credentials' && <TeamCredentials />}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Leaderboard */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">🏆 Leaderboard</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-48 px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  >
                    <option value="portfolioValue">Portfolio Value</option>
                    <option value="teamName">Team Name</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {filteredTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm sm:text-base">No teams found</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Teams will appear here when they start trading</p>
                  </div>
                ) : (
                  filteredTeams.map((team, index) => (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team)}
                      className={`bg-white/5 rounded-lg p-3 sm:p-4 cursor-pointer transition-all hover:bg-white/10 ${
                        selectedTeam?.id === team.id ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm sm:text-base">{team.teamName || 'Unnamed Team'}</p>
                            <p className="text-gray-400 text-xs sm:text-sm">Initial: ${team.initialCapital?.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg sm:text-xl">${team.portfolioValue.toFixed(2)}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {team.portfolioValue > team.initialCapital ? '+' : ''}
                            {((team.portfolioValue - team.initialCapital) / team.initialCapital * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Team Details */}
          <div className="space-y-4 sm:space-y-6">
            {selectedTeam ? (
              <>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {selectedTeam.teamName}
                  </h3>

                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <p className="text-gray-300 text-xs sm:text-sm">Initial Capital</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-400">₹{selectedTeam.initialCapital?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <p className="text-gray-300 text-xs sm:text-sm">Current Capital</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-400">₹{selectedTeam.currentCapital?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <p className="text-gray-300 text-xs sm:text-sm">Stock 1 Shares</p>
                      <p className="text-lg sm:text-2xl font-bold text-purple-400">{selectedTeam.stock1Shares || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <p className="text-gray-300 text-xs sm:text-sm">Stock 2 Shares</p>
                      <p className="text-lg sm:text-2xl font-bold text-pink-400">{selectedTeam.stock2Shares || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                      <p className="text-gray-300 text-xs sm:text-sm">Portfolio Value</p>
                      <p className="text-lg sm:text-2xl font-bold text-yellow-400">₹{selectedTeam.portfolioValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetTeam}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
                  >
                    Reset Team
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Recent Transactions</h3>
                  <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                    {teamTransactions.length === 0 ? (
                      <p className="text-gray-400 text-center py-3 sm:py-4 text-sm sm:text-base">No transactions yet</p>
                    ) : (
                      teamTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className={`bg-white/5 rounded-lg p-2 sm:p-3 ${
                            transaction.type === 'buy' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className={`font-semibold text-xs sm:text-sm ${transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.type.toUpperCase()}
                            </span>
                            <span className="text-white text-xs sm:text-sm">
                              ${transaction.totalCost || transaction.totalRevenue || 0}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm mt-1">
                            {transaction.quantity} @ ${transaction.stockPrice} each
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
                <p className="text-gray-400 text-center text-sm sm:text-base">Select a team to view details</p>
              </div>
            )}
          </div>
        </div>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <a
            href="/"
            className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm"
          >
            ← Back to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;