"use client";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import { ShoppingCart, AlertCircle, Sparkles, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function CartIcon({ variant = "default", className = "", showTooltip = true }) {
  const { cartItemsCount, loading, error } = useCart();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show cart icon if user is not authenticated
  if (!user) {
    return null;
  }

  // Enhanced variant styles with more visual appeal
  const variants = {
    default: {
      container: "relative inline-block group rounded-full",
      iconWrapper:
        "relative p-2 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md backdrop-blur-sm border border-white/30 bg-white/80",
      icon: "w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-all duration-300 group-hover:drop-shadow-sm",
      badge:
        "absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md ring-1 ring-white animate-pulse hover:animate-bounce",
      loadingBadge:
        "absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md ring-1 ring-white",
      errorBadge:
        "absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md ring-1 ring-white animate-bounce",
      sparkles:
        "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
      tooltip: "absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-2xl transition-all duration-300 pointer-events-none z-50 whitespace-nowrap border border-gray-700 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900"
    },
    circular: {
      container: "relative inline-block group",
      iconWrapper: "relative h-12 w-12 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm flex items-center justify-center",
      icon: "w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-all duration-300 group-hover:drop-shadow-sm",
      badge: "absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-md ring-2 ring-white animate-pulse hover:animate-bounce",
      loadingBadge: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white",
      errorBadge: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white animate-bounce",
      sparkles: "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full",
      tooltip: "absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-2xl transition-all duration-300 pointer-events-none z-50 whitespace-nowrap border border-gray-700 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-gray-900"
    },
    mobile: {
      container: "relative inline-block group",
      iconWrapper: "relative p-5 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-blue-50 hover:to-cyan-50 rounded-3xl transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-2xl border border-white/40 bg-white/90 backdrop-blur-md",
      icon: "w-8 h-8 text-gray-700 group-hover:text-indigo-600 transition-all duration-300 group-hover:drop-shadow-md",
      badge: "absolute -top-3 -right-3 min-w-7 h-7 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white text-base font-bold rounded-full flex items-center justify-center px-2 shadow-xl ring-4 ring-white animate-pulse hover:animate-bounce",
      loadingBadge: "absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white",
      errorBadge: "absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white animate-bounce",
      sparkles: "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
      tooltip: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-2xl transition-all duration-400 pointer-events-none z-50 whitespace-nowrap border border-gray-700 before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900"
    },
    compact: {
      container: "relative inline-block group",
      iconWrapper: "relative p-3 hover:bg-gradient-to-br hover:from-gray-50 hover:via-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-200/50 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm",
      icon: "w-2 h-2 text-gray-600 group-hover:text-indigo-600 transition-all duration-300",
      badge: "absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-md ring-1 ring-white",
      loadingBadge: "absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md ring-1 ring-white",
      errorBadge: "absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-md ring-1 ring-white",
      sparkles: "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
      tooltip: "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl transition-all duration-200 pointer-events-none z-50 whitespace-nowrap before:content-[''] before:absolute before:bottom-full before:left-1/2 before:transform before:-translate-x-1/2 before:border-3 before:border-transparent before:border-b-gray-900"
    }
  };

  const currentVariant = variants[variant];

  const getTooltipText = () => {
    if (loading) return 'Loading your cart...';
    if (error) return 'Cart error - Click to retry';
    if (cartItemsCount > 0) return `${cartItemsCount} item${cartItemsCount > 1 ? 's' : ''} in your cart`;
    return 'Your cart is empty - Start shopping!';
  };

  const getBadgeContent = () => {
    if (cartItemsCount > 999) return '999+';
    if (cartItemsCount > 99) return '99+';
    return cartItemsCount;
  };

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <Link 
        href="/cart" 
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={currentVariant.iconWrapper}>
          {/* Main cart icon */}
          <ShoppingBag 
            className={currentVariant.icon}
            strokeWidth={1.5}
          />
          
          {/* Sparkle effects on hover */}
          <div className={currentVariant.sparkles}>
            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute bottom-2 left-2 w-2 h-2 text-blue-400 animate-pulse delay-100" />
            <Sparkles className="absolute top-1/2 left-1 w-2.5 h-2.5 text-purple-400 animate-pulse delay-200" />
          </div>
          
          {/* Loading indicator with enhanced animation */}
          {loading && (
            <div className={currentVariant.loadingBadge}>
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Cart count badge with enhanced styling */}
          {!loading && !error && cartItemsCount > 0 && (
            <div className={currentVariant.badge}>
              <span className="drop-shadow-sm font-extrabold">
                {getBadgeContent()}
              </span>
              {cartItemsCount > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-50 animate-pulse"></div>
              )}
            </div>
          )}

          {/* Error indicator with enhanced animation */}
          {error && !loading && (
            <div className={currentVariant.errorBadge}>
              <AlertCircle className="w-3 h-3 text-white animate-pulse" strokeWidth={2.5} />
            </div>
          )}

          {/* Enhanced pulse effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none blur-sm group-hover:blur-none"></div>
          
          {/* Glow effect */}
          {cartItemsCount > 0 && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none blur-xl"></div>
          )}
        </div>

        {/* Improved Tooltip with better positioning */}
        {showTooltip && (
          <div className={`
            ${currentVariant.tooltip}
            ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}
          `}>
            <div className="flex items-center gap-2">
              {loading && <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>}
              {error && <AlertCircle className="w-3 h-3 text-red-400" />}
              {!loading && !error && cartItemsCount > 0 && <ShoppingBag className="w-3 h-3 text-green-400" />}
              <span className="font-semibold">{getTooltipText()}</span>
            </div>
            
            {/* Tooltip glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-20 blur-sm -z-10"></div>
          </div>
        )}
      </Link>
    </div>
  );
}