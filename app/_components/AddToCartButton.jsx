"use client";
import { useState } from "react";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ShoppingCart, Plus, Check, AlertCircle } from "lucide-react";

export default function AddToCartButton({ 
  productSlug, 
  productVariant = '', 
  quantity = 1, 
  className = '',
  size = 'default', // 'sm', 'default', 'lg'
  variant = 'primary', // 'primary', 'secondary', 'outline'
  disabled = false,
  showIcon = true,
  children,
  onSuccess,
  onError
}) {
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isLoading = localLoading || cartLoading;

  const handleAddToCart = async () => {
    if (!user) {
      setError("Please login to add items to cart");
      if (onError) onError("Please login to add items to cart");
      return;
    }

    if (!productSlug) {
      setError("Product information missing");
      if (onError) onError("Product information missing");
      return;
    }

    setLocalLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await addToCart(productSlug, quantity, productVariant);
      
      if (result.success) {
        setSuccess(true);
        if (onSuccess) onSuccess(result);
        
        // Reset success state after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError(result.error || 'Failed to add to cart');
        if (onError) onError(result.error || 'Failed to add to cart');
      }
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLocalLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-600'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-lg border transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  // Success state
  if (success) {
    return (
      <button 
        className={`${baseClasses} bg-green-600 hover:bg-green-600 text-white`}
        disabled
      >
        {showIcon && <Check className="w-4 h-4" />}
        Added to Cart!
      </button>
    );
  }

  // Error state (shows for 3 seconds)
  if (error) {
    setTimeout(() => setError(null), 3000);
    return (
      <button 
        className={`${baseClasses} bg-red-600 hover:bg-red-700 text-white`}
        onClick={handleAddToCart}
        disabled={isLoading || disabled}
      >
        {showIcon && <AlertCircle className="w-4 h-4" />}
        {error.length > 20 ? 'Error - Try Again' : error}
      </button>
    );
  }

  return (
    <button 
      className={baseClasses}
      onClick={handleAddToCart}
      disabled={isLoading || disabled || !user}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Adding...
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4" />}
          {children || 'Add to Cart'}
        </>
      )}
    </button>
  );
}

// Pre-configured variants for common use cases
export function AddToCartButtonSmall(props) {
  return <AddToCartButton {...props} size="sm" />;
}

export function AddToCartButtonLarge(props) {
  return <AddToCartButton {...props} size="lg" />;
}

export function AddToCartButtonOutline(props) {
  return <AddToCartButton {...props} variant="outline" />;
}

// Quick add button with just a plus icon
export function QuickAddButton({ productSlug, className = '', ...props }) {
  return (
    <AddToCartButton 
      {...props}
      productSlug={productSlug}
      size="sm"
      variant="outline"
      showIcon={false}
      className={`w-8 h-8 p-0 rounded-full ${className}`}
    >
      <Plus className="w-4 h-4" />
    </AddToCartButton>
  );
}