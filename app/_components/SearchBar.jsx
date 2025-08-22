// app/_components/SearchBar.jsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ChevronDown, ShoppingBag, Star, Tag, TrendingUp, ArrowLeft } from "lucide-react";
import Image from "next/image";
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

// Enhanced SearchResults component
const EnhancedSearchResults = ({ 
  searchResults, 
  searchQuery, 
  handleProductClick, 
  isMobile = false,
  isFullscreen = false,
  onClose
}) => {
  if (!searchQuery.trim()) {
    return (
      <div className={`
        ${isFullscreen ? 'h-full flex items-center justify-center' : 'p-8'}
        text-center
      `}>
        <div>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Start typing to search products...</p>
          <p className="text-gray-400 text-sm mt-2">Discover amazing products from our catalog</p>
        </div>
      </div>
    );
  }

  // Enhanced search matching
  const getMatchedResults = () => {
    const query = searchQuery.toLowerCase().trim();
    
    return searchResults
      .filter(product => {
        const name = product.name?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        
        return name.includes(query) || description.includes(query);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        // Exact matches first
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;
        
        // Starts with matches next
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
        
        return 0;
      })
      .slice(0, isFullscreen ? 20 : (isMobile ? 8 : 12));
  };

  const matchedResults = getMatchedResults();

  if (!matchedResults.length) {
    return (
      <div className={`
        ${isFullscreen ? 'h-full flex items-center justify-center px-4' : 
          `bg-white shadow-2xl rounded-2xl border border-gray-100 
           ${isMobile ? 'mx-2' : 'w-full max-w-2xl mx-auto'} 
           overflow-hidden`}
      `}>
        <div className={`${isFullscreen ? '' : 'p-6'} text-center`}>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-50 to-orange-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500">
            No results for "<span className="font-medium text-indigo-600">{searchQuery}</span>". Try different keywords.
          </p>
        </div>
      </div>
    );
  }

  // Highlight matching text
  const highlightMatch = (text) => {
    if (!searchQuery.trim() || !text) return text;
    
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return (
          <span key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  // Get proper image URL
  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return null;
  };

  if (isFullscreen) {
    // Mobile fullscreen layout
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Results count header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800">
                {matchedResults.length} {matchedResults.length === 1 ? 'result' : 'results'}
              </p>
              <p className="text-sm text-gray-500">
                for "<span className="font-medium text-indigo-600">{searchQuery}</span>"
              </p>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Scrollable results */}
        <div className="flex-1 overflow-y-auto bg-white" style={{ WebkitOverflowScrolling: 'touch' }}>
          {matchedResults.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="border-b border-gray-100 last:border-b-0 active:bg-blue-50 transition-all duration-200 cursor-pointer hover:shadow-sm"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                animationDelay: `${index * 30}ms` 
              }}
            >
              <div className="p-4 flex items-center gap-4">
                {/* Product Image */}
                <div className="w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm">
                  {getImageUrl(product) ? (
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
                      {highlightMatch(product.name)}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold" style={{ color: rangoliTheme.primary }}>
                        {formatPrice(product.sellingPrice)}
                      </p>
                      {product.MRP && product.MRP > product.sellingPrice && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(product.MRP)}
                          </p>
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                            {Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)}% OFF
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Bottom padding for better scroll experience */}
          <div className="h-6"></div>
        </div>
      </div>
    );
  }

  // Desktop/tablet layout
  return (
    <div className={`
      bg-white shadow-2xl rounded-2xl border border-gray-100
      ${isMobile ? 'mx-2' : 'w-full max-w-2xl mx-auto'}
      overflow-hidden backdrop-blur-sm backdrop-filter
      animate-in fade-in slide-in-from-top-2 duration-300
      relative z-[99999]
    `}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Found {matchedResults.length} {matchedResults.length === 1 ? 'result' : 'results'}
              </p>
              <p className="text-xs text-gray-500">
                for "<span className="font-medium text-indigo-600">{searchQuery}</span>"
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-[500px]'} overflow-y-auto custom-scrollbar`}>
        {matchedResults.map((product, index) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="group relative border-b border-gray-50 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-25 hover:to-transparent transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-5 flex items-center gap-4">
              {/* Product Image */}
              <div className={`
                relative ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
                rounded-xl overflow-hidden flex-shrink-0 
                transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg
                bg-gradient-to-br from-gray-100 to-gray-50
              `}>
                {getImageUrl(product) ? (
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="fallback-icon w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col min-w-0 flex-1">
                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`
                    font-semibold text-gray-900 group-hover:text-blue-700 
                    transition-colors duration-200 leading-tight
                    ${isMobile ? 'text-base' : 'text-lg'}
                  `}>
                    {highlightMatch(product.name)}
                  </h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium whitespace-nowrap">
                    ✓ Available
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description.slice(0, 100)}...
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-3">
                  <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`} style={{ color: rangoliTheme.primary }}>
                    {formatPrice(product.sellingPrice)}
                  </p>
                  {product.MRP && product.MRP > product.sellingPrice && (
                    <>
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(product.MRP)}
                      </p>
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                        {Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-5 top-1/2 transform -translate-y-1/2">
                <div className="bg-blue-100 rounded-full p-2 shadow-md">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {matchedResults.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Press Enter or click on any product to view details
          </p>
        </div>
      )}
    </div>
  );
};

function SearchBar({ onResultClick }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchPosition, setSearchPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fix SSR hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const results = await GolbalApi.searchProducts(query);
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
      }
    }, 300),
    []
  );

  // Update search position when showing results
  const updateSearchPosition = useCallback(() => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setSearchPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Update position when showing results
  useEffect(() => {
    if (showResults && isMounted) {
      updateSearchPosition();
      
      // Update position on scroll/resize
      const handleUpdate = () => updateSearchPosition();
      window.addEventListener('scroll', handleUpdate, { passive: true });
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [showResults, updateSearchPosition, isMounted]);

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

  // Add this debugging version to your SearchBar component
const handleProductClick = async (product) => {
  console.log('Product clicked:', product); // Debug: Check product object
  console.log('Product slug:', product.slug); // Debug: Check if slug exists
  
  try {
    setIsNavigating(true);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsFocused(false);
    
    // Hide mobile keyboard
    if (inputRef.current) {
      inputRef.current.blur();
    }
    
    if (onResultClick) {
      onResultClick();
    }
    
    // Check if product has slug
    if (!product.slug) {
      console.error('Product is missing slug:', product);
      // Generate slug from name or use ID as fallback
      const generatedSlug = product.name?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || product.id;
      console.log('Generated slug:', generatedSlug);
      product.slug = generatedSlug;
    }
    
    const targetUrl = `/product/${product.slug}`;
    console.log('Navigating to:', targetUrl); // Debug: Check target URL
    
    await router.push(targetUrl);
    console.log('Navigation successful'); // Debug: Confirm navigation
    
  } catch (error) {
    console.error("Navigation failed:", error);
    setIsNavigating(false);
    
    // Show user-friendly error
    alert('Failed to navigate to product. Please try again.');
  }
};

  // Handle click outside to close results
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMounted]);

  // Listen for successful navigation to stop loading
  useEffect(() => {
    if (!isMounted) return;

    const handleRouteChange = () => {
      setIsNavigating(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isMounted]);

  // Auto-stop navigation loading after reasonable time (failsafe)
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

  const handleFocus = () => {
    setIsFocused(true);
    updateSearchPosition();
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = (e) => {
    // Don't close if clicking on results
    if (e.relatedTarget?.closest('.search-results-container')) {
      return;
    }
    
    // Delay to allow for result clicks
    setTimeout(() => {
      if (isMounted && window.innerWidth > 768) {
        setIsFocused(false);
        setShowResults(false);
      }
    }, 150);
  };

  // Mobile Search Overlay - Fixed SSR issue
  const MobileSearchOverlay = () => {
    if (!isMounted || !showResults || !isFocused) return null;
    if (typeof window !== 'undefined' && window.innerWidth > 768) return null;

    return createPortal(
      <div className="fixed inset-0 bg-white z-[999999] flex flex-col md:hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowResults(false);
                setIsFocused(false);
                if (inputRef.current) inputRef.current.blur();
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Search products..."
                  className="ml-3 outline-none bg-transparent placeholder-gray-400 w-full"
                  style={{ color: rangoliTheme.primary }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
                {isSearching && (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" style={{ color: rangoliTheme.primary }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-hidden">
          <EnhancedSearchResults 
            searchResults={searchResults}
            searchQuery={searchQuery}
            handleProductClick={handleProductClick}
            isMobile={true}
            isFullscreen={true}
            onClose={() => {
              setShowResults(false);
              setIsFocused(false);
              if (inputRef.current) inputRef.current.blur();
            }}
          />
        </div>
      </div>,
      document.body
    );
  };

  // Desktop Search Results Portal Component - Fixed SSR issue
  const DesktopSearchResultsPortal = () => {
    if (!isMounted || !showResults || !searchResults.length || isNavigating) return null;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return null;

    return createPortal(
      <div 
        className="fixed inset-0 pointer-events-none z-[999999] hidden md:block"
        style={{ zIndex: 999999 }}
      >
        <div 
          className="absolute pointer-events-auto"
          style={{
            top: `${searchPosition.top + 8}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            maxWidth: '90vw'
          }}
        >
          <div className="search-results-container">
            <EnhancedSearchResults 
              searchResults={searchResults}
              searchQuery={searchQuery}
              handleProductClick={handleProductClick}
              onClose={() => setShowResults(false)}
            />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (!isMounted) {
    // Return basic search bar for SSR
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
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/90 backdrop-blur-md z-[100000] transition-all duration-300">
          <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
          
          <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 rounded-full animate-spin"
                   style={{ borderColor: `${rangoliTheme.primary}20` }}></div>
              <div className="absolute w-16 h-16 border-4 rounded-full animate-spin border-t-transparent"
                   style={{ borderColor: rangoliTheme.primary }}></div>
              <div className="absolute w-12 h-12 border-2 rounded-full animate-pulse"
                   style={{ borderColor: rangoliTheme.light }}></div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xl font-semibold" style={{ color: rangoliTheme.primary }}>
                Loading Product...
              </span>
              <span className="text-sm" style={{ color: rangoliTheme.secondary }}>
                Please wait while we redirect you
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Container - Desktop */}
      <div className="hidden md:block w-full search-container relative" ref={searchContainerRef}>
        <div className={`
          flex items-center relative
          border-2 transition-all duration-300 ease-in-out
          rounded-2xl h-14 px-5 bg-white
          w-full
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
        `}
        style={{
          borderColor: isFocused ? rangoliTheme.primary : '#e5e7eb',
          boxShadow: isFocused ? `0 0 0 4px ${rangoliTheme.primary}20` : 'none'
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
            onBlur={handleBlur}
            placeholder="Search for products, brands, categories..."
            className="ml-4 outline-none bg-transparent placeholder-gray-400 w-full text-lg"
            style={{ color: rangoliTheme.primary }}
            disabled={isNavigating}
          />
          <div className="flex items-center gap-3 flex-shrink-0">
            {searchQuery && !isNavigating && (
              <button
                onClick={handleClearSearch}
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
          </div>
        </div>
      </div>

      {/* Search Container - Mobile */}
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
            {isFocused && searchQuery && !isSearching && searchResults.length > 0 && (
              <ChevronDown className="h-4 w-4 text-gray-400 animate-bounce" />
            )}
          </div>
          
          {/* Connection indicator for mobile */}
          {isFocused && searchQuery && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 rounded-b-lg"
                 style={{ backgroundColor: rangoliTheme.primary, opacity: 0.1 }}></div>
          )}
        </div>
      </div>

      {/* Mobile Fullscreen Search Overlay */}
      <MobileSearchOverlay />

      {/* Desktop Search Results Portal */}
      <DesktopSearchResultsPortal />
    </>
  );
}

export default SearchBar;