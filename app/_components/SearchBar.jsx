import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import GolbalApi from "../_utils/GlobalApi";
import SearchResults from "./SearchResults";

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
  const searchContainerRef = useRef(null);

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

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleProductClick = async (product) => {
    try {
      setIsNavigating(true);
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
      
      if (onResultClick) {
        onResultClick();
      }
      
      await router.push(`/product/${product.slug}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsNavigating(false);
    }
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for successful navigation to stop loading
  useEffect(() => {
    const handleRouteChange = () => {
      setIsNavigating(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

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
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <>
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/90 backdrop-blur-md z-[100000] transition-all duration-300">
          <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
          
          <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-spin"></div>
              <div className="absolute w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute w-12 h-12 border-2 border-indigo-300 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xl font-semibold text-gray-800">
                Loading Product...
              </span>
              <span className="text-sm text-gray-500">
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
          ${isFocused ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
          rounded-2xl h-14 px-5 bg-white
          w-full transform
          ${isFocused ? 'scale-[1.02]' : 'scale-100'}
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <Search className={`
            h-6 w-6 flex-shrink-0 transition-all duration-300
            ${isFocused ? 'text-indigo-500 scale-110' : 'text-gray-400'}
          `} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleFocus}
            placeholder="Search for products, brands, categories..."
            className="ml-4 outline-none bg-transparent placeholder-gray-400 text-gray-800 w-full text-lg"
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
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search Results */}
        {showResults && !isNavigating && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[99999] pointer-events-none">
            <div 
              className="absolute pointer-events-auto"
              style={{
                top: '120px', // Adjust this based on your header height
                left: '50%',
                transform: 'translateX(-50%)',
                width: '500px',
                maxWidth: '90vw'
              }}
            >
              <SearchResults 
                searchResults={searchResults}
                searchQuery={searchQuery}
                handleProductClick={handleProductClick}
                onClose={() => setShowResults(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Search Container - Mobile */}
      <div className="block md:hidden w-full search-container relative" ref={searchContainerRef}>
        <div className={`
          flex items-center
          border-2 transition-all duration-300
          ${isFocused ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300'}
          rounded-xl h-12 px-4 bg-white
          min-w-0
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <Search className={`
            h-5 w-5 flex-shrink-0 transition-colors duration-200
            ${isFocused ? 'text-indigo-500' : 'text-gray-400'}
          `} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleFocus}
            placeholder="Search products..."
            className="ml-3 outline-none bg-transparent placeholder-gray-400 text-gray-800 w-full min-w-0"
            disabled={isNavigating}
          />
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {searchQuery && !isNavigating && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={isNavigating}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            {(isSearching || isNavigating) && (
              <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
            )}
          </div>
        </div>

        {/* Mobile Search Results */}
        {showResults && !isNavigating && (
          <div className="absolute top-full left-0 right-0 z-[99999] mt-2">
            <SearchResults 
              searchResults={searchResults}
              searchQuery={searchQuery}
              handleProductClick={handleProductClick}
              isMobile={true}
              onClose={() => setShowResults(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;