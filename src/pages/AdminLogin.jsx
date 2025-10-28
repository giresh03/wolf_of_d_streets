import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // In production, use Firebase Auth for secure authentication
  // For demo purposes, using a simple password check
  const ADMIN_PASSWORD = 'wolf2024'; // Change this to your secure password

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Incorrect password. Only event leads can access this panel.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">🔐 Admin Panel</h1>
          <p className="text-purple-200 text-sm sm:text-base">Wolf of D Street Event Control</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium text-sm sm:text-base">Enter Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Login to Admin Dashboard
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <a
            href="/"
            className="text-purple-300 hover:text-purple-200 text-xs sm:text-sm"
          >
            ← Back to Trading Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
