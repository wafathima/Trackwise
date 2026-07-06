// frontend/src/pages/AdminLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const INK = '#1C2B39';
const PAPER = '#F1EBDA';
const CARD = '#FBF8EF';
const BRASS = '#B8892B';
const REDINK = '#A63D40';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@trackwise.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      console.log('✅ Already logged in, redirecting to dashboard');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebug('');
    setLoading(true);

    console.log('🔐 Admin login attempt');
    console.log('📧 Email:', email);

    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response:', response.data);

      if (response.data.token) {
        // Save to localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        
        setDebug('✅ Login successful! Redirecting...');
        console.log('✅ Login successful!');
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        setError('Invalid response from server');
        setDebug('❌ No token in response');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setDebug('❌ Error: ' + (error.response?.status || 'Network error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
      <div className="relative w-full max-w-md p-8 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: BRASS }} />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY, color: INK }}>Admin Login</h1>
          <p className="text-sm mt-1" style={{ color: `${INK}70` }}>Access the admin dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-sm mb-4 flex items-center gap-2" style={{ backgroundColor: `${REDINK}10`, border: `1px solid ${REDINK}33` }}>
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: REDINK }} />
            <span className="text-sm" style={{ color: REDINK }}>{error}</span>
          </div>
        )}

        {debug && (
          <div className="p-2 rounded-sm mb-4 text-xs" style={{ backgroundColor: `${BRASS}10`, border: `1px solid ${BRASS}33`, color: BRASS }}>
            Debug: {debug}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: `${INK}50` }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                placeholder="admin@trackwise.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: `${INK}50` }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: `${INK}50` }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-sm text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: BRASS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs transition-colors hover:opacity-70"
            style={{ fontFamily: FONT_MONO, color: `${INK}60` }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;