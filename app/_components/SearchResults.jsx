import React from "react";
import Image from "next/image";
import { Search, Star, Tag } from "lucide-react";

const SearchResults = ({ 
  searchResults, 
  searchQuery, 
  handleProductClick, 
  isMobile = false 
}) => {
  if (!searchQuery.trim()) {
    return null;
  }

  // Case-insensitive search
  const getMatchedResults = () => {
    const query = searchQuery.toLowerCase().trim();
    
    return searchResults
      .filter(product => {
        // Convert product name to lowercase for case-insensitive comparison
        const name = product.name?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const model = product.model?.toLowerCase() || '';
        
        // Check if query exists in any of the fields (case-insensitive)
        return name.includes(query) || 
               category.includes(query) || 
               brand.includes(query) || 
               model.includes(query);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        // Prioritize exact matches first
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;
        
        // Then prioritize starts with matches
        if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
        if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
        
        return 0;
      });
  };

  const matchedResults = getMatchedResults();

  if (!matchedResults.length) {
    return null;
  }

  // Highlight matching text while preserving original case
  const highlightMatch = (text) => {
    if (!searchQuery.trim() || !text) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return <span key={index} className="bg-yellow-100">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className={`
      ${isMobile
        ? `absolute bg-white shadow-xl rounded-xl border border-gray-100
           left-0 right-0 mt-2 z-50 w-full
           transition-all duration-200 ease-in-out`
        : `absolute left-1/2 transform -translate-x-1/2
           bg-white shadow-2xl rounded-2xl border border-gray-100
           w-[500px] max-w-full z-50 mt-14
           backdrop-blur-sm backdrop-filter`
      }
      overflow-hidden
    `}>
      <div className={`
        ${isMobile ? 'p-3' : 'p-4'} 
        bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100
      `}>
        <p className="text-sm text-gray-500">
          Found {matchedResults.length} {matchedResults.length === 1 ? 'result' : 'results'} 
          for "{searchQuery}"
        </p>
      </div>
      <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-[600px]'} overflow-y-auto`}>
        {matchedResults.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="group relative"
          >
            <div className="p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center gap-4">
              {product.image ? (
                <div className={`
                  relative ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
                  rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105
                `}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product.image}`}
                    alt={product.name}
                    fill
                    className="object-cover rounded-xl group-hover:brightness-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
              ) : (
                <div className={`
                  relative ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
                  rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center
                `}>
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`
                    font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200
                    ${isMobile ? 'text-base' : 'text-lg'}
                  `}>
                    {highlightMatch(product.name)}
                  </h3>
                  {product.inStock && (
                    <span className={`
                      ${isMobile ? 'px-2 py-0.5' : 'px-2 py-1'}
                      bg-green-50 text-green-600 text-xs rounded-full font-medium
                    `}>
                      In Stock
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {product.rating && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} fill-current`} />
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                        {product.rating}
                      </span>
                    </div>
                  )}
                  {!isMobile && product.category && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm">{highlightMatch(product.category)}</span>
                    </div>
                  )}
                </div>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">
                    {highlightMatch(product.brand)}
                  </p>
                )}
                {product.price && (
                  <div className={`${isMobile ? 'mt-1' : 'mt-2'} flex items-center gap-2`}>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-indigo-600`}>
                      ${product.price}
                    </p>
                    {product.oldPrice && (
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 line-through`}>
                        ${product.oldPrice}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="bg-indigo-50 rounded-full p-2">
                    <Search className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;