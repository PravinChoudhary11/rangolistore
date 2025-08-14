// /components/RegisterPopup.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function RegisterPopup({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login, refetch, user } = useAuth();

  // Close popup if user is already logged in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    }
  }, [user, isOpen, onClose, onRegisterSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      try {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the sign-in button
        const buttonElement = document.getElementById('google-signup-btn-popup');
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            {
              theme: 'outline',
              size: 'large',
              width: 300,
              text: 'signup_with',
              shape: 'rectangular',
            }
          );
        }
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
      setMessage('Failed to load Google Sign-In. Please try again.');
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isOpen]);

  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Decode the JWT credential to get user info
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const registerData = {
        email: payload.email,
        name: payload.name,
        image: payload.picture
      };

      // Send to backend for registration
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Registration successful!');
        
        // Update the auth state immediately with the returned user data
        login(data.user);
        
        // Force a refetch to ensure the state is properly synchronized
        await refetch();
        
        // Wait a bit then close popup and call success callback
        setTimeout(() => {
          onClose();
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }, 1000);
        
      } else {
        if (data.error === 'User already exists. Please login instead.') {
          setMessage('Account already exists. Switching to login...');
          setTimeout(() => {
            onClose();
            if (onSwitchToLogin) {
              onSwitchToLogin();
            }
          }, 2000);
        } else {
          setMessage(data.error || 'Registration failed');
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
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

  const handleLoginClick = () => {
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-12 px-4 sm:px-6 lg:px-8"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
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

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-center text-sm text-gray-600">
            Join RangoliStore with your Google account
          </p>

          <div className="flex justify-center">
            <div id="google-signup-btn-popup"></div>
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-white">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            </div>
          )}

          {message && (
            <div className={`text-center p-3 rounded-md ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : message.includes('already exists') || message.includes('Switching to login')
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={handleLoginClick}
                className="font-medium text-blue-600 hover:text-blue-500 underline"
              >
                Sign in
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}