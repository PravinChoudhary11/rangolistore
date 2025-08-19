"use client";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { cartItemsCount, loading, error } = useCart();
  const { user } = useAuth();

  // Don't show cart icon if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Link href="/cart" className="relative inline-block">
      <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
        <ShoppingCart 
          className="w-6 h-6 text-gray-700 hover:text-gray-900" 
          strokeWidth={1.5}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Cart count badge */}
        {!loading && !error && cartItemsCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </div>
        )}

        {/* Error indicator */}
        {error && !loading && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        {loading ? 'Loading cart...' : 
         error ? 'Cart error' : 
         cartItemsCount > 0 ? `${cartItemsCount} item${cartItemsCount > 1 ? 's' : ''} in cart` : 
         'Cart is empty'}
      </div>
    </Link>
  );
}