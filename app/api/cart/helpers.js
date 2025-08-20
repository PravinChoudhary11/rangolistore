import { withRetry } from '@/lib/db';

export const userCache = new Map();
export const cartCache = new Map();
export const CACHE_TTL = 30 * 1000; // Reduced to 30 seconds for fresher data

// Function to generate a random string
function generateRandomString(length = 24) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
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
  if (cached && now - cached.timestamp < CACHE_TTL * 4) return cached.user; // Longer cache for users

  const user = await withRetry(async (prisma) => 
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  , 2, 3000);

  if (user) userCache.set(cacheKey, { user, timestamp: now });
  return user;
}

export async function fetchCartFromStrapi(userEmail, forceRefresh = false) {
  const now = Date.now();
  const cacheKey = `cart_${userEmail}`;
  const cached = cartCache.get(cacheKey);
  
  // Use cache only if not forcing refresh and cache is still valid
  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}&populate=cart_items`,
      {
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch cart from Strapi: ${res.status}`);

    const data = await res.json();
    const cartItems = data?.data?.[0]?.cart_items || [];
    
    // Always update cache with fresh data
    cartCache.set(cacheKey, { data: cartItems, timestamp: now });
    
    return cartItems;
  } catch (error) {
    console.error('Error fetching cart from Strapi:', error);
    
    // Return cached data if available, even if expired, as fallback
    if (cached) {
      console.warn('Using expired cache as fallback');
      return cached.data;
    }
    
    throw error;
  }
}

export async function getUserCart(userEmail, forceRefresh = false) {
  try {
    // Clear cache if forcing refresh
    if (forceRefresh) {
      const cacheKey = `cart_${userEmail}`;
      cartCache.delete(cacheKey);
    }

    const res = await fetch(
      `${process.env.STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}&populate=cart_items`,
      {
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch user cart from Strapi: ${res.status}`);

    const data = await res.json();
    return data?.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching user cart:', error);
    throw error;
  }
}

export async function createCartForUser(userEmail) {
  try {
    // First check if cart already exists
    const existingCartsRes = await fetch(
      `${process.env.STRAPI_URL}/api/carts?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}`,
      {
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!existingCartsRes.ok) {
      throw new Error(`Failed to check existing carts: ${existingCartsRes.status}`);
    }

    const existingCarts = await existingCartsRes.json();
    
    // If cart already exists, return it
    if (existingCarts.data && existingCarts.data.length > 0) {
      return existingCarts.data[0];
    }

    // Generate a random externalUserId
    const externalUserId = generateRandomString();

    // Create a new cart if none exists
    const createRes = await fetch(`${process.env.STRAPI_URL}/api/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          userEmail: userEmail,
          externalUserId: externalUserId,
          totalAmount: 0,
          currency: "RS",
          cart_items: [] // Initialize with empty cart items
        }
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.text();
      console.error('Failed to create cart:', errorData);
      throw new Error(`Failed to create cart: ${createRes.status}`);
    }

    const newCart = await createRes.json();
    
    // Clear any existing cache for this user
    const cacheKey = `cart_${userEmail}`;
    cartCache.delete(cacheKey);
    
    return newCart.data;
  } catch (error) {
    console.error('Error creating cart for user:', error);
    throw error;
  }
}

// Helper function to clear cache for specific user
export function clearUserCartCache(userEmail) {
  const cacheKey = `cart_${userEmail}`;
  cartCache.delete(cacheKey);
}

// Helper function to clear all cache
export function clearAllCache() {
  userCache.clear();
  cartCache.clear();
}