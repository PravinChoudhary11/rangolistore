// components/CartIcon.jsx - Enhanced cart icon with modern visual appeal
import { useCart } from "@/lib/contexts/CartContext";

export const CartIcon = ({ className = '' }) => {
  const { itemCount, cartLoading } = useCart();

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      {/* Main cart icon with hover effects */}
      <div className="relative p-2 rounded-xl transition-all duration-300 ease-out group-hover:bg-gray-100 dark:group-hover:bg-gray-800 group-hover:scale-105">
        <svg 
          className="w-6 h-6 transition-colors duration-300 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2 2v-8m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Enhanced item count badge */}
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 transform transition-all duration-300 ease-out animate-in fade-in zoom-in">
          <div className="relative">
            {/* Badge background with gradient */}
            <span className="flex items-center justify-center h-5 w-5 min-w-[20px] px-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg ring-2 ring-white dark:ring-gray-900 transition-transform duration-200 group-hover:scale-110">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
            
            {/* Subtle pulse animation for new items */}
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Enhanced loading indicator */}
      {cartLoading && (
        <div className="absolute -top-0.5 -right-0.5">
          <div className="relative">
            {/* Main loading spinner */}
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            
            {/* Glowing background */}
            <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Tooltip on hover (optional) */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
          {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in cart` : 'Cart is empty'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>
    </div>
  );
};