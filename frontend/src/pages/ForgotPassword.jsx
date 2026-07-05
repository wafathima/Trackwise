//forgotPassword.jsx
import { useState } from 'react';
import { forgotPasswordRequest } from '../api/authApi';
import Toast from '../components/Toast';
import { Mail, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPasswordRequest(email);
      console.log('Response:', response); // For debugging
      
      // If we get a resetUrl in development, show it
      if (response.resetUrl) {
        setResetLink(response.resetUrl);
      }
      
      setToast({ message: response.message || 'Reset email sent! Check your inbox.', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md bg-[#16161a] border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Reset Password</h2>
        <p className="text-zinc-400 text-xs text-center mb-6">Enter your email and we will send you a recovery link.</p>
        
        {resetLink && (
          <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
            <p className="text-teal-400 text-sm font-medium mb-1">🔗 Development Link:</p>
            <p className="text-white text-xs break-all">{resetLink}</p>
            <button 
              onClick={() => navigator.clipboard.writeText(resetLink)}
              className="mt-2 text-xs text-teal-400 hover:text-teal-300 transition"
            >
              📋 Copy to clipboard
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full pl-11 pr-4 py-2.5 bg-[#1e1e24] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-teal-500" 
              placeholder="your-email@example.com" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-xl transition flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;