// api/cart/helpers.js
import { withRetry } from '@/lib/db';

export const userCache = new Map();
export const cartCache = new Map();
export const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
    const data = await res.json();
    return data?.data?.[0] || null;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export async function getUser(userId) {
  const now = Date.now();
  const cacheKey = `user_${userId}`;
  const cached = userCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL * 2) return cached.user;

  const user = await withRetry(async (prisma) => 
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  , 2, 3000);

  if (user) userCache.set(cacheKey, { user, timestamp: now });
  return user;
}

export async function fetchCartFromStrapi(userEmail) {
  const now = Date.now();
  const cacheKey = `cart_${userEmail}`;
  const cached = cartCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) return cached.data;

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}&populate=cart_items`,
    {
      headers: { 
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    }
  );

  if (!res.ok) throw new Error('Failed to fetch cart from Strapi');

  const data = await res.json();
  const cartItems = data?.data?.[0]?.cart_items || [];
  cartCache.set(cacheKey, { data: cartItems, timestamp: now });
  return cartItems;
}
