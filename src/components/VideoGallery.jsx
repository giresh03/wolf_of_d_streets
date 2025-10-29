import { useState, useRef, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VideoGallery = ({ onVideoSelect, currentVideoUrl, onPlayPause, isPlaying }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [roundStatus, setRoundStatus] = useState('stopped');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [useFirebase, setUseFirebase] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const mainVideoRef = useRef(null);

  const roundVideoMapping = {
    1: { file: '2cf059d5-20c9-4c11-91dd-ec8598cf8161.mp4', title: 'Round 1: Market Analysis & Opening Strategies' },
    2: { file: '805fb6d7-0bd7-4375-a8a5-32bd7888c2c9.mp4', title: 'Round 2: Technical Indicators & Trends' },
    3: { file: '8062ce19-0677-4ad5-85fb-5daf33ef6317.mp4', title: 'Round 3: Final Trading Strategies' }
  };

  useEffect(() => {
    setUseFirebase(!!db);
    loadRoundStatus();
    
    // Poll for round changes every 1 second for immediate updates
    const interval = setInterval(loadRoundStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentRound > 0 && roundStatus === 'active' && roundVideoMapping[currentRound]) {
      const videoData = roundVideoMapping[currentRound];
      const videoUrl = `/${videoData.file}`;
      
      console.log('🎬 Loading video:', videoUrl, 'for round:', currentRound);
      
      setCurrentVideo({
        url: videoUrl,
        title: videoData.title,
        round: currentRound
      });
      onVideoSelect(videoUrl);
      
      // Force video reload and play
      setTimeout(() => {
        if (mainVideoRef.current) {
          console.log('📹 Setting video src to:', videoUrl);
          mainVideoRef.current.src = videoUrl;
          mainVideoRef.current.load();
          mainVideoRef.current.play().catch(err => {
            console.log('⏸️ Auto-play prevented:', err);
          });
        }
      }, 300);
    } else if (roundStatus === 'completed' || roundStatus === 'stopped') {
      // Keep video info but pause
      if (mainVideoRef.current) {
        mainVideoRef.current.pause();
      }
    }
  }, [currentRound, roundStatus, onVideoSelect]);

  const loadRoundStatus = async () => {
    // ALWAYS try Firebase first, then fallback to localStorage
    let roundLoaded = false;
    
    if (db) {
      try {
        const roundRef = doc(db, 'settings', 'currentRound');
        const roundSnap = await getDoc(roundRef);
        if (roundSnap.exists()) {
          const data = roundSnap.data();
          const newRound = data.round || 0;
          const newStatus = data.status || 'stopped';
          
          console.log('📊 Loaded from Firebase:', { round: newRound, status: newStatus });
          
          // Show completion popup when status changes to completed
          if (newStatus === 'completed' && roundStatus === 'active') {
            setShowCompletionPopup(true);
          }
          
          setCurrentRound(newRound);
          setRoundStatus(newStatus);
          roundLoaded = true;
        }
      } catch (error) {
        console.error('Firebase read failed, trying localStorage:', error);
      }
    }
    
    // Fallback to localStorage if Firebase fails
    if (!roundLoaded) {
      const savedRound = parseInt(localStorage.getItem('currentRound') || '0');
      const savedStatus = localStorage.getItem('roundStatus') || 'stopped';
      
      console.log('📊 Loaded from localStorage:', { round: savedRound, status: savedStatus });
      
      // Show completion popup when status changes to completed
      if (savedStatus === 'completed' && roundStatus === 'active') {
        setShowCompletionPopup(true);
      }
      
      setCurrentRound(savedRound);
      setRoundStatus(savedStatus);
    }
  };

  const handlePlayPause = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      onPlayPause(!isPlaying);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-6 shadow-xl">
      {/* Completion Popup */}
      {showCompletionPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Round {currentRound} Completed!
            </h2>
            <p className="text-white text-base sm:text-lg mb-6">
              {currentRound < 3 
                ? `Great job! Please wait while the admin prepares Round ${currentRound + 1}.` 
                : 'All rounds completed! Check the leaderboard for final rankings.'}
            </p>
            <button
              onClick={() => setShowCompletionPopup(false)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              OK, Got It!
            </button>
          
          </div>
          div
        </div>
      )}

      {/* Round Header */}
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <h3 className="text-base sm:text-xl font-bold text-white">🎯 Current Round</h3>
          {currentRound > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 sm:px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-sm sm:text-base">Round {currentRound} / 3</span>
            </div>
          )}
        </div>
      </div>

      {/* Round Status Messages */}
      {currentRound === 0 && roundStatus === 'stopped' && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 sm:p-6 text-center mb-4">
          <div className="text-4xl sm:text-5xl mb-3">⏳</div>
          <p className="text-yellow-200 text-lg sm:text-xl font-bold mb-2">Event Not Started</p>
          <p className="text-yellow-300 text-sm sm:text-base">
            Please wait for the admin to start Round 1. The event will begin shortly.
          </p>
        </div>
      )}

      {roundStatus === 'completed' && currentRound > 0 && (
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4 sm:p-6 text-center mb-4">
          <div className="text-4xl sm:text-5xl mb-3">✅</div>
          <p className="text-purple-200 text-lg sm:text-xl font-bold mb-2">
            Round {currentRound} Completed!
          </p>
          <p className="text-purple-300 text-sm sm:text-base">
            {currentRound < 3 
              ? `Waiting for admin to start Round ${currentRound + 1}...` 
              : 'All rounds completed! Check your final portfolio value.'}
          </p>
        </div>
      )}

      {/* Active Round - Video Player */}
      {currentRound > 0 && roundStatus === 'active' && currentVideo && (
        <div className="space-y-3 sm:space-y-4">
          {/* Video Info */}
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white font-medium text-sm sm:text-base">{currentVideo.title}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Analyze the stock movements and make your trading decisions</p>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={mainVideoRef}
              key={`video-${currentRound}-${currentVideo?.round}`}
              className="w-full h-full"
              controls
              controlsList="nodownload"
              preload="auto"
              playsInline
              crossOrigin="anonymous"
              onLoadedData={() => console.log('✅ Video loaded:', currentVideo?.url)}
              onError={(e) => {
                const error = mainVideoRef.current?.error;
                console.error('❌ Video error code:', error?.code, 'message:', error?.message);
                console.error('Trying to load:', currentVideo?.url);
              }}
              onPlay={() => onPlayPause(true)}
              onPause={() => onPlayPause(false)}
              onSeeking={(e) => {
                e.preventDefault();
                if (mainVideoRef.current) {
                  mainVideoRef.current.currentTime = mainVideoRef.current.currentTime;
                }
              }}
              onSeeked={(e) => {
                if (mainVideoRef.current) {
                  const currentTime = mainVideoRef.current.currentTime;
                  if (Math.abs(e.target.currentTime - currentTime) > 0.5) {
                    mainVideoRef.current.currentTime = currentTime;
                  }
                }
              }}
              onTimeUpdate={() => {
                if (mainVideoRef.current) {
                  mainVideoRef.current.lastValidTime = mainVideoRef.current.currentTime;
                }
              }}
            >
              <source src={currentVideo?.url || currentVideoUrl || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Round Overlay */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-purple-600/90 px-2 sm:px-3 py-1 rounded-lg">
              <span className="text-white text-xs sm:text-sm font-bold">Round {currentRound}</span>
            </div>
          </div>

          {/* Custom Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-colors text-sm sm:text-base ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlaying ? '⏸️ Pause Video' : '▶️ Play Video'}
          </button>

          {/* Trading Instructions */}
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
            <h5 className="text-blue-200 font-medium mb-2 text-xs sm:text-sm">📊 Trading Instructions:</h5>
            <ul className="text-blue-200 text-xs sm:text-sm space-y-1">
              <li>• <strong>Play/Pause Only:</strong> Timeline hidden - no skipping</li>
              <li>• Pause when you see good prices on the graph</li>
              <li>• Enter prices manually for Stock 1 and Stock 2</li>
              <li>• Enter quantity and click Buy or Sell</li>
              <li>• Build your portfolio for maximum value!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;