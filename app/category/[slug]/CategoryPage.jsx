// app/category/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, ShoppingBag, Heart, Star, Filter, Grid, List, ShoppingCart, Sparkles, ChevronDown } from 'lucide-react';
import React from 'react';
import { FiEye } from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

const colorThemes = {
  modernMuted: {
    primary: '#2A3646',
    secondary: '#EDF2F7',
    accent: '#3B82F6',
    text: '#F8FAFC',
    gradientStart: '#1E293B',
    gradientEnd: '#334155',
  },
  classicBlueGold: {
    primary: '#0A1828',   // Dark classic blue
    secondary: '#BFA181', // Gold
    accent: '#178582',    // Turquoise
    text: '#FFFFFF'       // White
  }
};

export default function CategoryPage(theme = 'classicBlueGold') {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState({
    inStock: false,
    priceRange: { min: 0, max: 10000 }
  });
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const categorySlug = params.slug;
  const colors = colorThemes.modernMuted;

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If the URL already starts with http/https, use it as is (Cloudinary URLs)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the backend base URL for local uploads
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:1337';
    return `${baseUrl}${imageUrl}`;
  };

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) setViewMode('grid');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch category and products
  useEffect(() => {
    if (!categorySlug) return;

    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category details
        const categoryResponse = await fetch(
          `${API_BASE_URL}/api/categories?populate=*&filters[slug][$eq]=${categorySlug}`
        );
        
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category');
        }
        
        const categoryData = await categoryResponse.json();
        
        if (categoryData.data.length === 0) {
          throw new Error('Category not found');
        }

        const categoryInfo = {
          id: categoryData.data[0].id,
          name: categoryData.data[0].name,
          slug: categoryData.data[0].slug,
          description: categoryData.data[0].description,
          color: categoryData.data[0].color
        };

        setCategory(categoryInfo);

        // Fetch products for this category
        const productsResponse = await fetch(
          `${API_BASE_URL}/api/products?populate=*&filters[categories][slug][$eq]=${categorySlug}`
        );
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productsData = await productsResponse.json();
        
        // Transform products data
        const transformedProducts = productsData.data.map(product => {
          const reviews = product.reviews || [];
          const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
            : 0;

          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.sellingPrice) || 0,
            originalPrice: parseFloat(product.MRP) || 0,
            description: product.description,
            images: product.images || [],
            rating: averageRating,
            reviewCount: reviews.length,
            inStock: true,
            quantity: product.itemQuantityType,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            MRP: parseFloat(product.MRP) || 0,
            sellingPrice: parseFloat(product.sellingPrice) || null
          };
        });
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categorySlug]);
  
  // Determine sparkle color
  const sparkleColor = colors.primary;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  // Filter products
  const filteredProducts = sortedProducts.filter(product => {
    if (filterBy.inStock && !product.inStock) return false;
    if (product.price && (product.price < filterBy.priceRange.min || product.price > filterBy.priceRange.max)) {
      return false;
    }
    return true;
  });

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle product click
  const handleProductClick = (productSlug) => {
    router.push(`/product/${productSlug}`);
  };

  // Handle like toggle
  const handleLikeToggle = (productId) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product.name);
  };

  // Truncate text utility
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Render modern product card
  const renderProductCard = (product, isListView = false) => {
    // Use the helper function to get the correct image URL
    const imageUrl = product.images?.[0]?.url ? getImageUrl(product.images[0].url) : null;
    const isLiked = likedProducts.has(product.id);
    
    const discountPercentage = product.sellingPrice && product.MRP > product.sellingPrice
      ? Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100)
      : 0;

    if (isListView && !isMobile) {
      return (
        <div 
          key={product.id} 
          className="group relative p-4 flex bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${colors.gradientStart}, ${colors.gradientEnd})`,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          onClick={() => handleProductClick(product.slug)}
        >
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeToggle(product.id);
            }}
            className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
              isLiked
                ? 'text-red-400 bg-gray-700/40 hover:bg-red-400/20'
                : 'text-gray-200 bg-gray-700/40 hover:text-red-400'
            }`}
          >
            <Heart
              fill={isLiked ? 'currentColor' : 'none'}
              size={18}
              className="w-5 h-5"
            />
          </button>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div
              className="absolute top-3 left-3 z-20 flex items-center gap-1 px-3 py-1 rounded-full shadow-lg text-xs font-bold"
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

          <div className="w-32 h-32 flex-shrink-0 bg-slate-100 rounded-xl p-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                  e.target.nextSibling?.style.setProperty('display', 'flex');
                }}
              />
            ) : null}
            {(!imageUrl || imageUrl === null) && (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.secondary }}>
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-slate-300 text-sm mb-3 hidden sm:block">
                    <span className="block max-h-10 overflow-hidden">
                      {truncateText(product.description, 120)}
                    </span>
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  {product.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-slate-300">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({product.reviewCount})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {product.sellingPrice && (
                      <span
                        className="font-bold text-lg"
                        style={{ color: colors.accent }}
                      >
                        ₹{product.sellingPrice}
                      </span>
                    )}
                    <span className={`text-sm text-slate-400 ${product.sellingPrice ? 'line-through' : ''}`}>
                      ₹{product.MRP}
                    </span>
                  </div>
                </div>
                
                {!product.inStock && (
                  <p className="text-red-400 text-sm">Out of Stock</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                <button 
                  className="px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: product.inStock ? `linear-gradient(to right, ${colors.accent}, #2563EB)` : '#6B7280',
                    color: colors.secondary
                  }}
                  disabled={!product.inStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart size={16} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view (mobile-friendly)
    return (
      <div
        key={product.id}
        className="group relative p-3 flex flex-col gap-2 w-full rounded-2xl transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        style={{
          background: `linear-gradient(to bottom, ${colors.gradientStart}, ${colors.gradientEnd})`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={() => handleProductClick(product.slug)}
      >
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLikeToggle(product.id);
          }}
          className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
            isLiked
              ? 'text-red-400 bg-gray-700/40 hover:bg-red-400/20'
              : 'text-gray-200 bg-gray-700/40 hover:text-red-400'
          } group-hover:shadow-md`}
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

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-2xl">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Product Image */}
        <div
          className="relative mx-auto p-3 rounded-2xl mt-2 bg-slate-100"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-[110px] w-[110px] sm:h-[140px] sm:w-[140px] object-contain transition-all duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                e.target.style.display = 'none';
                e.target.nextSibling?.style.setProperty('display', 'flex');
              }}
            />
          ) : null}
          {(!imageUrl || imageUrl === null) && (
            <div className="h-[110px] w-[110px] sm:h-[140px] sm:w-[140px] flex items-center justify-center rounded-xl text-slate-700">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-1 z-10 p-3 text-center">
          <h2
            className="font-semibold text-base line-clamp-2 min-h-[2rem]"
            style={{
              color: colors.secondary,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            {product.name}
          </h2>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center justify-center space-x-1 my-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-slate-300">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({product.reviewCount})</span>
            </div>
          )}

          {/* Price Display */}
          <div className="flex justify-center items-baseline gap-2 mb-3">
            {product.sellingPrice && (
              <span
                className="font-bold text-base sm:text-lg"
                style={{
                  color: colors.accent,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                ₹{product.sellingPrice}
              </span>
            )}
            <span
              className={`font-medium text-sm ${
                product.sellingPrice ? 'line-through' : ''
              } text-slate-400`}
            >
              ₹{product.MRP}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            className="mt-auto w-full gap-2 text-xs font-semibold group-hover:shadow-md py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: product.inStock ? `linear-gradient(to right, ${colors.accent}, #2563EB)` : '#6B7280',
              color: colors.secondary,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick(product.slug);
            }}
          >
            <FiEye size={16} />
            {product.inStock ? 'View Product' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <ArrowLeft className="w-5 h-5 inline-block mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
          <div className="w-full sm:w-auto flex justify-between items-center mb-4 sm:mb-0">
           
            
            {/* Mobile View Toggle */}
            {!isMobile && (
              <div className="flex sm:hidden bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4 relative z-10" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4 relative z-10" />
                </button>
              </div>
            )}
          </div>
          
          <div className="text-center flex-1 px-2 sm:px-4 w-full">
            <div className="flex justify-center relative">
                <h2 className="relative inline-flex flex-col items-center w-full">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                    <Sparkles 
                        style={{ color: sparkleColor }} 
                        className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" 
                    />
                    <span
                        className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent px-4 sm:px-8 py-1 sm:py-2 drop-shadow-lg"
                        style={{ 
                        backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                        }}
                    >
                        Our Products
                    </span>
                    <Sparkles 
                        style={{ color: sparkleColor }} 
                        className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" 
                    />
                    </div>
                </div>
                </h2>
            </div>
            {category?.description && (
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
                {category.description}
              </p>
            )}
          </div>

          <div className="hidden sm:block w-20"></div>
        </div>

        {/* Enhanced Controls - Mobile responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md cursor-pointer"
                style={{
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-md"
                style={{
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <Filter className="w-4 h-4 mr-2" />
                <span className="relative z-10">Filter</span>
                {filterBy.inStock && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
              
              {/* Filter Menu - Responsive positioning */}
              {showFilterMenu && (
                <div className={`absolute ${
                  isMobile ? 'left-1/2 transform -translate-x-1/2 w-[calc(100vw-2rem)]' : 'left-0 w-64'
                } top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden`}>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Filter Options</h3>
                    
                    {/* In Stock Filter */}
                    <label className="flex items-center cursor-pointer group mb-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filterBy.inStock}
                          onChange={(e) => setFilterBy(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                          filterBy.inStock 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300 group-hover:border-blue-400'
                        }`}>
                          {filterBy.inStock && (
                            <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        Show only in stock items
                      </span>
                    </label>
                    
                    <button
                      onClick={() => setShowFilterMenu(false)}
                      className="w-full mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Toggle and Results Count - Desktop only */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4 relative z-10" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4 relative z-10" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Results Count */}
        {isMobile && (
          <div className="text-center mb-4">
            <div className="inline-block bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {products.length === 0 
                ? 'This category doesn\'t have any products yet. Check back later!' 
                : 'Try adjusting your filters or search criteria to see more products.'}
            </p>
            {filterBy.inStock && (
              <button
                onClick={() => setFilterBy(prev => ({ ...prev, inStock: false }))}
                className="group relative inline-flex items-center px-5 py-2.5 rounded-xl font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-300"
              >
                <span className="relative z-10">Show all products</span>
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' || isMobile
              ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'space-y-4 sm:space-y-6'
          }>
            {filteredProducts.map(product => 
              renderProductCard(product, viewMode === 'list' && !isMobile)
            )}
          </div>
        )}
      </div>
    </div>
  );
}