// lib/hooks/useCartOperations.js
'use client';

import { useCallback } from 'react';
import { useCart } from './useCart';
import { useAuth } from './useAuth';

/**
 * Hook for common cart operations with better UX
 */
export function useCartOperations() {
  const { user } = useAuth();
  const cart = useCart();

  const addToCartWithFeedback = useCallback(async (item, options = {}) => {
    if (!user) {
      return { 
        success: false, 
        error: 'Please login to add items to cart',
        requiresAuth: true 
      };
    }

    const { showLoading = true, optimistic = true } = options;

    try {
      if (showLoading) {
        // Could integrate with a toast/notification system here
        console.log('Adding item to cart...');
      }

      const result = await cart.addToCart(item);

      if (result.success) {
        if (showLoading) {
          console.log('Item added to cart successfully!');
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, error: 'Failed to add item to cart' };
    }
  }, [user, cart]);

  const removeFromCartWithFeedback = useCallback(async (itemId, options = {}) => {
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const { showLoading = true } = options;

    try {
      if (showLoading) {
        console.log('Removing item from cart...');
      }

      const result = await cart.removeFromCart(itemId);

      if (result.success) {
        if (showLoading) {
          console.log('Item removed from cart');
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }
  }, [user, cart]);

  const updateQuantityWithFeedback = useCallback(async (itemId, quantity, options = {}) => {
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const { showLoading = true } = options;

    try {
      if (showLoading) {
        console.log('Updating item quantity...');
      }

      const result = await cart.updateItemQuantity(itemId, quantity);

      if (result.success) {
        if (showLoading) {
          console.log('Quantity updated successfully');
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      return { success: false, error: 'Failed to update quantity' };
    }
  }, [user, cart]);

  return {
    // Enhanced operations
    addToCartWithFeedback,
    removeFromCartWithFeedback,
    updateQuantityWithFeedback,
    
    // Direct cart access
    ...cart,
    
    // Helper computed values
    hasItems: cart.itemCount > 0,
    isCartReady: cart.isInitialized && !cart.cartLoading,
    cartSummary: {
      itemCount: cart.itemCount,
      totalAmount: cart.totalAmount,
      isEmpty: cart.isEmpty
    }
  };
}
