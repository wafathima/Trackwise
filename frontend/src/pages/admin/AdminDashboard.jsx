// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  LogOut, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    
    console.log('🔍 AdminDashboard mounted');
    console.log('📦 Token exists:', !!token);
    console.log('📦 Admin data exists:', !!adminData);
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      navigate('/admin/login');
      return;
    }

    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        console.log('👤 Admin data:', parsedAdmin);
        setAdmin(parsedAdmin);
      } catch (e) {
        console.error('Error parsing admin data:', e);
        navigate('/admin/login');
        return;
      }
    }

    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      console.log('📡 Fetching dashboard data...');
      const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📥 Dashboard data:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        console.log('🔑 Token expired, redirecting to login');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F1EBDA' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: '#B8892B30', borderTopColor: '#B8892B' }} />
          <p className="mt-4" style={{ color: '#1C2B3970' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1EBDA' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b-2" style={{ backgroundColor: '#FBF8EFF2', borderColor: '#1C2B3922' }}>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" style={{ color: '#B8892B' }} />
          <span className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>Admin Panel</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#B8892B', color: 'white' }}>
            {admin?.role || 'Admin'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: '#1C2B3980' }}>{admin?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-sm text-sm flex items-center gap-2 transition-colors"
            style={{ border: '1px solid #A63D40', color: '#A63D40', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#A63D40'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#A63D40'; }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
          Dashboard Overview
        </h1>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>{stats.totalUsers || 0}</p>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Total Users</p>
            </div>
            <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>{stats.activeUsers || 0}</p>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Active Users</p>
            </div>
            <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>{stats.totalAdmins || 0}</p>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Admins</p>
            </div>
            <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
              <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>{stats.totalStudySessions || 0}</p>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Study Sessions</p>
            </div>
          </div>
        )}

        <div className="p-8 rounded-sm border text-center" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
          <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#B8892B' }} />
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
            Welcome to Admin Panel
          </h2>
          <p className="text-sm" style={{ color: '#1C2B3980' }}>
            You are logged in as <span className="font-semibold" style={{ color: '#1C2B39' }}>{admin?.name}</span> ({admin?.role})
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;