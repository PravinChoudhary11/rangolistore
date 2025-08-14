"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNavigationLoading } from '@/lib/contexts/NavigationLoadingContext';

const colorThemes = {
  modernMuted: {
    primary: '#2A3646',
    secondary: '#EDF2F7',
    accent: '#3B82F6',
    text: '#F8FAFC',
    gradientStart: '#1E293B',
    gradientEnd: '#334155',
  },
};

function ProductItem({ product = {}, theme = 'modernMuted' }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { startLoading, router: enhancedRouter } = useNavigationLoading();
  const colors = colorThemes[theme] || colorThemes.modernMuted;

  const {
    id,
    slug = '',
    name = 'Unnamed Product',
    images = [],
    MRP = 0,
    sellingPrice = null,
    price = null,
  } = product;

  // Use sellingPrice if available, otherwise use price, otherwise use MRP
  const displayPrice = sellingPrice || price || MRP;
  const originalPrice = MRP;

  const discountPercentage =
    displayPrice && originalPrice > displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

  const handleProductClick = () => {
    if (!slug) {
      console.error("Product slug is missing:", product);
      return;
    }
    
    // Set local loading state for immediate visual feedback
    setIsNavigating(true);
    
    // Start navigation loading with product name
    const productName = name.length > 30 
      ? `${name.substring(0, 30)}...` 
      : name;
    startLoading(`Loading ${productName}`);
    
    // Navigate using enhanced router
    enhancedRouter.push(`/product/${slug}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Add API call to save liked status
  };

  // Don't render if essential product data is missing
  if (!id || !name) {
    console.warn('ProductItem: Missing essential product data', product);
    return null;
  }

  return (
    <div
      className={`group relative p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 w-full rounded-2xl transition-all duration-300 ease-out cursor-pointer ${
        isNavigating 
          ? 'scale-95 opacity-70 pointer-events-none' 
          : 'hover:shadow-xl hover:-translate-y-1'
      }`}
      style={{
        background: `linear-gradient(to bottom, ${colors.gradientStart}, ${colors.gradientEnd})`,
        boxShadow: isNavigating 
          ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
      onClick={handleProductClick}
    >
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-lg shadow-lg">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        disabled={isNavigating}
        className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
          isLiked
            ? 'text-red-400 bg-gray-700/40 hover:bg-red-400/20'
            : 'text-gray-200 bg-gray-700/40 hover:text-red-400'
        } group-hover:shadow-md ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          fill={isLiked ? 'currentColor' : 'none'}
          size={16}
          className="w-4 h-4"
        />
      </button>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div
          className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg text-xs font-bold"
          style={{
            background: `linear-gradient(to right, ${colors.accent}, #2563EB)`,
            color: colors.secondary,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Sparkles size={12} />
          {discountPercentage}% OFF
        </div>
      )}

      {/* Product Image */}
      <div
        className="relative mx-auto p-3 rounded-2xl mt-2 bg-slate-100"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        {images && images.length > 0 && images[0]?.url ? (
          <img
            src={`${baseUrl}${images[0].url}`}
            alt={name}
            className={`h-[110px] w-[110px] sm:h-[140px] sm:w-[140px] object-contain transition-all duration-300 ${
              isNavigating ? '' : 'group-hover:scale-110'
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback for missing/broken images */}
        <div 
          className="h-[110px] w-[110px] sm:h-[140px] sm:w-[140px] flex items-center justify-center rounded-xl text-slate-700 bg-slate-200"
          style={{ display: images && images.length > 0 && images[0]?.url ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <ShoppingCart size={32} className="mx-auto mb-2 text-slate-400" />
            <span className="text-xs">No Image</span>
          </div>
        </div>

        {/* Product Image Loading Shimmer Effect */}
        {isNavigating && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] skew-x-12" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-1 z-10 p-3 text-center">
        <h2
          className={`font-semibold text-md sm:text-base lg:text-lg line-clamp-2 min-h-[2rem] transition-opacity duration-300 ${
            isNavigating ? 'opacity-70' : ''
          }`}
          style={{
            color: colors.secondary,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
          title={name}
        >
          {name}
        </h2>

        {/* Price Display */}
        <div className={`flex justify-center items-baseline gap-2 mb-2 transition-opacity duration-300 ${
          isNavigating ? 'opacity-70' : ''
        }`}>
          {displayPrice > 0 && (
            <span
              className="font-bold text-lg"
              style={{
                color: colors.accent,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              ₹{displayPrice.toLocaleString()}
            </span>
          )}
          {discountPercentage > 0 && originalPrice > 0 && (
            <span className="font-medium text-sm line-through text-slate-400">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* View Product Button */}
        <Button
          onClick={handleProductClick}
          className={`w-full transition-opacity duration-300 ${
            isNavigating ? 'opacity-50 pointer-events-none' : ''
          }`}
          style={{
            background: `linear-gradient(to right, ${colors.accent}, #2563EB)`,
            color: colors.secondary,
          }}
          disabled={isNavigating}
        >
          View Product
        </Button>
      </div>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
}

export default ProductItem;