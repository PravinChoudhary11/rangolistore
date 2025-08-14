'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    if (!user?.email) return;

    async function fetchCart() {
      setLoading(true);
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(user.email)}&populate=cart_items`
        );
        const data = await res.json();

        console.log('Fetched cart data:', data);

        if (!data?.data || data.data.length === 0) {
          setError('No cart found for this user.');
          setCart(null);
        } else {
          setCart(data.data[0]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart.');
        setCart(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [user?.email]);

  if (!user) return <p className="p-4">Please log in to view your cart.</p>;
  if (loading) return <p className="p-4">Loading cart...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      <p>
        <strong>User Email:</strong> {cart.userEmail}
      </p>
      <p>
        <strong>Total Amount:</strong> ₹{cart.totalAmount} {cart.currency}
      </p>

      {cart.cart_items && cart.cart_items.length > 0 ? (
        <div className="mt-4 space-y-4">
          {cart.cart_items.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow-sm bg-white">
              <p><strong>Product Variant:</strong> {item.productVariant}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Unit Price:</strong> ₹{item.unitPrice}</p>
              <p><strong>Total Price:</strong> ₹{item.totalPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
