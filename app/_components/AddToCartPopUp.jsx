"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, X, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AddToCartPopup = ({ 
  isVisible, 
  onClose, 
  productName, 
  productImage, 
  productPrice,
  cartItemsCount = 0 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  const handleViewCart = () => {
    onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden
        transform transition-all duration-300 ease-out
        ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
      `}>
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                Added to Cart!
              </h3>
              <p className="text-sm text-green-700 font-medium">
                Item successfully added to your cart
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {/* Product Image */}
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              {productImage ? (
                <Image 
                  src={productImage} 
                  alt={productName || 'Product'} 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                {productName || 'Product'}
              </h4>
              {productPrice && (
                <div className="text-lg font-bold text-blue-600 mb-2">
                  ₹{productPrice.toLocaleString()}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingBag className="w-4 h-4" />
                <span>{cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''} in cart</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewCart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              View Cart ({cartItemsCount})
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Continue Shopping
            </button>
          </div>

          {/* Additional Options */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              Add to Wishlist
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default AddToCartPopup;