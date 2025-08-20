// Updated CartContext.js - Fixed with better state management and loading states
"use client";
import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  
  // Use refs to track ongoing operations and prevent duplicate requests
  const fetchRequestRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const FETCH_DEBOUNCE_TIME = 500; // 500ms debounce

  // Optimized fetch cart function with debouncing and better error handling
  const fetchCart = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || !user?.email) {
      setCart([]);
      setCartItemsCount(0);
      setLoading(false);
      setError(null);
      return { success: true, cart: [] };
    }

    const now = Date.now();
    
    // Debounce rapid successive calls unless forcing refresh
    if (!forceRefresh && now - lastFetchTimeRef.current < FETCH_DEBOUNCE_TIME) {
      return { success: true, cart, cached: true };
    }

    // If there's already a fetch in progress, wait for it
    if (fetchRequestRef.current && !forceRefresh) {
      return await fetchRequestRef.current;
    }

    const fetchPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        lastFetchTimeRef.current = now;
        
        const res = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.cart)) {
          setCart(data.cart);
          setCartItemsCount(data.cart.length);
          setCartId(data.id);
          return { success: true, cart: data.cart };
        } else {
          setCart([]);
          setCartItemsCount(0);
          if (data.error) {
            setError(data.error);
          }
          return { success: false, error: data.error };
        }
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
        setCart([]);
        setCartItemsCount(0);
        const errorMessage = err.message || "Failed to load cart";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        fetchRequestRef.current = null;
      }
    })();

    fetchRequestRef.current = fetchPromise;
    return await fetchPromise;
  }, [user?.email, isAuthenticated, cart]);

  // Effect to fetch cart when user changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchCart(true); // Force refresh when user changes
    } else {
      setCart([]);
      setCartItemsCount(0);
      setError(null);
    }
  }, [user?.email, isAuthenticated]);

  // Add to cart with optimistic updates and better error handling
  const addToCart = useCallback(async (productSlug, quantity = 1) => {
    if (!isAuthenticated || !user?.email) {
      setError("Please log in to add items to cart");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productSlug, quantity })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        // Force refresh to get the latest cart state
        await fetchCart(true);
        return { success: true, action: data.action };
      } else {
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.message || "Failed to add item to cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user?.email, isAuthenticated, fetchCart]);

  // Remove from cart with optimistic updates
  const removeFromCart = useCallback(async (documentId) => {
    if (!isAuthenticated || !user?.email) {
      setError("Please log in to modify cart");
      return { success: false, error: "Not authenticated" };
    }

    // Optimistic update - remove item from UI immediately
    const originalCart = [...cart];
    const itemToRemove = cart.find(item => item.documentId === documentId);
    if (itemToRemove) {
      const updatedCart = cart.filter(item => item.documentId !== documentId);
      setCart(updatedCart);
      setCartItemsCount(updatedCart.length);
    }

    try {
      setError(null);
      const res = await fetch(`/api/cart?documentId=${documentId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        // Confirm with fresh data from server
        await fetchCart(true);
        return { success: true, action: data.action };
      } else {
        // Revert optimistic update on error
        setCart(originalCart);
        setCartItemsCount(originalCart.length);
        throw new Error(data.error || 'Failed to remove from cart');
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      // Revert optimistic update
      setCart(originalCart);
      setCartItemsCount(originalCart.length);
      const errorMessage = err.message || "Failed to remove item from cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user?.email, isAuthenticated, cart, fetchCart]);

  // Update quantity with optimistic updates
  const updateQuantity = useCallback(async (documentId, quantity) => {
    if (!isAuthenticated || !user?.email) {
      setError("Please log in to modify cart");
      return { success: false, error: "Not authenticated" };
    }

    if (quantity < 0) {
      setError("Quantity cannot be negative");
      return { success: false, error: "Invalid quantity" };
    }

    // Optimistic update - update quantity in UI immediately
    const originalCart = [...cart];
    const itemIndex = cart.findIndex(item => item.documentId === documentId);
    
    if (itemIndex !== -1) {
      const updatedCart = [...cart];
      if (quantity === 0) {
        // Remove item if quantity is 0
        updatedCart.splice(itemIndex, 1);
      } else {
        updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity };
      }
      setCart(updatedCart);
      setCartItemsCount(updatedCart.length);
    }

    try {
      setError(null);

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId, quantity }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Confirm with fresh data from server
        await fetchCart(true);
        return { success: true, action: data.action };
      } else {
        // Revert optimistic update on error
        setCart(originalCart);
        setCartItemsCount(originalCart.length);
        throw new Error(data.error || 'Failed to update quantity');
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      // Revert optimistic update
      setCart(originalCart);
      setCartItemsCount(originalCart.length);
      const errorMessage = err.message || "Failed to update quantity";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user?.email, isAuthenticated, cart, fetchCart]);

  // Calculate total price with memoization
  const totalPrice = cart.reduce((total, item) => {
    const price = item.product?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !user?.email) {
      setError("Please log in to clear cart");
      return { success: false, error: "Not authenticated" };
    }

    // Optimistic update - clear cart immediately
    const originalCart = [...cart];
    setCart([]);
    setCartItemsCount(0);

    try {
      setError(null);
      const deletePromises = originalCart.map(item =>
        fetch(`/api/cart?documentId=${item.documentId}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.allSettled(deletePromises);
      
      // Check if any deletions failed
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.error("Some items failed to delete:", failures);
        // Revert and fetch fresh data
        await fetchCart(true);
        throw new Error(`Failed to delete ${failures.length} items`);
      }

      // Confirm with fresh data
      await fetchCart(true);
      return { success: true };
    } catch (err) {
      console.error("Error clearing cart:", err);
      // Revert optimistic update and fetch fresh data
      await fetchCart(true);
      const errorMessage = err.message || "Failed to clear cart";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [cart, user?.email, isAuthenticated, fetchCart]);

  // Refresh cart function for manual refresh
  const refreshCart = useCallback(async () => {
    return await fetchCart(true);
  }, [fetchCart]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh cart periodically when user is active
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const interval = setInterval(() => {
      // Only refresh if user is active (document is visible)
      if (!document.hidden) {
        fetchCart();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.email, fetchCart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchRequestRef.current) {
        fetchRequestRef.current = null;
      }
    };
  }, []);

  const contextValue = {
    cart,
    cartItemsCount,
    loading,
    error,
    totalPrice,
    cartId,
    // Actions
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    clearError,
    // Setters (for advanced usage)
    setCart,
    setCartItemsCount,
    setError,
    // Status
    isAuthenticated,
    isEmpty: cartItemsCount === 0
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};