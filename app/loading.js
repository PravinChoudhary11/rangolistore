// app/loading.js
'use client';

import { useEffect, useState } from 'react';

export default function GlobalLoading() {
  const [loadingText, setLoadingText] = useState('Loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 500);

    // Simulate progress (optional - remove if you don't want fake progress)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Stop at 90% to avoid reaching 100% before actual completion
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 transition-all duration-300">
      {/* Click blocker to prevent interaction with underlying elements */}
      <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
      
      {/* Main loading container */}
      <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-pulse-gentle relative z-10">
        
        {/* Enhanced spinner with multiple rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin-slow"></div>
          {/* Middle ring */}
          <div className="absolute w-12 h-12 border-4 border-blue-300 rounded-full animate-spin border-t-transparent"></div>
          {/* Inner ring */}
          <div className="absolute w-8 h-8 border-4 border-blue-600 rounded-full animate-spin-fast border-t-transparent"></div>
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text with dynamic animation */}
        <div className="flex items-center justify-center min-w-[120px]">
          <span className="text-lg font-medium text-gray-700 transition-all duration-200">
            {loadingText}
          </span>
        </div>
        
        {/* Dynamic progress bar */}
        <div className="w-48 space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 text-center">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        {/* Loading tips */}
        <p className="text-sm text-gray-500 text-center max-w-xs animate-fade-in-out">
          Please wait while we prepare everything for you...
        </p>
      </div>
      
      
      {/* CSS Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }
        
        .flex.flex-col {
          animation: slideIn 0.4s ease-out;
        }
        
        /* Ensure loading overlay blocks all interactions */
        .fixed.inset-0 {
          pointer-events: all;
        }
        
        /* Prevent text selection during loading */
        .cursor-wait * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </div>
  );
}