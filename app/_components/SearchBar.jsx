// SearchBar.jsx
import React, { useState, useEffect, useCallback } from "react";
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

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const results = await GolbalApi.searchProducts(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
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
  };

  const handleProductClick = async (product) => {
    try {
      setIsNavigating(true);
      setSearchQuery("");
      setSearchResults([]);
      
      if (onResultClick) {
        onResultClick();
      }
      
      await router.push(`/product/${product.slug}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsNavigating(false);
    }
  };

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

  return (
    <>
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999] transition-all duration-300">
          <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
          
          <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin"></div>
              <div className="absolute w-12 h-12 border-4 border-blue-300 rounded-full animate-spin border-t-transparent"></div>
            </div>
            
            <div className="flex items-center justify-center min-w-[160px]">
              <span className="text-lg font-medium text-gray-700">
                Loading Product...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Search Bar */}
      <div className="hidden md:block w-full">
        <div className={`
          flex items-center
          border-2 transition-all duration-200
          ${isFocused ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
          rounded-2xl h-12 px-4 bg-white
          w-full
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for products..."
            className="ml-3 outline-none bg-transparent placeholder-gray-400 text-gray-800 w-full"
            disabled={isNavigating}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
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

        {!isNavigating && (
          <SearchResults 
            searchResults={searchResults}
            searchQuery={searchQuery}
            handleProductClick={handleProductClick}
          />
        )}
      </div>

      {/* Mobile Search Bar */}
      <div className="block md:hidden w-full">
        <div className={`
          flex items-center
          border-2 transition-all duration-200
          ${isFocused ? 'border-indigo-500 shadow-md' : 'border-gray-200'}
          rounded-xl h-12 px-4 bg-white
          min-w-0
          ${isNavigating ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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

        {!isNavigating && (
          <SearchResults 
            searchResults={searchResults}
            searchQuery={searchQuery}
            handleProductClick={handleProductClick}
            isMobile={true}
          />
        )}
      </div>
    </>
  );
}

export default SearchBar;