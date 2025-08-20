import { NextResponse } from 'next/server';
import { withRetry } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { createCartForUser } from '../../cart/helpers';

export async function POST(request) {
  try {
    const body = await request.json();
    
    let email;
    
    // Handle different input formats
    if (typeof body === 'string') {
      email = body;
    } else if (body.email) {
      email = body.email;
    } else if (body.credential) {
      // Handle Google OAuth credential response
      try {
        const decoded = JSON.parse(atob(body.credential.split('.')[1]));
        email = decoded.email;
      } catch (decodeError) {
        console.error('Failed to decode credential:', decodeError);
        return NextResponse.json({ 
          error: 'Invalid credential format', 
          success: false 
        }, { status: 400 });
      }
    } else {
      console.error('No email found in request:', body);
      return NextResponse.json({ 
        error: 'Email is required', 
        success: false 
      }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      console.error('Invalid email format:', email);
      return NextResponse.json({ 
        error: 'Valid email is required', 
        success: false 
      }, { status: 400 });
    }

    const user = await withRetry(async (prisma) => {
      return await prisma.user.findUnique({
        where: { 
          email: email.trim().toLowerCase() // Ensure email is string and normalized
        },
        select: { 
          id: true, 
          name: true, 
          email: true, 
          image: true 
        }
      });
    }, 2, 3000);

    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'User not found. Please register first.', success: false },
        { status: 404 }
      );
    }

    // Check if user has a cart, create one if not
    try {
      await createCartForUser(user.email);
    } catch (cartError) {
      console.error('Failed to ensure cart exists:', cartError);
      // Don't fail login if cart creation fails, just log the error
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        iat: Math.floor(Date.now() / 1000) 
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
      jwt: token
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/' 
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Database constraint error',
        success: false 
      }, { status: 400 });
    }
    
    if (error.message.includes('Invalid `prisma.user.findUnique()` invocation')) {
      return NextResponse.json({ 
        error: 'Invalid user lookup parameters',
        success: false 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}