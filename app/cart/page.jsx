"use client";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, cartItemsCount, loading, error, totalPrice, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading your cart...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">❌ Error loading cart: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">Please log in to view your cart.</p>
          <a 
            href="/login" 
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || cartItemsCount === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <a 
            href="/products" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  console.log("🛒 Rendering cart with items:", cart);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <div className="text-right">
          <p className="text-gray-600">Total items: {cartItemsCount}</p>
          <p className="text-xl font-bold text-green-600">₹{totalPrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {cart.map((item) => {
          const product = item.product;
          const imageUrl = product?.images?.[0]?.url || product?.images?.[0]?.formats?.medium?.url;
          console.log("img: ",`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`);
          
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`}
                    alt={product?.name || "Product"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    📦
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-medium text-gray-900 truncate">
                  {product?.name || "Unknown Product"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  SKU: {product?.slug || item.productSlug}
                </p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  ₹{(product?.sellingPrice || 0).toLocaleString()}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
                  disabled={loading || item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
                  disabled={loading}
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ₹{((product?.sellingPrice || 0) * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total ({cartItemsCount} items):</span>
          <span className="text-2xl font-bold text-green-600">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Continue Shopping
          </button>
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}