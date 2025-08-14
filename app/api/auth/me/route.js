// app/api/auth/me/route.js - Optimized with caching
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { withRetry } from '@/lib/db';

// User cache to avoid repeated DB queries
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token.value,
        process.env.NEXTAUTH_SECRET 
      );
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    const cacheKey = `user_${userId}`;
    const now = Date.now();
    
    // Check cache first
    const cachedData = userCache.get(cacheKey);
    if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        authenticated: true,
        user: cachedData.user
      });
    }
    
    // Fetch from database with optimized query
    const user = await withRetry(async (prisma) => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      });
    }, 2, 3000); // Reduced retries and timeout

    if (!user) {
      userCache.delete(cacheKey); // Remove invalid cache
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatar: user.image,
    };
    
    // Cache the result
    userCache.set(cacheKey, {
      user: userData,
      timestamp: now
    });
    
    // Cleanup old cache entries periodically
    if (userCache.size > 100) {
      for (const [key, value] of userCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          userCache.delete(key);
        }
      }
    }
    
    return NextResponse.json({
      authenticated: true,
      user: userData
    });
    
  } catch (error) {
    console.error('Auth verification error:', error);
    
    if (error.code === 'P1001' || error.message.includes('connection')) {
      return NextResponse.json(
        { error: 'Database temporarily unavailable' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}