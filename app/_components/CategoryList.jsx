// CategoryList.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, ChevronLeft, Grid3X3, MoreHorizontal, X, ChevronUp, TrendingUp, Package, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/lib/contexts/NavigationLoadingContext';

// Match your website's exact theme colors
const rangoliTheme = {
  primary: "#173961",      // Your deep blue
  secondary: "#1e4b87",    // Medium blue
  accent: "#0f2d4e",       // Darker navy
  light: "#64b5f6",        // Light blue
  text: "#ffffff"          // White text
};

const colorThemes = {
  classicBlueGold: {
    primary: '#173961',       // Your deep blue
    secondary: '#1e4b87',     // Medium blue
    accent: '#64b5f6',        // Light blue
    text: '#FFFFFF'           // White
  },
  darkGreyLime: {
    primary: '#6E6E6E',       // Dim grey
    secondary: '#BAFF39',     // Yellow-green
    accent: '#FFFFFF',        // White
    text: '#2D2D2D'           // Dark grey
  },
  boldRedWhite: {
    primary: '#E7473C',       // Bright red
    secondary: '#F0F0F0',     // White smoke
    accent: '#1D1D1D',        // Black
    text: '#FFFFFF'           // White
  },
  purpleGreen: {
    primary: '#5B21B6',       // Deep purple
    secondary: '#10B981',     // Emerald green
    accent: '#F59E0B',        // Amber
    text: '#FFFFFF'           // White
  },
  oceanBreeze: {
    primary: '#173961',       // Your deep blue
    secondary: '#64b5f6',     // Light blue
    accent: '#1e4b87',        // Medium blue
    text: '#F8FAFC'           // Slate 50
  }
};

function CategoryList({ 
  CategoryList = [], 
  theme = 'classicBlueGold', 
  title = 'Shop By Category',
  includeViewAll = true,
  onCategoryClick = null,
  allCategoriesRoute = '/category',
  categoryRouteBase = '/category' // Base route for individual categories
}) {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // New state for expansion
  
  const router = useRouter();
  const { startLoading, router: enhancedRouter } = useNavigationLoading();
  const colors = colorThemes[theme] || rangoliTheme;
  
  // Set max items - show 8 categories + 1 "View All"/"Close" button
  const maxCategoriesToShow = 8;

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If the URL already starts with http/https, use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the backend base URL
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
    return `${baseUrl}${imageUrl}`;
  };

  // Determine sparkle color based on theme
  const sparkleColor = theme === 'classicBlueGold' ? colors.light : 
                       theme === 'darkGreyLime' ? colors.text : 
                       colors.accent;

  // Filter categories to only include those with valid slugs
  useEffect(() => {
    const validCategories = CategoryList.filter(category => 
      category.slug !== null && 
      category.slug !== undefined && 
      category.slug !== ''
    );
    setFilteredCategories(validCategories);
  }, [CategoryList]);

  // Handle clicking on a category with loading
  const handleCategoryClick = (slug, category) => {
    if (category.isToggle) {
      // Handle "View All"/"Close" toggle
      setIsExpanded(!isExpanded);
    } else {
      // Handle regular category click
      if (onCategoryClick) {
        onCategoryClick(slug, category);
      } else {
        startLoading(`Loading ${category.name}...`);
        enhancedRouter.push(`${categoryRouteBase}/${slug}`);
      }
    }
  };

  // Get categories to display based on expansion state
  const categoriesToShow = isExpanded 
    ? filteredCategories 
    : filteredCategories.slice(0, maxCategoriesToShow);
  
  // Create toggle button (View All / Close)
  const toggleCategory = {
    id: isExpanded ? 'close-categories' : 'view-all',
    name: isExpanded ? "Show Less" : "View All",
    slug: isExpanded ? "close-categories" : "all-categories",
    isToggle: true,
    isExpanded: isExpanded
  };

  // Final display list
  const displayCategories = includeViewAll && filteredCategories.length > maxCategoriesToShow
    ? [...categoriesToShow, toggleCategory]
    : categoriesToShow;

  // CSS for animations
  const gridAnimationCSS = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.1); }
      50% { box-shadow: 0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1); }
    }
    
    @keyframes rotate-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.9); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0px) scale(1); 
      }
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .view-all-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .close-bounce {
      animation: float 2s ease-in-out infinite;
    }
    
    .view-all-shimmer {
      position: relative;
      overflow: hidden;
    }
    
    .view-all-shimmer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      background-size: 200px 100%;
      animation: shimmer 2s infinite;
    }
    
    .view-all-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .rotate-slow {
      animation: rotate-slow 8s linear infinite;
    }

    .category-item-loading {
      position: relative;
      overflow: hidden;
    }
    
    .category-item-loading::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    .category-item-loading:hover::before {
      left: 100%;
    }

    .category-item-clicked {
      transform: scale(0.95);
      opacity: 0.7;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .category-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }

    .expanded-grid {
      animation: slideIn 0.5s ease-out;
    }
  `;

  // Render the toggle button (View All / Close)
  const renderToggleButton = (isMobile = false) => {
    const sizeClasses = isMobile 
      ? "w-[60px] h-[60px] sm:w-[50px] sm:h-[50px] md:w-[80px] md:h-[80px]"
      : "w-[75px] h-[75px] xl:w-[85px] xl:h-[85px]";

    const isClosing = isExpanded;

    return (
      <div 
        className={`group relative flex flex-col items-center p-2 sm:p-2
          rounded-2xl hover:shadow-lg category-item-loading 
          ${isClosing ? 'close-bounce' : 'view-all-float'}
          active:scale-95 cursor-pointer
          transition-all duration-300 ease-out
          hover:bg-white/5`}
        onClick={() => handleCategoryClick(toggleCategory.slug, toggleCategory)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategoryClick(toggleCategory.slug, toggleCategory);
          }
        }}
        aria-label={isClosing ? "Show fewer categories" : "View all categories"}
      >
        <div className="relative z-10">
          <div className={`${sizeClasses}
            rounded-full flex items-center justify-center
            transition-all duration-300 ease-out
            group-hover:scale-[1.1] group-hover:shadow-lg
            view-all-shimmer view-all-glow relative`}
            style={{ 
              background: isClosing 
                ? `linear-gradient(135deg, #dc2626, #ef4444, #f87171)` // Red gradient for close
                : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite'
            }}>
            
            {/* Rotating outer ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed 
              ${isClosing ? 'rotate-slow' : 'rotate-slow'}`}
              style={{ borderColor: `${colors.text}40` }}>
            </div>
            
            {/* Inner content */}
            <div className="relative z-10 flex items-center justify-center">
              {isClosing ? (
                // Close icon
                <div className="relative">
                  <X 
                    className="w-6 h-6 xl:w-7 xl:h-7 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90"
                    style={{ color: colors.text }}
                  />
                  {/* Floating dots for close state */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white opacity-80">
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-white opacity-60">
                  </div>
                </div>
              ) : (
                // View All icon
                <div className="relative">
                  <Grid3X3 
                    className="w-6 h-6 xl:w-7 xl:h-7 transition-all duration-300 group-hover:scale-110"
                    style={{ color: colors.text }}
                  />
                  {/* Floating dots */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.secondary }}>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.accent }}>
                  </div>
                  {/* Plus symbol overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-0.5 rounded-full absolute"
                      style={{ backgroundColor: colors.text, opacity: 0.8 }}>
                    </div>
                    <div className="h-3 w-0.5 rounded-full absolute"
                      style={{ backgroundColor: colors.text, opacity: 0.8 }}>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 
              transition-opacity duration-300"
              style={{ 
                background: `radial-gradient(circle, ${colors.text}, transparent)`
              }}>
            </div>
          </div>
          
          <h3 className={`mt-[10px] text-center font-bold
            ${isMobile ? 'text-xs sm:text-sm md:text-base' : 'text-xs lg:text-sm'}
            bg-clip-text text-transparent
            transition-all duration-300`}
            style={{ 
              backgroundImage: isClosing 
                ? 'linear-gradient(45deg, #dc2626, #ef4444, #f87171)'
                : `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
            }}>
            {toggleCategory.name}
          </h3>
          
          {!isClosing && filteredCategories.length > maxCategoriesToShow && (
            <span className="mt-1 text-xs opacity-70"
              style={{ color: colors.primary }}>
              +{filteredCategories.length - maxCategoriesToShow} more
            </span>
          )}
          
          {isClosing && (
            <span className="mt-1 text-xs opacity-70 text-red-600">
              Showing all {filteredCategories.length}
            </span>
          )}
        </div>

        {/* Enhanced hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl 
          pointer-events-none" />
      </div>
    );
  };

  // Helper function to get unique key for category
  const getCategoryKey = (category, index, prefix = '') => {
    if (category.isToggle) {
      return `${prefix}toggle-${category.isExpanded ? 'close' : 'view-all'}`;
    }
    // Use id if available, otherwise use slug, otherwise fall back to index
    return `${prefix}${category.id || category.slug || `category-${index}`}`;
  };

  // Render a regular category item
  const renderCategoryItem = (category, index, isMobile = false) => {
    const fullUrl = category.icon?.[0]?.url 
      ? getImageUrl(category.icon[0].url)
      : null;
    
    const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
    const isToggleItem = category.isToggle;
    
    const sizeClasses = isMobile 
      ? "w-[60px] h-[60px] sm:w-[50px] sm:h-[50px] md:w-[80px] md:h-[80px]"
      : "w-[75px] h-[75px] xl:w-[85px] xl:h-[85px]";

    if (isToggleItem) {
      return renderToggleButton(isMobile);
    }

    // Add slide-in animation for newly visible categories
    const isNewlyVisible = isExpanded && index >= maxCategoriesToShow;

    return (
      <div 
        className={`group relative flex flex-col items-center p-2 sm:p-2
          rounded-2xl hover:shadow-lg category-item-loading
          active:scale-95 cursor-pointer
          transition-all duration-300 ease-out
          hover:bg-white/5
          ${isNewlyVisible ? 'category-slide-in' : ''}`}
        onClick={() => handleCategoryClick(categorySlug, category)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategoryClick(categorySlug, category);
          }
        }}
        aria-label={`Navigate to ${category.name} category`}
        style={{
          animationDelay: isNewlyVisible ? `${(index - maxCategoriesToShow) * 0.1}s` : '0s'
        }}
      >
        <div className="relative z-10 w-full flex flex-col items-center">
          {fullUrl ? (
            <div className={`relative ${sizeClasses}
              rounded-full p-[5px] overflow-hidden
              transition-transform duration-300 ease-out
              group-hover:scale-[1.1] group-hover:shadow-md`}
              style={{ 
                background: `linear-gradient(to bottom right, ${colors.primary}88, ${colors.accent}88)`,
                border: `1px solid ${colors.text}10`
              }}>
              <img
                src={fullUrl}
                alt={category.name || 'Category Icon'}
                className="w-full h-full object-contain
                  transition-transform duration-300
                  group-hover:scale-[1.1]"
                style={{ filter: 'brightness(0.95) contrast(1.1)' }}
                loading="lazy"
              />
            </div>
          ) : (
            <div className={`${sizeClasses}
              rounded-full p-[5px]
              transition-transform duration-300 ease-out
              group-hover:scale-[1.1] group-hover:shadow-md`}
              style={{ 
                background: `linear-gradient(to bottom right, ${colors.primary}88, ${colors.accent}88)`,
                border: `1px solid ${colors.text}10`
              }}>
              <BookOpen 
                className="w-full h-full transition-colors duration-300"
                style={{ color: colors.text, opacity: 0.8 }}
              />
            </div>
          )}
          
          <h3 className={`mt-[10px] text-center font-bold w-full
            ${isMobile ? 'text-xs sm:text-sm md:text-base' : 'text-xs lg:text-sm'}
            bg-clip-text text-transparent
            transition-all duration-300
            ${!isMobile ? 'whitespace-nowrap overflow-hidden text-ellipsis px-1' : ''}`}
            style={{ 
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
            }}>
            {category.name}
          </h3>
          
          {category.count !== undefined && (
            <span className="mt-1 text-xs text-gray-500">
              ({category.count} {category.count === 1 ? 'item' : 'items'})
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    );
  };

  // Don't render if no valid categories
  if (filteredCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <style dangerouslySetInnerHTML={{ __html: gridAnimationCSS }} />
      
      {/* Enhanced Title section with mobile search header style */}
      <div className="w-full px-4 py-8 mb-4 relative overflow-hidden" 
           style={{
             background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}10 50%, ${colors.accent}08 100%)`
           }}>
        
        {/* Background decorations matching the theme */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-8 -translate-y-8"
             style={{ 
               background: `linear-gradient(135deg, ${colors.primary}20, transparent)` 
             }}></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full translate-x-12 translate-y-12"
             style={{ 
               background: `linear-gradient(135deg, ${colors.secondary}15, transparent)` 
             }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse"
             style={{ 
               background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)` 
             }}></div>

        <div className="relative z-10">
          {/* Header with enhanced styling */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-2xl shadow-lg"
                     style={{
                       background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                     }}>
                  <Layers className="h-6 w-6" style={{ color: colors.text }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Package className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight"
                    style={{ color: colors.primary }}>
                  {title}
                </h2>
                <p className="text-sm font-medium flex items-center gap-1 justify-center mt-1"
                   style={{ color: colors.secondary }}>
                  <Package className="h-4 w-4 animate-pulse" style={{ color: colors.light }} />
                  Discover amazing categories
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium" style={{ color: colors.secondary }}>
                  <span className="font-bold" style={{ color: colors.primary }}>{filteredCategories.length}+</span> Categories
                </span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: `${colors.primary}30` }}></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse"
                     style={{ backgroundColor: colors.light }}></div>
                <span className="font-medium" style={{ color: colors.secondary }}>
                  <span className="font-bold" style={{ color: colors.primary }}>Easy</span> Navigation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid layout for small screens */}
      <div className={`grid lg:hidden gap-3 sm:gap-4 md:gap-6 mx-auto justify-items-center expanded-grid`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))`,
          justifyItems: 'center'
        }}>
        {displayCategories.map((category, index) => (
          <div key={getCategoryKey(category, index, 'mobile-')} className="flex justify-center w-full">
            {renderCategoryItem(category, index, true)}
          </div>
        ))}
      </div>

      {/* Grid layout for large screens */}
      <div className={`hidden lg:grid gap-2 xl:gap-4 w-full px-4 expanded-grid`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))`,
          justifyItems: 'center'
        }}>
        {displayCategories.map((category, index) => (
          <div key={getCategoryKey(category, index, 'desktop-')} className="flex justify-center w-full">
            {renderCategoryItem(category, index, false)}
          </div>
        ))}
      </div>

      {/* Expansion indicator */}
      {isExpanded && (
        <div className="flex justify-center mt-6">
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            Showing all {filteredCategories.length} categories
          </div>
        </div>
      )}
    </section>
  );
}

export default CategoryList;