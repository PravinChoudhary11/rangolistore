"use client";
import React from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import SearchBar from './SearchBar';

// Match your website's exact theme colors
const rangoliTheme = {
  primary: "#173961",      // Your deep blue
  secondary: "#1e4b87",    // Medium blue
  accent: "#0f2d4e",       // Darker navy
  light: "#64b5f6",        // Light blue
  text: "#ffffff"          // White text
};

const MobileSearchSection = () => {
  const handleSearchResultClick = (product) => {
    
    
    // Handle search result click if needed
  };

  return (
    <div className="md:hidden w-full px-4 py-6 relative overflow-hidden" 
         style={{
           background: `linear-gradient(135deg, ${rangoliTheme.primary}15 0%, ${rangoliTheme.secondary}10 50%, ${rangoliTheme.accent}08 100%)`
         }}>
      
      {/* Background decorations matching your theme */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-8 -translate-y-8"
           style={{ 
             background: `linear-gradient(135deg, ${rangoliTheme.primary}20, transparent)` 
           }}></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full translate-x-12 translate-y-12"
           style={{ 
             background: `linear-gradient(135deg, ${rangoliTheme.secondary}15, transparent)` 
           }}></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse"
           style={{ 
             background: `linear-gradient(135deg, ${rangoliTheme.light}20, ${rangoliTheme.primary}10)` 
           }}></div>

      <div className="relative z-10">
        {/* Header with your brand colors */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-2xl shadow-lg"
                   style={{
                     background: `linear-gradient(135deg, ${rangoliTheme.primary} 0%, ${rangoliTheme.secondary} 100%)`
                   }}>
                <Search className="h-6 w-6" style={{ color: rangoliTheme.text }} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight"
                  style={{ color: rangoliTheme.primary }}>
                Find Your Perfect Product
              </h2>
              <p className="text-sm font-medium flex items-center gap-1 justify-center mt-1"
                 style={{ color: rangoliTheme.secondary }}>
                <TrendingUp className="h-4 w-4" style={{ color: rangoliTheme.light }} />
                Search from thousands of items
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced search container with your theme */}
        <div className="relative">
          {/* Glowing border effect with your colors */}
          <div className="absolute inset-0 rounded-2xl blur-sm opacity-20 animate-pulse"
               style={{
                 background: `linear-gradient(135deg, ${rangoliTheme.primary} 0%, ${rangoliTheme.secondary} 50%, ${rangoliTheme.light} 100%)`
               }}></div>
          
          {/* Search bar container with your brand styling */}
          <div className="relative bg-white rounded-2xl p-1 shadow-2xl backdrop-blur-sm"
               style={{
                 border: `2px solid ${rangoliTheme.primary}20`
               }}>
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl"
                 style={{
                   border: `1px solid ${rangoliTheme.primary}10`
                 }}>
              <SearchBar onResultClick={handleSearchResultClick} />
            </div>
          </div>
        </div>

        {/* Quick stats with your brand colors */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium" style={{ color: rangoliTheme.secondary }}>
                <span className="font-bold" style={{ color: rangoliTheme.primary }}>1000+</span> Products
              </span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: `${rangoliTheme.primary}30` }}></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse"
                   style={{ backgroundColor: rangoliTheme.light }}></div>
              <span className="font-medium" style={{ color: rangoliTheme.secondary }}>
                <span className="font-bold" style={{ color: rangoliTheme.primary }}>50+</span> Categories
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchSection;