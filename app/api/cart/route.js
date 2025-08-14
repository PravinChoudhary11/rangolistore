// app/api/cart/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    console.log("User Email : ", userEmail);
    const STARPI_URL = 'http://127.0.0.1:1337';
    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });
    }

    // Fetch from Strapi
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
