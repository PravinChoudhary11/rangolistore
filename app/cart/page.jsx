"use client";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, RefreshCw } from "lucide-react";

export default function CartPage() {
  const { cart, cartItemsCount, loading, error, totalPrice, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 p-6 bg-gray-50 rounded-xl">
                      <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-blue-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sign in to view your cart</h1>
              <p className="text-gray-600 text-lg mb-8">Please log in to access your shopping cart and continue your purchase.</p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <a 
                  href="/login" 
                  className="block w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg text-center"
                >
                  Sign In
                </a>
                <a 
                  href="/" 
                  className="block w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 font-semibold text-center"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || cartItemsCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 text-lg mb-8">Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>
              <a 
                href="/" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <a 
                href="/products" 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </a>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = item.product;
              const imageUrl = product?.images?.[0]?.url || product?.images?.[0]?.formats?.medium?.url;
              
              return (
                <div
                  key={item.documentId}
                  className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden group">
                      {imageUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`}
                          alt={product?.name || "Product"}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product?.name || "Unknown Product"}
                          </h2>
                          <p className="text-sm text-gray-500 mb-3">
                            SKU: {product?.slug || item.productSlug}
                          </p>
                          <div className="flex items-center gap-4">
                            <p className="text-xl font-bold text-green-600">
                              ₹{(product?.sellingPrice || 0).toLocaleString()}
                            </p>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                              <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.documentId, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading || item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.documentId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item Total and Remove */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 mb-2">
                              ₹{((product?.sellingPrice || 0) * item.quantity).toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.documentId)}
                              className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItemsCount} items)</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-green-600">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 font-semibold text-lg shadow-lg">
                  Proceed to Checkout
                </button>
                <a 
                  href="/products" 
                  className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold text-center"
                >
                  Continue Shopping
                </a>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800 font-medium">🎉 Free shipping on orders over ₹500!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}