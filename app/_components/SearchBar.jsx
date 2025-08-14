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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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

  const [isInputEditable, setIsInputEditable] = useState(false);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleProductClick = async (product) => {
    try {
      // Start navigation loading state
      setIsNavigating(true);
      
      // Close search immediately for better UX
      handleCloseSearch();
      
      // Close mobile navbar if the callback is provided
      if (onResultClick) {
        onResultClick();
      }
      
      // Navigate to product page
      // The loading will be handled by the PageDetailsWrapper
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

    // Add event listener for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Auto-stop navigation loading after reasonable time (failsafe)
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 5000); // 5 second failsafe

      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

  return (
    <>
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999] transition-all duration-300">
          <div className="absolute inset-0 cursor-wait" onClick={(e) => e.preventDefault()} />
          
          <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-bounce-gentle relative z-10">
            
            {/* Enhanced spinner */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin-slow"></div>
              <div className="absolute w-12 h-12 border-4 border-blue-300 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute w-8 h-8 border-4 border-blue-600 rounded-full animate-spin-fast border-t-transparent"></div>
              <div className="absolute w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-center min-w-[160px]">
              <span className="text-lg font-medium text-gray-700 transition-all duration-200">
                Loading Product...
              </span>
            </div>
            
            <p className="text-sm text-gray-500 text-center max-w-xs animate-fade-in-out">
              Taking you to the product page
            </p>
          </div>
          
          <style jsx>{`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes spin-fast {
              from { transform: rotate(0deg); }
              to { transform: rotate(720deg); }
            }
            
            @keyframes bounce-gentle {
              0%, 100% { transform: scale(1) translateY(0); opacity: 1; }
              50% { transform: scale(1.02) translateY(-2px); opacity: 0.95; }
            }
            
            @keyframes fade-in-out {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            
            .animate-spin-slow {
              animation: spin-slow 3s linear infinite;
            }
            
            .animate-spin-fast {
              animation: spin-fast 1s linear infinite;
            }
            
            .animate-bounce-gentle {
              animation: bounce-gentle 2s ease-in-out infinite;
            }
            
            .animate-fade-in-out {
              animation: fade-in-out 3s ease-in-out infinite;
            }
            
            .fixed.inset-0 {
              pointer-events: all;
            }
            
            .cursor-wait * {
              user-select: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
            }
          `}</style>
        </div>
      )}

      {/* Desktop Search Bar */}
      <div className="hidden md:block">
        <div className={`
          absolute left-1/2 transform -translate-x-1/2
          flex items-center
          border-2 transition-all duration-200
          ${isFocused ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
          rounded-2xl h-12 px-6 bg-white
          w-[500px] max-w-full z-10
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
            className="ml-4 outline-none bg-transparent placeholder-gray-400 text-gray-800 w-full"
            disabled={isNavigating}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            {searchQuery && !isNavigating && (
              <button
                onClick={handleClearSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={isNavigating}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
            {(isSearching || isNavigating) && (
              <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
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
          <div className="flex-1 min-w-0 flex items-center">
            <input
              type="text"
              readOnly={!isInputEditable}
              onClick={() => !isNavigating && setIsInputEditable(true)}
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setIsInputEditable(false);
              }}
              placeholder="Search products..."
              className="ml-3 outline-none bg-transparent placeholder-gray-400 text-gray-800 w-full min-w-0"
              disabled={isNavigating}
            />
          </div>
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