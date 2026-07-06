// frontend/src/context/AdminContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('🔍 AdminProvider: Token exists?', !!token);
    if (token) {
      fetchAdminProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminProfile = async (token) => {
    try {
      console.log('📡 Fetching admin profile...');
      const response = await api.get('/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Admin profile fetched:', response.data);
      setAdmin(response.data);
    } catch (error) {
      console.error('❌ Error fetching admin profile:', error);
      console.error('Response:', error.response?.data);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      console.log('📡 Sending login request to /admin/login');
      const response = await api.post('/admin/login', { email, password });
      console.log('📥 Login response:', response.data);
      
      const { token, admin } = response.data;
      
      if (!token || !admin) {
        console.error('❌ Invalid response: missing token or admin');
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      
      setAdmin(admin);
      console.log('✅ Admin login successful');
      return { success: true, admin };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const adminLogout = () => {
    console.log('🚪 Admin logging out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const updateAdmin = (updatedData) => {
    setAdmin(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('admin', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      adminLogin,
      adminLogout,
      updateAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};