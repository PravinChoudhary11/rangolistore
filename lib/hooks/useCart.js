
// lib/hooks/useCart.js
'use client';

import { useCart as useCartContext } from '../contexts/CartContext';

/**
 * Simple cart hook - wrapper around CartContext
 */
export function useCart() {
  return useCartContext();
}
