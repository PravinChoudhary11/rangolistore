// Updated PageDetails.jsx - Add loading management
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiShoppingCart,
  FiZap,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiStar,
  FiUser,
  FiCheck
} from 'react-icons/fi';
import ReviewSection from './ReviewSection';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useNavigationLoading } from '@/lib/contexts/NavigationLoadingContext';
import AddToCartPopup from '@/app/_components/AddToCartPopUp';
import LoginPopup from '@/app/login/LoginPopup';

const PageDetails = ({ product }) => {
  const [reviewsCount, setReviewsCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartStatus, setAddToCartStatus] = useState(null); // null, 'success', 'error'
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addToCart: addToCartContext, cartItemsCount } = useCart();
  const { stopLoading } = useNavigationLoading();

  // Stop loading when component mounts and is ready
  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        stopLoading();
      }, 200); // Small delay for smooth transition

      return () => clearTimeout(timer);
    }
  }, [product, stopLoading]);

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    
    // If the URL already starts with http/https, use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the backend base URL
    return `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}`;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FiShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <FiArrowLeft /> Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    MRP: mrp,
    sellingPrice,
    categories = [],
    images = [],
    slug
  } = product;

  const category = categories[0]?.name;
  const discount = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const savings = mrp && sellingPrice ? mrp - sellingPrice : 0;

  // Ensure we have at least 4 images
  const allImages = images.length > 0
    ? [...images, ...images.slice(0, Math.max(0, 4 - images.length))].slice(0, 5)
    : Array(5).fill({ url: '/placeholder-image.jpg' });

  const handlePrev = () => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handleThumbClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    // Refresh the page to update auth state
    window.location.reload();
  };

  const handleAddToCart = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    setIsAddingToCart(true);
    setAddToCartStatus(null);

    try {
      // Use the context method for consistent state management
      const result = await addToCartContext(slug, quantity);

      if (result.success) {
        setAddToCartStatus('success');
        setShowAddToCartPopup(true);
        
        // Reset status after popup closes
        setTimeout(() => setAddToCartStatus(null), 3000);
      } else {
        setAddToCartStatus('error');
        console.error('Failed to add to cart:', result.error);
      }
    } catch (error) {
      setAddToCartStatus('error');
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCartContext(slug, quantity);

      if (result.success) {
        // Redirect to cart page
        window.location.href = '/cart';
      } else {
        console.error('Failed to add to cart:', result.error);
        setAddToCartStatus('error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddToCartStatus('error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Get product image for popup using the helper function
  const productImage = images?.[0]?.url ? getImageUrl(images[0].url) : null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Breadcrumb content */}
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl group">
              <Image
                src={getImageUrl(allImages[currentImageIndex].url)}
                alt={`${name} - Main view`}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onClick={() => setShowImageModal(true)}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg animate-pulse">
                    {discount}% OFF
                  </div>
                )}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-1 px-3 rounded-full text-xs shadow-lg">
                  FREE DELIVERY
                </div>
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                    isWishlisted
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <FiChevronRight className="text-xl" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Enhanced Thumbnail Slider */}
            <div className="flex justify-center gap-3 py-2">
              {allImages.slice(0, 5).map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbClick(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'border-blue-500 scale-105 shadow-lg'
                      : 'border-transparent hover:border-gray-300 hover:scale-102'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={getImageUrl(img.url)}
                    alt={`${name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Product Details */}
          <div className="py-2">
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-4">
              {category && (
                <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {category}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewsCount} review{reviewsCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{name}</h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {description}
            </p>

            {/* Enhanced Pricing */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{sellingPrice?.toLocaleString()}
                </span>

                {mrp && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{mrp.toLocaleString()}
                  </span>
                )}

                {discount > 0 && (
                  <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                    Save {discount}% (₹{savings.toLocaleString()})
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {addToCartStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                Failed to add item to cart. Please try again.
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={isAddingToCart}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiZap className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border">
                <FiShield className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-500">100% Protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border">
                <FiTruck className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">Free Delivery</div>
                  <div className="text-xs text-gray-500">On orders above ₹499</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border">
                <FiRefreshCw className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-500">7-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border">
                <FiUser className="w-6 h-6 text-orange-500" />
                <div>
                  <div className="font-medium text-sm">24/7 Support</div>
                  <div className="text-xs text-gray-500">Customer service</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section - Full Width Below Product */}
        <div className="mt-12">
          <ReviewSection product={product} onReviewLoad={setReviewsCount} />
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
              >
                ×
              </button>
              <Image
                src={getImageUrl(allImages[currentImageIndex].url)}
                alt={`${name} - Full view`}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
              />

              {/* Modal Navigation */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Login Popup */}
        <LoginPopup 
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Add to Cart Success Popup */}
        <AddToCartPopup 
          isVisible={showAddToCartPopup}
          onClose={() => setShowAddToCartPopup(false)}
          productName={name}
          productImage={productImage}
          productPrice={sellingPrice}
          cartItemsCount={cartItemsCount}
        />
      </div>
    </div>
  );
};

export default PageDetails;