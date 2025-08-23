// app/_components/SearchBar.jsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ChevronDown, ArrowLeft } from "lucide-react";
import SearchResults from "./SearchResults";
import GolbalApi from "../_utils/GlobalApi";

// Your website's theme colors
const rangoliTheme = {
  primary: "#173961",
  secondary: "#1e4b87", 
  accent: "#0f2d4e",
  light: "#64b5f6",
  text: "#ffffff"
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function SearchBar({ onResultClick }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fix SSR hydration and detect mobile
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          // console.log('Searching for:', query);
          const results = await GolbalApi.searchProducts(query);
          // console.log('Search results:', results);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
          setShowResults(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleProductClick = async (product) => {
    // console.log('Product clicked:', product);
    
    try {
      // Set navigation state immediately
      setIsNavigating(true);
      
      // Clear search state
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
      setIsFocused(false);
      
      // Hide keyboard on mobile
      if (inputRef.current) {
        inputRef.current.blur();
      }
      
      if (onResultClick) {
        onResultClick();
      }
      
      // Validate product slug
      if (!product.slug) {
        console.error('Product is missing slug:', product);
        const generatedSlug = product.name?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `product-${product.id}`;
        product.slug = generatedSlug;
      }
      
      const targetUrl = `/product/${product.slug}`;
      // console.log('Navigating to:', targetUrl);
      
      // Use router.push with proper error handling
      await router.push(targetUrl);
      
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsNavigating(false);
      
      // Show user-friendly error
      alert('Failed to navigate to product. Please try again.');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const closeSearch = () => {
    setShowResults(false);
    setIsFocused(false);
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Handle click outside and escape key
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event) => {
      if (!isMobile && showResults) {
        const isClickInOverlay = event.target.closest('.search-overlay-desktop');
        if (!isClickInOverlay) {
          closeSearch();
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showResults) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMounted, showResults, isMobile]);

  // Improved navigation timeout and cleanup
  useEffect(() => {
    if (isNavigating) {
      // Set a longer timeout for navigation
      const timeout = setTimeout(() => {
        console.log('Navigation timeout reached, resetting state');
        setIsNavigating(false);
      }, 8000); // Increased to 8 seconds
      
      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

  // Listen for route changes to reset navigation state
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      // console.log('Route change completed');
      setIsNavigating(false);
    };

    // Reset navigation state when the page loads/changes
    handleRouteChangeComplete();

    return () => {
      // Cleanup function
    };
  }, []);

  // Mobile Fullscreen Overlay
  const MobileSearchOverlay = () => {
    if (!isMounted || !isMobile || !isFocused) return null;

    return createPortal(
      <div className="fixed inset-0 bg-white z-[999999] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isNavigating}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center border-2 rounded-xl h-12 px-4 bg-white transition-all duration-300"
                   style={{
                     borderColor: rangoliTheme.primary,
                     boxShadow: `0 0 0 2px ${rangoliTheme.primary}20`
                   }}>
                <Search className="h-5 w-5 flex-shrink-0" style={{ color: rangoliTheme.primary }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Search products..."
                  className="ml-3 outline-none bg-transparent placeholder-gray-400 w-full"
                  style={{ color: rangoliTheme.primary }}
                  autoFocus
                  disabled={isNavigating}
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {searchQuery && !isNavigating && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors ml-2"
                    disabled={isNavigating}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
                {(isSearching || isNavigating) && (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" style={{ color: rangoliTheme.primary }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {showResults && !isNavigating && (
            <SearchResults 
              searchResults={searchResults}
              searchQuery={searchQuery}
              handleProductClick={handleProductClick}
              isMobile={true}
              isFullscreen={true}
              onClose={closeSearch}
            />
          )}
        </div>
      </div>,
      document.body
    );
  };

  // Desktop Overlay
  const DesktopSearchOverlay = () => {
    if (!isMounted || isMobile || !showResults) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-30 z-[999999] flex items-start justify-center pt-20 px-4 search-overlay-desktop">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center border-2 rounded-xl h-14 px-5 bg-white transition-all duration-300"
                     style={{
                       borderColor: rangoliTheme.primary,
                       boxShadow: `0 0 0 2px ${rangoliTheme.primary}20`
                     }}>
                  <Search className="h-6 w-6 flex-shrink-0" style={{ color: rangoliTheme.primary }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Search for products, brands, categories..."
                    className="ml-4 outline-none bg-transparent placeholder-gray-400 w-full text-lg"
                    style={{ color: rangoliTheme.primary }}
                    disabled={isNavigating}
                    autoFocus
                  />
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {searchQuery && !isNavigating && (
                      <button
                        onClick={handleClearSearch}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                        disabled={isNavigating}
                      >
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    )}
                    {(isSearching || isNavigating) && (
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: rangoliTheme.primary }} />
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={closeSearch}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isNavigating}
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Results Container */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            {!isNavigating && (
              <SearchResults 
                searchResults={searchResults}
                searchQuery={searchQuery}
                handleProductClick={handleProductClick}
                isMobile={false}
                isFullscreen={true}
                onClose={closeSearch}
              />
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (!isMounted) {
    return (
      <div className="w-full search-container relative" ref={searchContainerRef}>
        <div className="flex items-center border-2 border-gray-300 rounded-xl h-12 md:h-14 px-4 md:px-5 bg-white">
          <Search className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="ml-3 md:ml-4 outline-none bg-transparent placeholder-gray-400 w-full"
            disabled
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Improved Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/95 backdrop-blur-md z-[100000] transition-all duration-300">
          <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
          
          <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 rounded-full animate-spin"
                   style={{ borderColor: `${rangoliTheme.primary}20` }}></div>
              <div className="absolute w-16 h-16 border-4 rounded-full animate-spin border-t-transparent"
                   style={{ borderColor: rangoliTheme.primary }}></div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xl font-semibold" style={{ color: rangoliTheme.primary }}>
                Opening Product...
              </span>
              <span className="text-sm text-center max-w-xs" style={{ color: rangoliTheme.secondary }}>
                Please wait while we load the product details
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Search Container */}
      <div className="hidden md:block w-full search-container relative" ref={searchContainerRef}>
        <div className={`
          flex items-center relative
          border-2 transition-all duration-300 ease-in-out
          rounded-2xl h-14 px-5 bg-white
          w-full cursor-pointer
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
          hover:shadow-lg
        `}
        style={{
          borderColor: isFocused ? rangoliTheme.primary : '#e5e7eb',
          boxShadow: isFocused ? `0 0 0 4px ${rangoliTheme.primary}20` : 'none'
        }}
        onClick={() => {
          if (!isNavigating) {
            setIsFocused(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }
        }}>
          <Search className="h-6 w-6 flex-shrink-0 transition-all duration-300"
                  style={{ 
                    color: isFocused ? rangoliTheme.primary : '#9ca3af',
                    transform: isFocused ? 'scale(1.1)' : 'scale(1)'
                  }} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleFocus}
            placeholder="Search for products, brands, categories..."
            className="ml-4 outline-none bg-transparent placeholder-gray-400 w-full text-lg"
            style={{ color: rangoliTheme.primary }}
            disabled={isNavigating}
          />
          <div className="flex items-center gap-3 flex-shrink-0">
            {searchQuery && !isNavigating && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSearch();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                disabled={isNavigating}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {(isSearching || isNavigating) && (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: rangoliTheme.primary }} />
              </div>
            )}
            {isFocused && searchQuery && !isSearching && searchResults.length > 0 && !isNavigating && (
              <ChevronDown className="h-5 w-5 text-gray-400 animate-bounce" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Container */}
      <div className="block md:hidden w-full search-container relative" ref={searchContainerRef}>
        <div className={`
          flex items-center
          border-2 transition-all duration-300
          rounded-xl h-12 px-4 bg-white
          min-w-0 relative
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
          ${isFocused ? 'shadow-lg' : 'shadow-sm'}
        `}
        style={{
          borderColor: isFocused ? rangoliTheme.primary : '#e5e7eb',
          boxShadow: isFocused ? `0 0 0 2px ${rangoliTheme.primary}20, 0 4px 12px ${rangoliTheme.primary}10` : 'none'
        }}>
          <Search className="h-5 w-5 flex-shrink-0 transition-colors duration-200"
                  style={{ color: isFocused ? rangoliTheme.primary : '#9ca3af' }} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleFocus}
            placeholder="Search products..."
            className="ml-3 outline-none bg-transparent placeholder-gray-400 w-full min-w-0 text-base"
            style={{ color: rangoliTheme.primary }}
            disabled={isNavigating}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {searchQuery && !isNavigating && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 touch-manipulation"
                disabled={isNavigating}
                type="button"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            {(isSearching || isNavigating) && (
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: rangoliTheme.primary }} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Search Overlay */}
      <MobileSearchOverlay />

      {/* Desktop{/* Desktop Search Overlay */}
      <DesktopSearchOverlay />
    </>
  );
}

export default SearchBar;