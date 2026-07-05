// components/GoogleLogin.jsx
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { googleAuthRequest } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({ isRegister = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('✅ Google login success, sending to backend...');
      
      // Check if credential exists
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      // Send credential to backend
      const userData = await googleAuthRequest(credentialResponse.credential);
      console.log('✅ Backend response:', userData);
      
      // Login user
      login(userData);
      navigate('/');
    } catch (error) {
      console.error('❌ Google login failed:', error);
      alert(`Google login failed: ${error.message}`);
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google login error:', error);
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="filled_black"
        shape="pill"
        width="250"
        text={isRegister ? "signup_with" : "signin_with"}
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleLoginButton;