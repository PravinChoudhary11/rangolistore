"use client";

import React from 'react';
import ProductItem from './ProductItem';
import { Sparkles } from 'lucide-react';

export const colorThemes = {
  classicBlueGold: {
    primary: '#0A1828',   // Dark classic blue
    secondary: '#BFA181', // Gold
    accent: '#178582',    // Turquoise
    text: '#FFFFFF'       // White
  },
  darkGreyLime: {
    primary: '#6E6E6E',   // Dim grey
    secondary: '#BAFF39', // Yellow-green
    accent: '#FFFFFF',    // White
    text: '#2D2D2D'       // Dark grey
  },
  boldRedWhite: {
    primary: '#E7473C',   // Bright red
    secondary: '#F0F0F0', // White smoke
    accent: '#1D1D1D',    // Black
    text: '#FFFFFF'       // White
  },
  modernMuted: {
    primary: '#2A3646',       // Medium navy base
    secondary: '#EDF2F7',     // Soft off-white
    accent: '#3B82F6',        // Vibrant blue
    text: '#F8FAFC',          // Lightest white
    gradientStart: '#1E293B',
    gradientEnd: '#334155'
  }
};

function ProductList({ products = [], theme = 'classicBlueGold' }) {
  const colors = colorThemes[theme];

  // Determine a dark color for sparkles based on the theme
  let sparkleColor;
  switch (theme) {
    case 'classicBlueGold':
      sparkleColor = colors.primary; // Dark classic blue
      break;
    case 'darkGreyLime':
      sparkleColor = colors.text;    // Dark grey
      break;
    case 'boldRedWhite':
      sparkleColor = colors.accent;  // Black
      break;
    default:
      sparkleColor = '#1D1D1D';      // Fallback dark color
  }

  return (
    <section className="container mx-auto mt-6 px-2 sm:px-4 md:px-6 lg:px-6 mb-6">
      <div className="flex justify-center mb-12 sm:px-4 relative">
        <h2 className="relative inline-flex flex-col items-center w-full">
          {/* Header Content */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Sparkles 
                style={{ color: sparkleColor }} 
                className="w-5 h-5 animate-pulse" 
              />
              <span
                className="text-xl md:text-3xl font-bold bg-clip-text text-transparent px-8 py-2 drop-shadow-lg"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                }}
              >
                Our Products
              </span>
              <Sparkles 
                style={{ color: sparkleColor }} 
                className="w-5 h-5 animate-pulse" 
              />
            </div>
          </div>
        </h2>
      </div>

      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-transparent rounded-3xl"></div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-5 max-w-full mx-auto">
          {products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <ProductItem key={product.id} product={product} theme={theme} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles style={{ color: sparkleColor }} className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No products available
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Check back later for new products
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductList;