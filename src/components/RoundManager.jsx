import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RoundManager = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [roundPassword, setRoundPassword] = useState('');
  const [useFirebase, setUseFirebase] = useState(false);
  const [roundPasswords] = useState({
    2: 'round2wolf',
    3: 'round3wolf',
    4: 'round4wolf',
    5: 'round5wolf',
    6: 'round6wolf',
    7: 'round7wolf',
    8: 'round8wolf',
    9: 'round9wolf',
    10: 'round10wolf',
    11: 'round11wolf',
    12: 'round12wolf'
  });

  // Map videos to rounds (8 videos for 12 rounds - some reused)
  const roundVideoMapping = {
    1: '2cf059d5-20c9-4c11-91dd-ec8598cf8161.mp4',
    2: '805fb6d7-0bd7-4375-a8a5-32bd7888c2c9.mp4',
    3: '8062ce19-0677-4ad5-85fb-5daf33ef6317.mp4',
    4: '97821ae6-bdc4-462d-9655-f374378a36b3.mp4',
    5: '98b3ae38-11e8-455c-80a1-d51415a664e6.mp4',
    6: 'ad559cb0-0fe5-4a59-b2d1-24bf2fcb98f8.mp4',
    7: 'c6f70bb2-57ff-4567-a730-465c698db8d9.mp4',
    8: 'c7df018f-8c8d-41da-b469-2ecd348e446e.mp4',
    9: '2cf059d5-20c9-4c11-91dd-ec8598cf8161.mp4', // Reuse
    10: '805fb6d7-0bd7-4375-a8a5-32bd7888c2c9.mp4', // Reuse
    11: '8062ce19-0677-4ad5-85fb-5daf33ef6317.mp4', // Reuse
    12: '97821ae6-bdc4-462d-9655-f374378a36b3.mp4' // Reuse
  };

  useEffect(() => {
    setUseFirebase(!!db);
    loadCurrentRound();
  }, []);

  const loadCurrentRound = async () => {
    if (!useFirebase) {
      const savedRound = localStorage.getItem('currentRound');
      if (savedRound) {
        setCurrentRound(parseInt(savedRound));
      }
      return;
    }

    try {
      const roundRef = doc(db, 'settings', 'currentRound');
      const roundSnap = await getDoc(roundRef);
      if (roundSnap.exists()) {
        setCurrentRound(roundSnap.data().round || 1);
      }
    } catch (error) {
      console.error('Error loading round:', error);
      const savedRound = localStorage.getItem('currentRound');
      if (savedRound) {
        setCurrentRound(parseInt(savedRound));
      }
    }
  };

  const handleActivateRound = async (roundNumber) => {
    // If going to next round (> current), require password
    if (roundNumber > currentRound) {
      if (!roundPassword) {
        alert('⚠️ Please enter the password to unlock this round');
        return;
      }

      if (roundPassword !== roundPasswords[roundNumber]) {
        alert('❌ Incorrect password. Please try again.');
        setRoundPassword('');
        return;
      }
    }

    try {
      const roundData = {
        round: roundNumber,
        video: roundVideoMapping[roundNumber],
        activatedAt: new Date().toISOString()
      };

      if (useFirebase) {
        await setDoc(doc(db, 'settings', 'currentRound'), roundData);
      } else {
        localStorage.setItem('currentRound', roundNumber.toString());
        localStorage.setItem('currentRoundData', JSON.stringify(roundData));
      }

      setCurrentRound(roundNumber);
      setRoundPassword('');
      alert(`✅ Round ${roundNumber} activated successfully!\n\nAll teams will now see Round ${roundNumber} video.`);
    } catch (error) {
      console.error('Error activating round:', error);
      alert('❌ Failed to activate round. Please try again.');
    }
  };

  const handleResetRounds = async () => {
    if (window.confirm('⚠️ Are you sure you want to reset to Round 1? All teams will return to the beginning.')) {
      try {
        const roundData = {
          round: 1,
          video: roundVideoMapping[1],
          activatedAt: new Date().toISOString()
        };

        if (useFirebase) {
          await setDoc(doc(db, 'settings', 'currentRound'), roundData);
        } else {
          localStorage.setItem('currentRound', '1');
          localStorage.setItem('currentRoundData', JSON.stringify(roundData));
        }

        setCurrentRound(1);
        setRoundPassword('');
        alert('✅ Reset to Round 1 successfully!');
      } catch (error) {
        console.error('Error resetting rounds:', error);
        alert('❌ Failed to reset rounds. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">🎯 Round Management</h2>
        <button
          onClick={handleResetRounds}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Reset to Round 1
        </button>
      </div>

      {/* Current Round Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg">
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-1">Currently Active Round</p>
          <p className="text-4xl font-bold text-white">Round {currentRound}</p>
          <p className="text-purple-200 text-sm mt-2">All teams are seeing this round</p>
        </div>
      </div>

      {/* Round Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((round) => (
          <button
            key={round}
            onClick={() => handleActivateRound(round)}
            disabled={round > currentRound + 1}
            className={`p-4 rounded-lg font-bold transition-all ${
              round === currentRound
                ? 'bg-green-600 text-white ring-2 ring-green-400'
                : round < currentRound
                ? 'bg-gray-600 text-gray-300'
                : round === currentRound + 1
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="text-center">
              <div className="text-xs mb-1">
                {round === currentRound ? '✅ Active' : round < currentRound ? '✓ Done' : round === currentRound + 1 ? '🔒 Next' : '🔒 Locked'}
              </div>
              <div className="text-lg">Round {round}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Password Input for Next Round */}
      {currentRound < 12 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">🔐 Unlock Round {currentRound + 1}</h3>
          <div className="flex gap-3">
            <input
              type="password"
              value={roundPassword}
              onChange={(e) => setRoundPassword(e.target.value)}
              placeholder={`Enter password for Round ${currentRound + 1}`}
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleActivateRound(currentRound + 1)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Unlock & Activate
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            💡 Password format: round{currentRound + 1}wolf (e.g., round2wolf, round3wolf)
          </p>
        </div>
      )}

      {currentRound === 12 && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
          <p className="text-green-200 text-lg font-bold">🎉 Final Round Active!</p>
          <p className="text-green-300 text-sm mt-1">All 12 rounds completed</p>
        </div>
      )}

      {/* Round Information */}
      <div className="mt-6 bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">ℹ️ Round System Info</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Total Rounds: 12</li>
          <li>• Current Round: {currentRound}</li>
          <li>• Remaining Rounds: {12 - currentRound}</li>
          <li>• Only active round video is visible to teams</li>
          <li>• Use password to unlock next round</li>
          <li>• Can go back to previous rounds anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default RoundManager;


