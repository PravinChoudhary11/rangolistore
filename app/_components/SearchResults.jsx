// app/_components/SearchResults.jsx
import React from "react";
import Image from "next/image";
import { Search, Star, Tag, ShoppingBag, TrendingUp, X } from "lucide-react";

const SearchResults = ({ 
  searchResults, 
  searchQuery, 
  handleProductClick, 
  isMobile = false,
  onClose
}) => {
  if (!searchQuery.trim()) {
    return null;
  }

  // Case-insensitive search with better matching
  const getMatchedResults = () => {
    const query = searchQuery.toLowerCase().trim();
    
    return searchResults
      .filter(product => {
        const name = product.name?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const model = product.model?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        
        return name.includes(query) || 
               category.includes(query) || 
               brand.includes(query) || 
               model.includes(query) ||
               description.includes(query);
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
        
        // Then by relevance (word boundary matches)
        const aWordMatch = new RegExp(`\\b${query}`, 'i').test(aName);
        const bWordMatch = new RegExp(`\\b${query}`, 'i').test(bName);
        if (aWordMatch && !bWordMatch) return -1;
        if (bWordMatch && !aWordMatch) return 1;
        
        return 0;
      })
      .slice(0, isMobile ? 8 : 12); // Limit results
  };

  const matchedResults = getMatchedResults();

  if (!matchedResults.length) {
    return (
      <div className={`
        bg-white shadow-2xl rounded-2xl border border-gray-100
        ${isMobile ? 'mx-2' : 'w-full max-w-2xl mx-auto'}
        overflow-hidden backdrop-blur-sm backdrop-filter
        animate-in fade-in slide-in-from-top-2 duration-300
        relative z-[99999]
      `}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500">
            No results for "<span className="font-medium">{searchQuery}</span>". Try different keywords.
          </p>
        </div>
      </div>
    );
  }

  // Highlight matching text
  const highlightMatch = (text) => {
    if (!searchQuery.trim() || !text) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className={`
      bg-white shadow-2xl rounded-2xl border border-gray-100
      ${isMobile ? 'mx-2' : 'w-full max-w-2xl mx-auto'}
      overflow-hidden backdrop-blur-sm backdrop-filter
      animate-in fade-in slide-in-from-top-2 duration-300
      relative z-[99999]
    `}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
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
            className="group relative border-b border-gray-50 last:border-b-0 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-transparent transition-all duration-200 cursor-pointer"
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
                {product.image ? (
                  <Image
                    src={`${product.image}`}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:brightness-110 transition-all duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col min-w-0 flex-1">
                {/* Title and Stock Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`
                    font-semibold text-gray-900 group-hover:text-indigo-700 
                    transition-colors duration-200 leading-tight
                    ${isMobile ? 'text-base' : 'text-lg'}
                  `}>
                    {highlightMatch(product.name)}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {product.inStock && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium whitespace-nowrap">
                        ✓ In Stock
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium whitespace-nowrap">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating, Category, Brand */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {product.rating}
                      </span>
                      {product.reviewCount && (
                        <span className="text-xs text-gray-400">
                          ({product.reviewCount})
                        </span>
                      )}
                    </div>
                  )}

                  {product.category && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs">
                        {highlightMatch(product.category)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Brand */}
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    {highlightMatch(product.brand)}
                  </p>
                )}

                {/* Price */}
                {product.price && (
                  <div className="flex items-center gap-3">
                    <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-indigo-600`}>
                      {formatPrice(product.price)}
                    </p>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <>
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </p>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hover Indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-5 top-1/2 transform -translate-y-1/2">
                <div className="bg-indigo-100 rounded-full p-2 shadow-md">
                  <Search className="h-4 w-4 text-indigo-600" />
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

export default SearchResults;