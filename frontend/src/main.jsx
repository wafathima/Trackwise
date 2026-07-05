// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';
// import { AuthProvider } from './context/AuthContext.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>,
// );

// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// JUST FOR TEMPORARILY 
const CLIENT_ID = '243098640640-3pcdaa04entd5q4ls5jjhbkt1ua8vq99.apps.googleusercontent.com';
const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'; 

console.log('🔑 Using Client ID:', CLIENT_ID);
console.log('🔑 Using API URL:', API_BASE_URL);

import.meta.env.VITE_GOOGLE_CLIENT_ID = CLIENT_ID;
import.meta.env.VITE_API_BASE_URL = API_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);