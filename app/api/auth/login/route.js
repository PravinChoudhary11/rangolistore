// app/api/auth/login/route.js - Optimized
import { NextResponse } from 'next/server';
import { withRetry } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Create a separate cache for login route
const loginUserCache = new Map();
const LOGIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await withRetry(async (prisma) => {
      return await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, image: true }
      });
    }, 2, 3000);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.', success: false },
        { status: 404 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, iat: Math.floor(Date.now() / 1000) },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Clear any existing cache for this user
    const cacheKey = `user_${user.id}`;
    loginUserCache.delete(cacheKey);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
      jwt: token // Include JWT in response for client-side storage
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/' 
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      success: false 
    }, { status: 500 });
  }
}