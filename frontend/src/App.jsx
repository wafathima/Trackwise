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
import HelpSupport from './components/HelpSupport'; // ← Add this import



function App() {
  return (
    <Router>
      <Routes>
        {/* This MUST be Home so the landing page opens first */}
        <Route path="/" element={<Home />} />
        
        {/* Authentication Pages */}
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


      </Routes>
    </Router>
  );
}

export default App;