//app/login/LoginPopup.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAppData } from '@/lib/providers/AppProviders';

export default function LoginPopup({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, refetchAuth } = useAppData();

  useEffect(() => {
    if (!isOpen) return;

    let script;
    try {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        try {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: handleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            const buttonElement = document.getElementById('google-signin-btn-popup');
            if (buttonElement) {
              window.google.accounts.id.renderButton(
                buttonElement,
                {
                  theme: 'outline',
                  size: 'large',
                  width: 300,
                  text: 'signin_with',
                  shape: 'rectangular',
                }
              );
            }
          }
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setMessage('Failed to load Google Sign-In. Please try again.');
      };
    } catch (error) {
      console.error('Error loading Google script:', error);
    }

    return () => {
      // Cleanup Google button
      const buttonElement = document.getElementById('google-signin-btn-popup');
      if (buttonElement) {
        buttonElement.innerHTML = '';
      }
      
      // Cleanup script
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isOpen]);

  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    setMessage('');

    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      // Use the context login function
      const result = await login(payload.email);

      if (result.success) {
        setMessage('Login successful! Redirecting...');
        
        // Close popup and trigger success callback
        setTimeout(() => {
          onClose();

          if (onLoginSuccess) {
            // onLoginSuccess(); // This will trigger refetch in parent components
          }

          // Small delay before reload to let context update
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 1000);
      } else {
        if (result.error === 'User not found. Please register first.') {
          setMessage('Account not found. Please register first.');
          setTimeout(() => {
            onClose();
            if (onSwitchToRegister) {
              onSwitchToRegister();
            }
          }, 2000);
        } else {
          setMessage(result.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegisterClick = () => {
    onClose();

    // Delay the switch to register popup slightly to let login popup close first
    setTimeout(() => {
      if (onSwitchToRegister) {
        onSwitchToRegister();
      }
    }, 100); // 100ms is enough
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-12 px-4 sm:px-6 lg:px-8"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-center text-sm text-gray-600">
            Use your Google account to access RangoliStore
          </p>

          <div className="flex justify-center">
            <div id="google-signin-btn-popup"></div>
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-white">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            </div>
          )}

          {message && (
            <div className={`text-center p-3 rounded-md ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : message.includes('not found') || message.includes('Please register')
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={handleRegisterClick}
                className="font-medium text-blue-600 hover:text-blue-500 underline"
              >
                Sign up
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}