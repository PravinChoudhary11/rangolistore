// cart/api/removeItem.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');
    if (!itemId) return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });

    const res = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` }
    });

    if (!res.ok) throw new Error('Failed to remove item from cart');

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('RemoveItem error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
