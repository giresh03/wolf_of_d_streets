import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { validateTeamCredentials } from '../data/teams';

const TeamLogin = () => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!teamName || !password) {
      alert('⚠️ Please enter both team name and password');
      return;
    }

    // Validate against pre-defined teams list
    const validation = validateTeamCredentials(teamName, password);
    
    if (!validation.valid) {
      alert(`❌ ${validation.message}\n\nPlease check your credentials from the paper provided by organizers.`);
      return;
    }

    try {
      // Generate team ID
      const teamId = teamName.toLowerCase().replace(/\s+/g, '_');
      
      // Check if using Firebase
      if (db) {
        // Try to get existing team data from Firebase
        const teamRef = doc(db, 'teams', teamId);
        const teamSnap = await getDoc(teamRef);
        
        if (!teamSnap.exists()) {
          // Initialize team data in Firebase
          await setDoc(teamRef, {
            teamName,
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
      } else {
        // Initialize in localStorage if not exists
        const teamDataKey = `teamData_${teamId}`;
        if (!localStorage.getItem(teamDataKey)) {
          localStorage.setItem(teamDataKey, JSON.stringify({
            teamName,
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
      }

      // Set authentication and redirect
      localStorage.setItem('teamName', teamName);
      localStorage.setItem('teamId', teamId);
      localStorage.setItem('teamAuthenticated', 'true');
      
      alert(`✅ Welcome ${teamName}! Login successful.`);
      navigate('/trading');
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">🐺 Wolf of D Street</h1>
          <p className="text-blue-200 text-sm sm:text-base">Stock Market Trading Simulation</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter your team name"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            🚀 Login to Trade
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <a
            href="/admin"
            className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm"
          >
            Admin Panel →
          </a>
        </div>

        {/* Instructions */}
        <div className="mt-6 sm:mt-8 bg-blue-500/20 border border-blue-500 rounded-lg p-3 sm:p-4">
          <h3 className="text-blue-200 font-medium mb-2 text-sm sm:text-base">📋 Instructions:</h3>
          <ul className="text-blue-200 text-xs sm:text-sm space-y-1">
            <li>• Use the credentials provided by event organizers</li>
            <li>• Each team has a unique team name and password</li>
            <li>• You'll get ₹10,000 initial capital to start</li>
            <li>• Trade 2 stocks across 12 rounds</li>
            <li>• Highest portfolio value wins!</li>
          </ul>
        </div>

        {/* Lost Credentials */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            Lost your credentials? Contact event organizers
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;