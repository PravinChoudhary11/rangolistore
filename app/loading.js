// app/loading.js - Updated Version with Hydration Fix
'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function GlobalLoading() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');
  const [isVisible, setIsVisible] = useState(false); // Start false to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const hasCompletedRef = useRef(false);
  const startTime = useRef(Date.now());

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true); // Show loading after mount
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 500);

    // Simulate realistic progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Stop at 95% to avoid reaching 100% before actual completion
        
        // More realistic progress increments
        let increment;
        if (prev < 30) increment = Math.random() * 20 + 5; // Fast start
        else if (prev < 60) increment = Math.random() * 15 + 3; // Medium
        else increment = Math.random() * 8 + 1; // Slower towards end
        
        return Math.min(prev + increment, 95);
      });
    }, 300);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [isMounted]);

  // Handle completion after minimum time
  useEffect(() => {
    if (!isMounted) return;
    
    const minLoadingTime = 2000; // 2 seconds minimum
    
    const completionTimer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        
        // Complete progress
        setProgress(100);
        
        // Start fade out after brief delay
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }
    }, minLoadingTime);

    return () => clearTimeout(completionTimer);
  }, [isMounted]);

  // If not mounted or not visible, don't render
  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/90 via-white/80 to-purple-50/90 backdrop-blur-md z-[9998] transition-all duration-500">
      {/* Click blocker */}
      <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
      
      {/* Main loading container */}
      <div className="flex flex-col items-center justify-between h-full py-12 relative z-10 max-w-sm mx-auto">
        
        {/* Top spacer */}
        <div className="flex-1"></div>
        
        {/* Logo section with enhanced animations */}
        <div className="relative flex flex-col items-center space-y-8">
          {/* Spinning rings container */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring - slowest */}
            <div className="w-36 h-36 border-2 border-gradient-to-r from-blue-200 to-purple-200 rounded-full animate-spin-slow opacity-60"></div>
            
            {/* Middle ring - medium speed */}
            <div className="absolute w-32 h-32 border-2 border-blue-400/70 rounded-full animate-spin border-t-transparent border-r-transparent"></div>
            
            {/* Inner ring - fastest */}
            <div className="absolute w-28 h-28 border-2 border-blue-600 rounded-full animate-spin-fast border-t-transparent border-l-transparent"></div>
            
            {/* Pulse ring */}
            <div className="absolute w-40 h-40 border border-blue-300/30 rounded-full animate-pulse"></div>
            
            {/* Logo container with enhanced styling */}
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-white via-blue-50 to-white shadow-xl flex items-center justify-center overflow-hidden ring-2 ring-blue-100/50">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom spacer */}
        <div className="flex-1"></div>
      </div>
      
      {/* Enhanced CSS Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        
        .flex.flex-col {
          animation: fadeIn 0.6s ease-out, float 4s ease-in-out infinite;
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
        
        /* Enhanced logo container animation */
        .w-24.h-24.rounded-full {
          animation: fadeIn 0.8s ease-out 0.2s both, float 3s ease-in-out infinite 1s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .w-36.h-36 { width: 8rem; height: 8rem; }
          .w-32.h-32 { width: 7rem; height: 7rem; }
          .w-28.h-28 { width: 6rem; height: 6rem; }
          .w-24.h-24 { width: 5rem; height: 5rem; }
          .w-16.h-16 { width: 3rem; height: 3rem; }
        }
        
        /* Smooth fade out when component unmounts */
        .transition-all {
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}