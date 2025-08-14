// app/api/auth/logout/route.js - Optimized
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Use the same cache reference
const logoutUserCache = new Map();

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    
    // Clear user from cache if token exists
    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
        const cacheKey = `user_${decoded.userId}`;
        logoutUserCache.delete(cacheKey);
      } catch (e) {
        // Token invalid, but continue with logout
      }
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}