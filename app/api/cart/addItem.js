// api/cart/addItem.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUser, getProduct } from './helpers';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
    const user = await getUser(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { productSlug, quantity } = body;

    const product = await getProduct(productSlug);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    const res = await fetch(`${process.env.STRAPI_URL}/api/cart-items`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          productSlug,
          quantity,
          cart: {
            connect: { userEmail: user.email }
          }
        }
      })
    });

    if (!res.ok) throw new Error('Failed to add item to cart');

    const data = await res.json();
    return NextResponse.json({ success: true, item: data });

  } catch (err) {
    console.error('AddItem error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
