import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-teal-900/90 border-teal-500 text-teal-200', icon: <CheckCircle className="w-5 h-5 text-teal-400" /> },
    error: { bg: 'bg-red-950/90 border-red-500 text-red-200', icon: <XCircle className="w-5 h-5 text-red-400" /> },
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${config[type].bg}`}>
      {config[type].icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;