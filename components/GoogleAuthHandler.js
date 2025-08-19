// components/GoogleAuthHandler.js - Handle Google OAuth responses properly
'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useCallback } from 'react';

export function useGoogleAuth() {
  const { login, register } = useAuth();

  const handleCredentialResponse = useCallback(async (response) => {
    console.log('Google credential response:', response);
    
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT token to get user info
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      console.log('Decoded Google payload:', payload);

      // Try to login first
      const loginResult = await login(credential, true);
      
      if (loginResult.success) {
        console.log('Google login successful');
        return loginResult;
      }

      // If login failed (user not found), try to register
      if (loginResult.error && loginResult.error.includes('not found')) {
        console.log('User not found, attempting registration');
        
        const registerResult = await register({
          name: payload.name || payload.given_name + ' ' + payload.family_name,
          email: payload.email,
          image: payload.picture
        });

        if (registerResult.success) {
          console.log('Google registration successful');
          return registerResult;
        } else {
          console.error('Google registration failed:', registerResult.error);
          throw new Error(registerResult.error);
        }
      } else {
        console.error('Google login failed:', loginResult.error);
        throw new Error(loginResult.error);
      }

    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  }, [login, register]);

  const handleGoogleError = useCallback((error) => {
    console.error('Google Sign-In Error:', error);
    // You can add user-friendly error handling here
  }, []);

  return {
    handleCredentialResponse,
    handleGoogleError
  };
}

// Example usage in a component
export function GoogleSignInButton() {
  const { handleCredentialResponse, handleGoogleError } = useGoogleAuth();

  // This would typically be set up with the Google Sign-In library
  const setupGoogleSignIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        error_callback: handleGoogleError
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );
    }
  }, [handleCredentialResponse, handleGoogleError]);

  return (
    <div>
      <div id="google-signin-button"></div>
      <script 
        src="https://accounts.google.com/gsi/client" 
        async 
        defer 
        onLoad={setupGoogleSignIn}
      ></script>
    </div>
  );
}