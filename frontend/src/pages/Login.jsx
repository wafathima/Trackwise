// pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import Toast from '../components/Toast';
import GoogleLoginButton from '../components/GoogleLogin';
import { Loader2, Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';

const INK = '#1C2B39';
const PAPER = '#F6F1E4';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const REDINK = '#A63D40';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validationRules = {
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    password: { required: true, minLength: 6 }
  };

  const { values, errors, handleChange, validate } = useForm({ email: '', password: '' }, validationRules);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginRequest(values);
      login(data);
      setToast({ message: 'Welcome back! Login successful.', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 antialiased relative"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp .6s cubic-bezier(.2,.7,.2,1) both; }
        .ledger-input:focus { border-color: ${MOSS} !important; box-shadow: 0 0 0 1px ${MOSS}55; }
        @media (prefers-reduced-motion: reduce) { .fade-up { animation: none; } }
      `}</style>

      {/* ruled-paper background */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}12 32px)` }}
        />
        <div className="hidden lg:block absolute top-0 bottom-0 left-20 w-px" style={{ backgroundColor: `${REDINK}33` }} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="fade-up w-full max-w-md relative">
        {/* washi-tape accent */}
        <div
          className="absolute -top-3 left-10 w-20 h-6 rotate-[-6deg] z-20 shadow-sm"
          style={{ backgroundColor: `${BRASS}CC` }}
        />

        <div
          className="rounded-md p-8 border-2 shadow-xl"
          style={{ backgroundColor: CARD, borderColor: `${INK}22` }}
        >
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center border-4 mb-4"
              style={{ backgroundColor: PAPER, borderColor: BRASS }}
            >
              <GraduationCap className="w-6 h-6" style={{ color: INK }} />
            </div>
            <h2 className="text-3xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Trackwise</h2>
            <p className="mt-2 text-sm" style={{ color: `${INK}99` }}>Sign in to manage your health and studies</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: `${INK}99`, fontFamily: FONT_MONO }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: `${INK}66` }} />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="ledger-input w-full pl-11 pr-4 py-3 rounded-md border-2 outline-none transition"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}26`, color: INK }}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs mt-1 font-medium" style={{ color: REDINK }}>{errors.email}</p>}
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: `${INK}99`, fontFamily: FONT_MONO }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: `${INK}66` }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="ledger-input w-full pl-11 pr-12 py-3 rounded-md border-2 outline-none transition"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}26`, color: INK }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-200/50 transition-colors"
                  style={{ color: `${INK}66` }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 font-medium" style={{ color: REDINK }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold rounded-md shadow-md transition flex items-center justify-center gap-2 text-white active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: INK }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: `${INK}22` }}></div>
            <span className="text-xs uppercase tracking-wider" style={{ color: `${INK}66`, fontFamily: FONT_MONO }}>or continue with</span>
            <div className="flex-1 h-px" style={{ backgroundColor: `${INK}22` }}></div>
          </div>

          <div className="mt-4">
            <GoogleLoginButton />
          </div>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-sm transition-colors" style={{ color: `${INK}99` }}>
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-sm mt-4" style={{ color: `${INK}99` }}>
            New here?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: MOSS }}>
              Create an account
            </Link>
          </p>
        </div>

        {/* wax-seal stamp */}
        <div
          className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 rotate-[10deg] shadow-lg"
          style={{ backgroundColor: CARD, borderColor: MOSS }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight" style={{ fontFamily: FONT_MONO, color: INK }}>
            Welcome<br />Back
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;