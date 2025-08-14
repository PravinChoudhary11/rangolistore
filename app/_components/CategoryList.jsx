"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/lib/contexts/NavigationLoadingContext';

const colorThemes = {
  classicBlueGold: {
    primary: '#0A1828',       // Dark classic blue
    secondary: '#BFA181',     // Gold
    accent: '#178582',        // Turquoise
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
    primary: '#0369A1',       // Ocean blue
    secondary: '#A5F3FC',     // Light cyan
    accent: '#14B8A6',        // Teal
    text: '#F8FAFC'           // Slate 50
  }
};

function CategoryList({ 
  CategoryList = [], 
  theme = 'classicBlueGold', 
  title = 'Shop By Category',
  includeViewAll = true,
  onCategoryClick = null,
  allCategoriesRoute = '/categories',
  categoryRouteBase = '/category' // Base route for individual categories
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const router = useRouter();
  const { startLoading, router: enhancedRouter } = useNavigationLoading();
  const colors = colorThemes[theme] || colorThemes.classicBlueGold;
  
  // Create a "View All" category object
  const viewAllCategory = {
    name: "View All",
    slug: "all-categories",
    isViewAll: true
  };
  
  // Set max items based on screen size requirement
  const maxItemsLg = 10;
  const maxItemsSm = 9;

  // Determine sparkle color based on theme
  const sparkleColor = theme === 'classicBlueGold' ? colors.primary : 
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
    setCurrentPage(0);
  }, [CategoryList]);

  // Handle clicking on a category with loading
  const handleCategoryClick = (slug, category) => {
    if (category.isViewAll) {
      // Handle "View All" click
      if (onCategoryClick) {
        onCategoryClick(slug, category);
      } else {
        if (filteredCategories.length > maxItemsLg) {
          setShowAllCategories(true);
        } else {
          // Navigate to all categories page with loading
          startLoading('Loading all categories...');
          enhancedRouter.push(allCategoriesRoute);
        }
      }
    } else {
      // Handle regular category click
      if (onCategoryClick) {
        // Use custom handler if provided
        onCategoryClick(slug, category);
      } else {
        // Default behavior: navigate to category page with loading
        startLoading(`Loading ${category.name}...`);
        enhancedRouter.push(`${categoryRouteBase}/${slug}`);
      }
      setShowAllCategories(false);
    }
  };

  // Enhanced pagination with loading
  const handleNextPage = () => {
    const maxPages = Math.ceil(filteredCategories.length / maxItemsLg);
    if (currentPage < maxPages - 1) {
      startLoading('Loading next page...');
      // Add small delay for loading effect
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      startLoading('Loading previous page...');
      // Add small delay for loading effect
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 200);
    }
  };

  // Calculate pagination
  const startIndexLg = currentPage * maxItemsLg;
  const startIndexSm = currentPage * maxItemsSm;
  
  // Get displayed categories - show all or paginated
  let displayedCategoriesLg = showAllCategories 
    ? filteredCategories 
    : filteredCategories.slice(startIndexLg, startIndexLg + maxItemsLg);
    
  let displayedCategoriesSm = showAllCategories 
    ? filteredCategories 
    : filteredCategories.slice(startIndexSm, startIndexSm + maxItemsSm);
  
  // Insert "View All" at appropriate positions
  if (includeViewAll && currentPage === 0 && !showAllCategories && filteredCategories.length > 0) {
    if (displayedCategoriesLg.length >= 10) {
      displayedCategoriesLg = [...displayedCategoriesLg.slice(0, 9), viewAllCategory];
    } else if (filteredCategories.length > maxItemsLg) {
      displayedCategoriesLg = [...displayedCategoriesLg, viewAllCategory];
    }
    
    if (displayedCategoriesSm.length >= maxItemsSm) {
      displayedCategoriesSm = [
        ...displayedCategoriesSm.slice(0, maxItemsSm - 1),
        viewAllCategory
      ];
    } else if (filteredCategories.length > maxItemsSm) {
      displayedCategoriesSm = [...displayedCategoriesSm, viewAllCategory];
    }
  }

  // CSS for animations
  const gridAnimationCSS = `
    @keyframes pulse-square-0 { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes pulse-square-1 { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
    @keyframes pulse-square-2 { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
    @keyframes pulse-square-3 { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
    @keyframes pulse-square-4 { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
    @keyframes pulse-square-5 { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
    @keyframes pulse-square-6 { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
    @keyframes pulse-square-7 { 0%, 100% { opacity: 0.95; } 50% { opacity: 1; } }
    @keyframes pulse-square-8 { 0%, 100% { opacity: 1; } 50% { opacity: 1; } }
    
    .grid-square-0 { animation: pulse-square-0 2s infinite; animation-delay: 0s; }
    .grid-square-1 { animation: pulse-square-1 2s infinite; animation-delay: 0.1s; }
    .grid-square-2 { animation: pulse-square-2 2s infinite; animation-delay: 0.2s; }
    .grid-square-3 { animation: pulse-square-3 2s infinite; animation-delay: 0.3s; }
    .grid-square-4 { animation: pulse-square-4 2s infinite; animation-delay: 0.4s; }
    .grid-square-5 { animation: pulse-square-5 2s infinite; animation-delay: 0.5s; }
    .grid-square-6 { animation: pulse-square-6 2s infinite; animation-delay: 0.6s; }
    .grid-square-7 { animation: pulse-square-7 2s infinite; animation-delay: 0.7s; }
    .grid-square-8 { animation: pulse-square-8 2s infinite; animation-delay: 0.8s; }

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

    /* Loading state for category items */
    .category-item-clicked {
      transform: scale(0.95);
      opacity: 0.7;
      pointer-events: none;
      transition: all 0.3s ease;
    }
  `;

  // Render a category item
  const renderCategoryItem = (category, index, isMobile = false) => {
    const fullUrl = category.icon?.[0]?.url 
      ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${category.icon[0].url}` 
      : null;
    
    const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
    const isViewAllItem = category.isViewAll;
    
    const sizeClasses = isMobile 
      ? "w-[60px] h-[60px] sm:w-[50px] sm:h-[50px] md:w-[80px] md:h-[80px]"
      : "w-[75px] h-[75px] xl:w-[85px] xl:h-[85px]";

    return (
      <div 
        key={isMobile ? `mobile-${index}` : `desktop-${index}`} 
        className="group relative flex flex-col items-center p-2 sm:p-2
          rounded-2xl hover:shadow-lg category-item-loading
          active:scale-95 cursor-pointer
          transition-all duration-300 ease-out
          hover:bg-white/5"
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
      >
        <div className="relative z-10">
          {isViewAllItem ? (
            <div className={`${sizeClasses}
              rounded-full flex items-center justify-center
              transition-transform duration-300 ease-out
              group-hover:scale-[1.1] group-hover:shadow-md`}
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                padding: '12px'
              }}>
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={`grid-item-${i}`}
                    className={`rounded-sm grid-square-${i}`}
                    style={{ backgroundColor: colors.text }}
                  />
                ))}
              </div>
            </div>
          ) : fullUrl ? (
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
          
          <h3 className={`mt-[10px] text-center font-bold
            ${isMobile ? 'text-xs sm:text-sm md:text-base' : 'text-xs lg:text-sm'}
            bg-clip-text text-transparent
            transition-all duration-300
            ${!isMobile ? 'whitespace-nowrap overflow-hidden text-ellipsis px-1' : ''}`}
            style={{ 
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
            }}>
            {category.name}
          </h3>
          
          {!isViewAllItem && category.count !== undefined && (
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
      
      {/* Title section */}
      <div className="flex justify-center mb-8">
        <h2 className="relative inline-flex flex-col items-center">
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
              {title}
            </span>
            <Sparkles 
              style={{ color: sparkleColor }} 
              className="w-5 h-5 animate-pulse" 
            />
          </div>
        </h2>
      </div>

      {/* Show all categories button */}
      {showAllCategories && (
        <div className="w-full flex justify-center mb-4">
          <button
            onClick={() => {
              startLoading('Loading categories...');
              setTimeout(() => setShowAllCategories(false), 200);
            }}
            className="inline-flex items-center px-4 py-2 rounded-md 
              text-sm font-medium transition-all duration-200
              hover:bg-white/10"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
      )}

      {/* Grid layout for small screens */}
      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:hidden 
        gap-3 sm:gap-4 md:gap-6 mx-auto ${showAllCategories ? 'justify-items-center' : ''}`}>
        {displayedCategoriesSm.map((category, index) => 
          renderCategoryItem(category, index, true)
        )}
      </div>

      {/* Grid layout for large screens */}
      <div className={`hidden lg:grid 
        ${showAllCategories ? 'lg:grid-cols-5 xl:grid-cols-6' : 'lg:grid-cols-10'} 
        gap-2 xl:gap-4 w-full px-4`}>
        {displayedCategoriesLg.map((category, index) => 
          renderCategoryItem(category, index, false)
        )}
      </div>

      {/* Pagination controls */}
      {!showAllCategories && filteredCategories.length > maxItemsLg && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-md text-sm font-medium 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95"
            style={{
              backgroundColor: currentPage === 0 ? `${colors.primary}20` : `${colors.primary}`,
              color: currentPage === 0 ? colors.primary : colors.text
            }}
          >
            Previous
          </button>
          
          <span className="text-sm" style={{ color: colors.primary }}>
            Page {currentPage + 1} of {Math.ceil(filteredCategories.length / maxItemsLg)}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(filteredCategories.length / maxItemsLg) - 1}
            className="px-4 py-2 rounded-md text-sm font-medium 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95"
            style={{
              backgroundColor: currentPage >= Math.ceil(filteredCategories.length / maxItemsLg) - 1 
                ? `${colors.primary}20` : `${colors.primary}`,
              color: currentPage >= Math.ceil(filteredCategories.length / maxItemsLg) - 1 
                ? colors.primary : colors.text
            }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default CategoryList;