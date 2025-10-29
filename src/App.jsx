import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeamLogin from './pages/TeamLogin';
import TradingPage from './pages/TradingPage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import OCLogin from './pages/OCLogin';
import OCPortal from './pages/OCPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamLogin />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/oc" element={<OCLogin />} />
        <Route path="/oc/portal" element={<OCPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
