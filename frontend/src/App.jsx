// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FeaturesPage from './components/FeaturesPage';
import StudiesModule from './components/StudiesModule';
import HealthModule from './components/HealthModule';
import HabitsModule from './components/HabitsModule';
import ProfilePage from './components/ProfilePage';
import HelpSupport from './components/HelpSupport';


import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/features/studies" element={<StudiesModule />} />
        <Route path="/features/health" element={<HealthModule />} />
        <Route path="/features/habits" element={<HabitsModule />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help-support" element={<HelpSupport />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    
  );
}

export default App;