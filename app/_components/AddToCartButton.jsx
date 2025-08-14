// components/AddToCartButton.jsx - Enhanced add to cart component
'use client';

import { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';

const AddToCartButton = ({ 
  productId, 
  productName, 
  productVariant,
  unitPrice, 
  className = '',
  variant = 'primary', 
  size = 'md',
  showQuantitySelector = true,
  disabled = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cartLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      showNotification('Please login to add items to cart', 'error');
      return;
    }

    if (!productId || !unitPrice) {
      showNotification('Product information is missing', 'error');
      return;
    }

    setIsAdding(true);

    try {
      const result = await addToCart({
      externalUserId: user.id,  // adjust according to your user object shape
      userEmail: user.email,
      productVariant,
      unitPrice,
      quantity,
    });
    
      if (result.success) {
        showNotification(`${productName || 'Product'} added to cart!`);
        setQuantity(1); // Reset quantity after successful add
      } else {
        showNotification(result.error || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      showNotification('An error occurred while adding to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/30 border border-blue-600',
      secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-4 focus:ring-gray-500/30 border border-gray-300',
      outline: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white focus:ring-4 focus:ring-blue-500/30 backdrop-blur-sm',
      success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 border border-green-500'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]'
    };

    return `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  };

  const getQuantityClasses = () => {
    return 'flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200';
  };

  const isDisabled = isAdding || cartLoading || !productId || !unitPrice || disabled;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {showQuantitySelector && (
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Quantity:
          </label>
          <div className={getQuantityClasses()}>
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isDisabled}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors duration-200 flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
            
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(99, value)));
              }}
              disabled={isDisabled}
              className="w-16 text-center border-0 py-2 focus:ring-0 focus:outline-none font-semibold bg-transparent disabled:opacity-50"
              aria-label="Quantity"
            />
            
            <button
              type="button"
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              disabled={quantity >= 99 || isDisabled}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors duration-200 flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={getButtonClasses()}
        aria-label={`Add ${productName || 'product'} to cart`}
      >
        {/* Button Content */}
        <div className="flex items-center justify-center space-x-2">
          {isAdding ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
                />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
      </button>

      {/* Price Display */}
      {unitPrice && (
        <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">
            {quantity > 1 ? (
              <span>₹{unitPrice} × {quantity}</span>
            ) : (
              <span>Unit Price</span>
            )}
          </div>
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            ₹{(unitPrice * quantity).toLocaleString('en-IN')}
          </div>
        </div>
      )}

      {/* Enhanced Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border-l-4 transition-all duration-300 transform ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-700 border-red-400 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500' 
            : 'bg-green-50 text-green-700 border-green-400 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'error' ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
            Please login to add items to your cart
          </p>
          <a 
            href="/login" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login Now
          </a>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;