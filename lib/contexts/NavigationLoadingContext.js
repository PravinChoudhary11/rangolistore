// contexts/NavigationLoadingContext.js - Optimized version
'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NavigationLoadingContext = createContext();

export const useNavigationLoading = () => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider');
  }
  return context;
};

export const NavigationLoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);
  const isInitialLoad = useRef(true);
  const loadingTimeoutRef = useRef(null);
  const navigationStartTime = useRef(null);

  // Optimized route change detection with debouncing
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousPathname.current = pathname;
      return;
    }

    if (previousPathname.current !== pathname) {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Loading page...');
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Auto-hide with intelligent timing
      loadingTimeoutRef.current = setTimeout(() => {
        const navigationTime = Date.now() - (navigationStartTime.current || Date.now());
        
        // If navigation was very fast, show loading a bit longer for better UX
        const minLoadingTime = navigationTime < 100 ? 300 : 100;
        
        setTimeout(() => {
          setIsLoading(false);
        }, minLoadingTime);
      }, 500);

      previousPathname.current = pathname;
      
      return () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      };
    }
  }, [pathname]);

  // Enhanced router methods with optimized loading states
  const enhancedRouter = useCallback(() => ({
    ...router,
    push: (href, options = {}) => {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Navigating...');
      return router.push(href, options);
    },
    replace: (href, options = {}) => {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Redirecting...');
      return router.replace(href, options);
    },
    back: () => {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Going back...');
      return router.back();
    },
    forward: () => {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Going forward...');
      return router.forward();
    },
    refresh: () => {
      navigationStartTime.current = Date.now();
      setIsLoading(true);
      setLoadingMessage('Refreshing...');
      return router.refresh();
    }
  }), [router]);

  const startLoading = useCallback((message = 'Loading...') => {
    navigationStartTime.current = Date.now();
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
  }, []);

      // Optimized browser navigation event listeners
  useEffect(() => {
    let isHandlingNavigation = false;

    const handleNavigationStart = () => {
      if (!isHandlingNavigation) {
        isHandlingNavigation = true;
        navigationStartTime.current = Date.now();
        setIsLoading(true);
        setLoadingMessage('Loading...');
        
        // Reset flag after a short delay
        setTimeout(() => {
          isHandlingNavigation = false;
        }, 1000);
      }
    };

    const handleNavigationEnd = () => {
      isHandlingNavigation = false;
      setTimeout(() => setIsLoading(false), 200);
    };

    // Listen for browser navigation events with passive listeners for better performance
    window.addEventListener('popstate', handleNavigationStart, { passive: true });
    window.addEventListener('beforeunload', handleNavigationStart, { passive: true });
    
    // Listen for page load complete
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', handleNavigationEnd, { once: true });
    }

    return () => {
      window.removeEventListener('popstate', handleNavigationStart);
      window.removeEventListener('beforeunload', handleNavigationStart);
      window.removeEventListener('DOMContentLoaded', handleNavigationEnd);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationLoadingContext.Provider 
      value={{ 
        isLoading, 
        loadingMessage, 
        startLoading, 
        stopLoading,
        router: enhancedRouter() // Call the function to get the enhanced router
      }}
    >
      {children}
      {isLoading && <NavigationLoadingOverlay message={loadingMessage} />}
    </NavigationLoadingContext.Provider>
  );
};

// Optimized loading overlay with better performance
const NavigationLoadingOverlay = React.memo(({ message }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const progressRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Reset progress on new loading
    progressRef.current = 0;
    setProgress(0);
    
    // Animate dots with better timing
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    // Smooth progress animation using requestAnimationFrame
    const animateProgress = () => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 8, 85);
      setProgress(progressRef.current);
      
      if (progressRef.current < 85) {
        animationFrameRef.current = requestAnimationFrame(animateProgress);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      clearInterval(dotsInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [message]);

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/90 backdrop-blur-sm z-[9999] transition-opacity duration-200">
      <div 
        className="absolute inset-0 cursor-wait" 
        onClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      <div className="flex flex-col items-center space-y-4 p-6 bg-white/95 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-md relative z-10 animate-fade-in">
        
        {/* Optimized spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-blue-200 rounded-full animate-spin-slow"></div>
          <div className="absolute w-8 h-8 border-3 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Message with dots */}
        <div className="flex items-center justify-center min-w-[100px]">
          <span className="text-base font-medium text-gray-700 select-none">
            {message}{dots}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-40 space-y-1">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 text-center select-none">
            {Math.round(progress)}%
          </div>
        </div>
        
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        /* Prevent text selection on loading overlay */
        .fixed * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        /* Optimize for mobile */
        @media (max-width: 640px) {
          .flex.flex-col.items-center {
            padding: 1rem;
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
});