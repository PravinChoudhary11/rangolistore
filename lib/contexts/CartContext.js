'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user?.email]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, loading }}>
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
