// ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../api/authApi';
import Toast from '../components/Toast';
import { Lock, Loader2, KeyRound } from 'lucide-react';

const INK = '#1C2B39';
const PAPER = '#F6F1E4';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const REDINK = '#A63D40';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setToast({ message: 'Password must be 6+ chars', type: 'error' });
    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      setToast({ message: 'Password updated! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
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
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center border-4 mb-4"
              style={{ backgroundColor: PAPER, borderColor: REDINK }}
            >
              <KeyRound className="w-6 h-6" style={{ color: INK }} />
            </div>
            <h2 className="text-3xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Set New Password</h2>
            <p className="mt-1 text-sm" style={{ color: `${INK}99` }}>Choose a fresh password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: `${INK}99`, fontFamily: FONT_MONO }}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: `${INK}66` }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ledger-input w-full pl-11 pr-4 py-2.5 rounded-md border-2 outline-none transition"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}26`, color: INK }}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold rounded-md shadow-md transition flex justify-center items-center gap-2 text-white active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: INK }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </div>

        {/* wax-seal stamp */}
        <div
          className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 rotate-[10deg] shadow-lg"
          style={{ backgroundColor: CARD, borderColor: MOSS }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight" style={{ fontFamily: FONT_MONO, color: INK }}>
            Reset<br />Secured
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;