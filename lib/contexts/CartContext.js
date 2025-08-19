// lib/contexts/CartContext.js 
"use client";
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchCart = useCallback(async () => {
    if (!user?.email) {
      setCart([]);
      setCartItemsCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Cart API response:", data);

      if (data.success && Array.isArray(data.cart)) {
        setCart(data.cart);
        setCartItemsCount(data.cart.length);
        setCartId(data.id);
        console.log(`✅ Cart loaded: ${data.cart.length} items`);
      } else {
        console.warn("Invalid cart response:", data);
        setCart([]);
        setCartItemsCount(0);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCart([]);
      setCartItemsCount(0);
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Initial load and user changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Function to add item to cart (you can implement this later)
  const addToCart = useCallback(async (productSlug, quantity = 1) => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productSlug, quantity })
      });

      if (res.ok) {
        // Refresh cart after adding
        await fetchCart();
        return { success: true };
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Function to remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Refresh cart after removing
        await fetchCart();
        return { success: true };
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove from cart');
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Function to update item quantity
  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      });

      if (res.ok) {
        // Refresh cart after updating
        await fetchCart();
        return { success: true };
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update quantity');
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    const price = item.product?.sellingPrice || 0;
    return total + (price * item.quantity);
  }, 0);

  const contextValue = {
    cart,
    cartItemsCount,
    loading,
    error,
    totalPrice,
    
    // Actions
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    
    // For direct state updates (use carefully)
    setCart,
    setCartItemsCount,
    setError
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
