// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FeaturesPage from './components/FeaturesPage';
import StudiesModule from './components/StudiesModule';
import StudyResources from './components/StudyResources'; // Add this import

import HealthModule from './components/HealthModule';
import HabitsModule from './components/HabitsModule';
import ProfilePage from './components/ProfilePage';
import HelpSupport from './components/HelpSupport';
import StudentProfile from './components/StudentProfile';
import MentorProfile from './components/MentorProfile';
import ParentProfile from './components/ParentProfile';
import TeacherProfile from './components/TeacherProfile';


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
        <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/student" element={<StudentProfile />} />
          <Route path="/profile/parent" element={<ParentProfile />} />
          <Route path="/profile/teacher" element={<TeacherProfile />} />
          <Route path="/profile/mentor" element={<MentorProfile />} />
          <Route path="/features/studies/resources" element={<StudyResources />} />



        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    
  );
}

export default App;