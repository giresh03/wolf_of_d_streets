import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RoundManager = () => {
  const [currentRound, setCurrentRound] = useState(0); // 0 = not started, 1-3 = active rounds
  const [roundStatus, setRoundStatus] = useState('stopped'); // 'stopped', 'active'
  const [roundPassword, setRoundPassword] = useState('');
  const [useFirebase, setUseFirebase] = useState(false);
  
  const [roundPasswords] = useState({
    1: 'round1wolf',
    2: 'round2wolf',
    3: 'round3wolf'
  });

  const roundVideoMapping = {
    1: '2cf059d5-20c9-4c11-91dd-ec8598cf8161.mp4',
    2: 'round4.mp4',
    3: '8062ce19-0677-4ad5-85fb-5daf33ef6317.mp4'
  };

  const roundTitles = {
    1: 'Round 1: Market Analysis & Opening Strategies',
    2: 'Round 2: Technical Indicators & Trends',
    3: 'Round 3: Final Trading Strategies'
  };

  useEffect(() => {
    setUseFirebase(!!db);
    loadRoundStatus();
  }, []);

  const loadRoundStatus = async () => {
    if (!useFirebase) {
      const savedRound = parseInt(localStorage.getItem('currentRound') || '0');
      const savedStatus = localStorage.getItem('roundStatus') || 'stopped';
      setCurrentRound(savedRound);
      setRoundStatus(savedStatus);
      return;
    }

    try {
      const roundRef = doc(db, 'settings', 'currentRound');
      const roundSnap = await getDoc(roundRef);
      if (roundSnap.exists()) {
        setCurrentRound(roundSnap.data().round || 0);
        setRoundStatus(roundSnap.data().status || 'stopped');
      }
    } catch (error) {
      console.error('Error loading round:', error);
    }
  };

  const handleStartRound = async (roundNumber) => {
    // Require password for all rounds
    if (!roundPassword) {
      alert('⚠️ Please enter the password to start this round');
      return;
    }

    if (roundPassword !== roundPasswords[roundNumber]) {
      alert('❌ Incorrect password. Please try again.');
      setRoundPassword('');
      return;
    }

    try {
      const roundData = {
        round: roundNumber,
        status: 'active',
        video: roundVideoMapping[roundNumber],
        title: roundTitles[roundNumber],
        startedAt: new Date().toISOString()
      };

      // ALWAYS save to BOTH Firebase and localStorage for immediate sync
      try {
        if (db) {
          await setDoc(doc(db, 'settings', 'currentRound'), roundData);
          console.log('✅ Round saved to Firebase');
        }
      } catch (error) {
        console.error('Firebase save failed:', error);
      }
      
      // Always save to localStorage as backup
      localStorage.setItem('currentRound', roundNumber.toString());
      localStorage.setItem('roundStatus', 'active');
      localStorage.setItem('currentRoundData', JSON.stringify(roundData));

      setCurrentRound(roundNumber);
      setRoundStatus('active');
      setRoundPassword('');
      alert(`✅ Round ${roundNumber} started!\n\nAll teams can now watch the video and start trading.`);
    } catch (error) {
      console.error('Error starting round:', error);
      alert('❌ Failed to start round. Please try again.');
    }
  };

  const handleStopRound = async () => {
    if (window.confirm(`⚠️ Stop Round ${currentRound}?\n\nTeams will see "Round completed, wait for next round" message.`)) {
      try {
        const roundData = {
          round: currentRound,
          status: 'completed',
          video: roundVideoMapping[currentRound],
          completedAt: new Date().toISOString()
        };

        // ALWAYS save to BOTH Firebase and localStorage
        try {
          if (db) {
            await setDoc(doc(db, 'settings', 'currentRound'), roundData);
          }
        } catch (error) {
          console.error('Firebase save failed:', error);
        }
        
        localStorage.setItem('roundStatus', 'completed');
        localStorage.setItem('currentRoundData', JSON.stringify(roundData));

        setRoundStatus('completed');
        alert(`✅ Round ${currentRound} stopped!\n\nTeams will see completion message.`);
      } catch (error) {
        console.error('Error stopping round:', error);
        alert('❌ Failed to stop round.');
      }
    }
  };

  const handleResetEvent = async () => {
    if (window.confirm('⚠️ Reset entire event to beginning?\n\nThis will stop all rounds and reset to Round 0.')) {
      try {
        const roundData = {
          round: 0,
          status: 'stopped',
          video: null,
          resetAt: new Date().toISOString()
        };

        if (useFirebase) {
          await setDoc(doc(db, 'settings', 'currentRound'), roundData);
        } else {
          localStorage.setItem('currentRound', '0');
          localStorage.setItem('roundStatus', 'stopped');
        }

        setCurrentRound(0);
        setRoundStatus('stopped');
        alert('✅ Event reset successfully!');
      } catch (error) {
        console.error('Error resetting:', error);
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white">🎯 Round Control Center</h2>
        <button
          onClick={handleResetEvent}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Reset Event
        </button>
      </div>

      {/* Current Status Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg">
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-1">Current Status</p>
          {currentRound === 0 ? (
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">Event Not Started</p>
              <p className="text-purple-200 text-sm mt-2">Start Round 1 to begin the event</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">Round {currentRound}</p>
              <p className={`text-lg font-semibold mt-2 ${
                roundStatus === 'active' ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {roundStatus === 'active' ? '🟢 ACTIVE - Teams Trading' : '🟡 COMPLETED - Waiting'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Round Control Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((round) => (
          <div key={round} className={`p-4 rounded-lg border-2 ${
            currentRound === round && roundStatus === 'active'
              ? 'bg-green-600/20 border-green-500'
              : currentRound === round && roundStatus === 'completed'
              ? 'bg-yellow-600/20 border-yellow-500'
              : currentRound > round
              ? 'bg-gray-600/20 border-gray-500'
              : 'bg-blue-600/20 border-blue-500'
          }`}>
            <div className="text-center mb-3">
              <h3 className="text-white font-bold text-lg">Round {round}</h3>
              <p className="text-gray-300 text-xs mt-1">{roundTitles[round]}</p>
            </div>

            {currentRound === round && roundStatus === 'active' ? (
              <div className="space-y-2">
                <button
                  onClick={handleStopRound}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  🛑 Stop Round {round}
                </button>
                <button
                  onClick={() => handleStartRound(round)}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm"
                >
                  🔄 Restart Round {round}
                </button>
              </div>
            ) : currentRound < round || (currentRound === round && roundStatus === 'completed') ? (
              <div className="space-y-2">
                <input
                  type="password"
                  value={round === currentRound + 1 || (currentRound === round && roundStatus === 'completed') ? roundPassword : ''}
                  onChange={(e) => setRoundPassword(e.target.value)}
                  placeholder={`Password for Round ${round}`}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={currentRound > round || (currentRound < round - 1 && roundStatus !== 'completed')}
                />
                <button
                  onClick={() => handleStartRound(round)}
                  disabled={currentRound > round || (currentRound < round - 1 && roundStatus !== 'completed')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  ▶️ Start Round {round}
                </button>
                <p className="text-gray-400 text-xs text-center">Password: round{round}wolf</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-400 text-sm">✓ Completed</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-200 font-medium mb-2">📋 How to Control Rounds:</h3>
        <ol className="text-blue-200 text-sm space-y-1">
          <li>1. Enter password for Round 1 and click "Start Round 1"</li>
          <li>2. Teams will see Round 1 video and can trade</li>
          <li>3. When time is up, click "Stop Round 1"</li>
          <li>4. Teams see "Round completed" message</li>
          <li>5. Start Round 2 with password, repeat process</li>
          <li>6. Complete all 3 rounds, then check leaderboard!</li>
        </ol>
      </div>
    </div>
  );
};

export default RoundManager;