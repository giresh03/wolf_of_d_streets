import { useState, useRef, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const VideoGallery = ({ onVideoSelect, currentVideoUrl, onPlayPause, isPlaying }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [useFirebase, setUseFirebase] = useState(false);
  const mainVideoRef = useRef(null);

  const roundVideoMapping = {
    1: { file: '2cf059d5-20c9-4c11-91dd-ec8598cf8161.mp4', title: 'Round 1: Market Analysis & Opening Strategies' },
    2: { file: '805fb6d7-0bd7-4375-a8a5-32bd7888c2c9.mp4', title: 'Round 2: Technical Indicators & Trends' },
    3: { file: '8062ce19-0677-4ad5-85fb-5daf33ef6317.mp4', title: 'Round 3: Final Trading Strategies' }
  };

  useEffect(() => {
    setUseFirebase(!!db);
    loadCurrentRound();
    
    // Poll for round changes every 3 seconds
    const interval = setInterval(loadCurrentRound, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentRound && roundVideoMapping[currentRound]) {
      const videoData = roundVideoMapping[currentRound];
      const videoUrl = `/Graph/${videoData.file}`;
      setCurrentVideo({
        url: videoUrl,
        title: videoData.title,
        round: currentRound
      });
      onVideoSelect(videoUrl);
    }
  }, [currentRound]);

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
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl">
      {/* Round Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-bold text-white">🎯 Current Round</h3>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Round {currentRound} / 3</span>
          </div>
        </div>
      </div>

      {/* Current Video Info */}
      {currentVideo && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{currentVideo.title}</p>
              <p className="text-gray-400 text-sm">Analyze the stock movements and make your trading decisions</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Player */}
      {currentVideoUrl && (
        <div className="mt-4">
          <h4 className="text-white font-medium mb-3">📹 Stock Market Analysis Video</h4>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-3 relative">
            <video
              ref={mainVideoRef}
              src={currentVideoUrl}
              className="w-full h-full"
              controls
              controlsList="nodownload nofullscreen noremoteplayback"
              preload="metadata"
              onPlay={() => onPlayPause(true)}
              onPause={() => onPlayPause(false)}
              onSeeking={(e) => {
                // Prevent seeking by canceling the seek operation
                e.preventDefault();
                if (mainVideoRef.current) {
                  mainVideoRef.current.currentTime = mainVideoRef.current.currentTime;
                }
              }}
              onSeeked={(e) => {
                // Additional prevention - reset if seeked
                if (mainVideoRef.current) {
                  const currentTime = mainVideoRef.current.currentTime;
                  if (Math.abs(e.target.currentTime - currentTime) > 0.5) {
                    mainVideoRef.current.currentTime = currentTime;
                  }
                }
              }}
              onTimeUpdate={() => {
                // Store the last valid time
                if (mainVideoRef.current) {
                  mainVideoRef.current.lastValidTime = mainVideoRef.current.currentTime;
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Round Overlay */}
            <div className="absolute top-4 right-4 bg-purple-600/90 px-3 py-1 rounded-lg">
              <span className="text-white text-sm font-bold">Round {currentRound}</span>
            </div>
          </div>

          {/* Custom Play/Pause Controls */}
          <div className="flex gap-3">
            <button
              onClick={handlePlayPause}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? '⏸️ Pause Video' : '▶️ Play Video'}
            </button>
          </div>

          {/* Trading Instructions */}
          <div className="mt-4 bg-blue-500/20 border border-blue-500 rounded-lg p-3">
            <h5 className="text-blue-200 font-medium mb-2">📊 Trading Instructions:</h5>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• <strong>Play/Pause Only:</strong> You can only play or pause the video</li>
              <li>• <strong>No Scrubbing:</strong> Timeline bar is hidden - you cannot skip forward/backward</li>
              <li>• Pause the video when you want to analyze the current price</li>
              <li>• Note the current stock price from the graph</li>
              <li>• Decide whether to Buy or Sell based on your analysis</li>
              <li>• Enter the number of shares and execute your trade</li>
              <li>• Resume the video to see how the market moves</li>
            </ul>
          </div>
        </div>
      )}

      {/* Waiting for Admin Message */}
      {!currentVideo && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 text-center">
          <p className="text-yellow-200 text-lg font-bold mb-2">⏳ Waiting for Admin</p>
          <p className="text-yellow-300 text-sm">The event organizer will start the first round shortly.</p>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;