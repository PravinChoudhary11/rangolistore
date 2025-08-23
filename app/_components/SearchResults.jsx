// app/_components/SearchResults.jsx
"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, ShoppingBag, TrendingUp, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Your website's theme colors
const rangoliTheme = {
  primary: "#173961",
  secondary: "#1e4b87", 
  accent: "#0f2d4e",
  light: "#64b5f6",
  text: "#ffffff"
};

const SearchResults = ({ 
  searchResults, 
  searchQuery, 
  handleProductClick, 
  isMobile = false,
  isFullscreen = false,
  onClose
}) => {
  const scrollContainerRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(false);
  const [loadingProductId, setLoadingProductId] = React.useState(null);

  // Handle product click with immediate feedback
  const handleProductClickWithFeedback = async (product) => {
    try {
      // Set loading state for this product
      setLoadingProductId(product.id);
      
      // Call the original handler immediately
      await handleProductClick(product);
      
    } catch (error) {
      console.error('Error navigating to product:', error);
      // Reset loading state on error
      setLoadingProductId(null);
    }
  };

  // Prevent body scroll when fullscreen overlay is open
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.top = '';
      };
    }
  }, [isFullscreen]);

  if (!searchQuery.trim()) {
    return (
      <div className={`
        ${isFullscreen ? 'h-full flex items-center justify-center px-4' : 'p-8'}
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
    
    const filteredResults = searchResults.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      
      return name.includes(query) || description.includes(query);
    });
    
    const sortedResults = filteredResults.sort((a, b) => {
      const aName = a.name?.toLowerCase() || '';
      const bName = b.name?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      if (aName === query && bName !== query) return -1;
      if (bName === query && aName !== query) return 1;
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
      
      return 0;
    });
    
    const finalLimit = isFullscreen ? 500 : 100;
    return sortedResults.slice(0, finalLimit);
  };

  const matchedResults = getMatchedResults();

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current && isFullscreen) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    if (matchedResults.length > 0 && isFullscreen) {
      setTimeout(checkScrollable, 100);
    }
  }, [matchedResults.length, isFullscreen]);

  if (!matchedResults.length) {
    return (
      <div className={`
        ${isFullscreen ? 'h-full flex items-center justify-center px-4' : 
          `bg-white shadow-2xl border border-gray-100 
           ${isMobile ? 'mx-2 rounded-2xl' : 'w-full rounded-b-2xl rounded-t-none border-t-0'} 
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
    return `₹${price?.toLocaleString() || '0'}`;
  };

  // Get proper image URL with better error handling
  const getImageUrl = (product) => {
    try {
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const imageUrl = product.images[0]?.url;
        if (imageUrl) {
          // If the URL already starts with http/https, use it as is
          if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
          }
          // Otherwise, prepend the backend base URL
          return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}`;
        }
      }
    } catch (error) {
      console.error('Error getting image URL:', error);
    }
    return null;
  };

  // Handle scroll events
  const handleScrollEvent = (e) => {
    e.stopPropagation();
  };

  if (isFullscreen) {
    // Mobile/Fullscreen layout
    return (
      <div className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden backdrop-blur-sm backdrop-filter animate-in fade-in slide-in-from-top-2 duration-300 mx-2 mt-2">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Search className="h-4 w-4 text-blue-600" />
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
                <X className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable results */}
        <div 
          ref={scrollContainerRef}
          className="max-h-[60vh] overflow-y-auto overflow-x-hidden bg-gray-50"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
          onWheel={handleScrollEvent}
          onTouchMove={handleScrollEvent}
        >
          <div className="bg-white">
            <div className="divide-y divide-gray-100">
              {matchedResults.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClickWithFeedback(product)}
                  className={`
                    active:bg-blue-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer touch-manipulation
                    ${loadingProductId === product.id ? 'bg-blue-100 opacity-75 pointer-events-none' : ''}
                  `}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    animationDelay: `${index * 30}ms`
                  }}
                >
                  <div className="flex items-center gap-4 px-4 py-3">
                    {/* Product Image with loading indicator */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm relative">
                      {loadingProductId === product.id && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-10">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {getImageUrl(product) ? (
                        <Image
                          src={getImageUrl(product)}
                          alt={product.name || 'Product image'}
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-icon');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="fallback-icon w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 text-sm">
                          {highlightMatch(product.name || 'Unnamed Product')}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-base" style={{ color: rangoliTheme.primary }}>
                            {formatPrice(product.sellingPrice)}
                          </p>
                          {product.MRP && product.MRP > product.sellingPrice && (
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(product.MRP)}
                              </p>
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
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
            </div>
            
            {/* Bottom padding */}
            <div className="h-12 bg-white flex items-center justify-center border-t border-gray-100">
              <p className="text-gray-400 text-sm">
                {matchedResults.length} results • Scroll for more
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="bg-white shadow-2xl border border-gray-100 rounded-b-2xl border-t-0 overflow-hidden backdrop-blur-sm backdrop-filter animate-in fade-in slide-in-from-top-2 duration-300">
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
        </div>
      </div>

      {/* Results */}
      <div 
        className="max-h-[70vh] overflow-y-auto overscroll-contain"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
        onWheel={handleScrollEvent}
      >
        <div className="divide-y divide-gray-50">
          {matchedResults.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClickWithFeedback(product)}
              className={`
                group relative hover:bg-gradient-to-r hover:from-blue-25 hover:to-transparent 
                transition-all duration-200 cursor-pointer
                ${loadingProductId === product.id ? 'bg-blue-100 opacity-75 pointer-events-none' : ''}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Product Image with loading indicator */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg bg-gradient-to-br from-gray-100 to-gray-50">
                  {loadingProductId === product.id && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {getImageUrl(product) ? (
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name || 'Product image'}
                      fill
                      className="object-cover group-hover:brightness-110 transition-all duration-300"
                      sizes="80px"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.fallback-icon');
                        if (fallback) fallback.style.display = 'flex';
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
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 leading-tight text-lg">
                      {highlightMatch(product.name || 'Unnamed Product')}
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
                    <p className="text-xl font-bold" style={{ color: rangoliTheme.primary }}>
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
      </div>

      {/* Footer */}
      {matchedResults.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Press Enter or click on any product to view details • Scroll to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;