// api/cart/getCart.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUser, fetchCartFromStrapi, getProduct } from './helpers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) return NextResponse.json({ success: false, cart: [], error: 'Not authenticated' }, { status: 401 });

    let decoded;
    try { decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET); } 
    catch { return NextResponse.json({ success: false, cart: [], error: 'Invalid token' }, { status: 401 }); }

    const user = await getUser(decoded.userId);
    if (!user) return NextResponse.json({ success: false, cart: [], error: 'User not found' }, { status: 404 });

    const cartItems = await fetchCartFromStrapi(user.email);

    // Enrich with product data
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => ({
        ...item,
        product: await getProduct(item.productSlug) || { name: "Product Not Found", slug: item.productSlug, sellingPrice: 0, images: [] }
      }))
    );

    return NextResponse.json({ success: true, cart: enrichedItems, totalItems: enrichedItems.length });

  } catch (err) {
    console.error('Cart GET error:', err);
    return NextResponse.json({ success: false, cart: [], error: 'Internal server error' }, { status: 500 });
  }
}
