// app/api/auth/register/route.js - Optimized
import { NextResponse } from 'next/server';
import { withRetry } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { name, email, image } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required', success: false },
        { status: 400 }
      );
    }

    // Check if user exists and create in a single transaction
    const result = await withRetry(async (prisma) => {
      return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          throw new Error('USER_EXISTS');
        }

        const newUser = await tx.user.create({
          data: {
            name,
            email,
            image: image || null,
            emailVerified: new Date(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        });

        return newUser;
      });
    }, 2, 5000);

    const token = jwt.sign(
      { userId: result.id, email: result.email, iat: Math.floor(Date.now() / 1000) },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: result,
      jwt: token
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
    console.error('Registration error:', error);
    
    if (error.message === 'USER_EXISTS') {
      return NextResponse.json(
        { error: 'User already exists with this email', success: false },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
