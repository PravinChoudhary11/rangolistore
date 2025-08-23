// contexts/NavigationLoadingContext.js - Enhanced Professional Version
'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, enter, loading, exit
  const [loadingText, setLoadingText] = useState('Loading');
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);
  const isInitialLoad = useRef(true);
  const loadingTimeoutRef = useRef(null);
  const navigationStartTime = useRef(null);
  const phaseTimeoutRef = useRef(null);
  const textAnimationRef = useRef(null);

  // Loading text animation
  useEffect(() => {
    if (isLoading) {
      textAnimationRef.current = setInterval(() => {
        setLoadingText(prev => {
          if (prev === 'Loading...') return 'Loading';
          return prev + '.';
        });
      }, 500);
    } else {
      if (textAnimationRef.current) {
        clearInterval(textAnimationRef.current);
      }
      setLoadingText('Loading');
    }

    return () => {
      if (textAnimationRef.current) {
        clearInterval(textAnimationRef.current);
      }
    };
  }, [isLoading]);

  // Enhanced route change detection with minimum duration
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousPathname.current = pathname;
      return;
    }

    if (previousPathname.current !== pathname) {
      navigationStartTime.current = Date.now();
      
      // Phase 1: Enter animation
      setAnimationPhase('enter');
      setIsLoading(true);
      
      // Phase 2: Loading phase (after enter animation)
      phaseTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('loading');
      }, 400);
      
      // Phase 3: Ensure minimum 2 second loading time
      loadingTimeoutRef.current = setTimeout(() => {
        const elapsed = Date.now() - navigationStartTime.current;
        const remainingTime = Math.max(0, 2000 - elapsed);
        
        setTimeout(() => {
          setAnimationPhase('exit');
          
          // Final phase: Complete
          setTimeout(() => {
            setIsLoading(false);
            setAnimationPhase('idle');
          }, 500);
        }, remainingTime);
      }, 100);

      previousPathname.current = pathname;
      
      return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      };
    }
  }, [pathname]);

  // Enhanced router methods with smooth transitions
  const enhancedRouter = useCallback(() => ({
    ...router,
    push: async (href, options = {}) => {
      navigationStartTime.current = Date.now();
      setAnimationPhase('enter');
      setIsLoading(true);
      return router.push(href, options);
    },
    replace: async (href, options = {}) => {
      navigationStartTime.current = Date.now();
      setAnimationPhase('enter');
      setIsLoading(true);
      return router.replace(href, options);
    },
    back: () => {
      navigationStartTime.current = Date.now();
      setAnimationPhase('enter');
      setIsLoading(true);
      return router.back();
    },
    forward: () => {
      navigationStartTime.current = Date.now();
      setAnimationPhase('enter');
      setIsLoading(true);
      return router.forward();
    },
    refresh: () => {
      navigationStartTime.current = Date.now();
      setAnimationPhase('enter');
      setIsLoading(true);
      return router.refresh();
    }
  }), [router]);

  const startLoading = useCallback(() => {
    navigationStartTime.current = Date.now();
    setAnimationPhase('enter');
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    const elapsed = Date.now() - (navigationStartTime.current || Date.now());
    const remainingTime = Math.max(0, 2000 - elapsed);
    
    setTimeout(() => {
      setAnimationPhase('exit');
      setTimeout(() => {
        setIsLoading(false);
        setAnimationPhase('idle');
      }, 400);
    }, remainingTime);
  }, []);

  // Browser navigation events
  useEffect(() => {
    let isHandlingNavigation = false;

    const handleNavigationStart = () => {
      if (!isHandlingNavigation) {
        isHandlingNavigation = true;
        navigationStartTime.current = Date.now();
        setAnimationPhase('enter');
        setIsLoading(true);
        
        setTimeout(() => {
          isHandlingNavigation = false;
        }, 3000);
      }
    };

    window.addEventListener('popstate', handleNavigationStart, { passive: true });
    window.addEventListener('beforeunload', handleNavigationStart, { passive: true });

    return () => {
      window.removeEventListener('popstate', handleNavigationStart);
      window.removeEventListener('beforeunload', handleNavigationStart);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (textAnimationRef.current) clearInterval(textAnimationRef.current);
    };
  }, []);

  return (
    <NavigationLoadingContext.Provider 
      value={{ 
        isLoading, 
        animationPhase,
        startLoading, 
        stopLoading,
        router: enhancedRouter()
      }}
    >
      {children}
      {isLoading && <ProfessionalNavigationOverlay phase={animationPhase} loadingText={loadingText} />}
    </NavigationLoadingContext.Provider>
  );
};

// Professional navigation overlay matching your main loading component
const ProfessionalNavigationOverlay = React.memo(({ phase, loadingText }) => {
  // Get animation classes based on phase
  const getPhaseClasses = () => {
    switch (phase) {
      case 'enter':
        return 'animate-fade-in opacity-0';
      case 'loading':
        return 'opacity-100';
      case 'exit':
        return 'animate-fade-out opacity-100';
      default:
        return 'opacity-100';
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] transition-all duration-500 ${getPhaseClasses()}`}>
      {/* Professional gradient background matching main loading */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/80 to-purple-50/90 backdrop-blur-md"></div>
      
      {/* Prevent interaction */}
      <div 
        className="absolute inset-0 cursor-wait" 
        onClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Main loading container matching your style */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-12 max-w-sm mx-auto">
        
        {/* Top spacer */}
        <div className="flex-1"></div>
        
        {/* Logo section with enhanced animations */}
        <div className="relative flex flex-col items-center space-y-8">
          {/* Spinning rings container matching main loading */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring - slowest */}
            <div className="w-36 h-36 border-2 border-gradient-to-r from-blue-200 to-purple-200 rounded-full animate-spin-slow opacity-60"></div>
            
            {/* Middle ring - medium speed */}
            <div className="absolute w-32 h-32 border-2 border-blue-400/70 rounded-full animate-spin border-t-transparent border-r-transparent"></div>
            
            {/* Inner ring - fastest */}
            <div className="absolute w-28 h-28 border-2 border-blue-600 rounded-full animate-spin-fast border-t-transparent border-l-transparent"></div>
            
            {/* Pulse ring */}
            <div className="absolute w-40 h-40 border border-blue-300/30 rounded-full animate-pulse"></div>
            
            {/* Logo container with enhanced styling matching main loading */}
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
      
      {/* Enhanced custom styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fade-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(1.05) translateY(-10px);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fade-out 0.4s ease-in forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        
        .flex.flex-col {
          animation: fade-in 0.6s ease-out, float 4s ease-in-out infinite;
        }
        
        /* Enhanced logo container animation */
        .w-24.h-24.rounded-full {
          animation: fade-in 0.8s ease-out 0.2s both, float 3s ease-in-out infinite 1s;
        }
        
        /* Responsive adjustments matching main loading */
        @media (max-width: 640px) {
          .w-36.h-36 { width: 8rem; height: 8rem; }
          .w-32.h-32 { width: 7rem; height: 7rem; }
          .w-28.h-28 { width: 6rem; height: 6rem; }
          .w-24.h-24 { width: 5rem; height: 5rem; }
          .w-16.h-16 { width: 3rem; height: 3rem; }
        }
        
        /* Smooth transitions */
        .transition-all {
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
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
});

ProfessionalNavigationOverlay.displayName = 'ProfessionalNavigationOverlay';