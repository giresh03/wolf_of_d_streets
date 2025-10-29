import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OCLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // OC Member password - different from admin
  const OC_PASSWORD = 'ocwolf2024'; // Change this to your secure password

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === OC_PASSWORD) {
      localStorage.setItem('ocAuthenticated', 'true');
      navigate('/oc/portal');
    } else {
      alert('Incorrect password. Only OC members can access this portal.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">🎯 OC Portal</h1>
          <p className="text-green-200 text-sm sm:text-base">Organizing Committee Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Enter OC Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Login to OC Portal
          </button>
        </form>

        <div className="mt-4 sm:mt-6 flex justify-between text-center">
          <a
            href="/"
            className="text-green-300 hover:text-green-200 text-xs sm:text-sm"
          >
            ← Team Login
          </a>
          <a
            href="/admin"
            className="text-green-300 hover:text-green-200 text-xs sm:text-sm"
          >
            Admin Panel →
          </a>
        </div>

        {/* Info Box */}
        <div className="mt-6 sm:mt-8 bg-green-500/20 border border-green-500 rounded-lg p-3 sm:p-4">
          <h3 className="text-green-200 font-medium mb-2 text-sm sm:text-base">📋 OC Portal Features:</h3>
          <ul className="text-green-200 text-xs sm:text-sm space-y-1">
            <li>• View all team credentials</li>
            <li>• Search and select teams</li>
            <li>• Add/Deduct money for Round 2 fake news</li>
            <li>• Real-time capital updates</li>
            <li>• Track team attendance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OCLogin;

