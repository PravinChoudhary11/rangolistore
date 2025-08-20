// api/cart/route.js - Fixed version with better error handling and cache management
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUser, fetchCartFromStrapi, getProduct, getUserCart, createCartForUser, cartCache } from './helpers';

// GET - Fetch user's cart
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        cart: [], 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    let decoded;
    try { 
      decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET); 
    } catch { 
      return NextResponse.json({ 
        success: false, 
        cart: [], 
        error: 'Invalid token' 
      }, { status: 401 }); 
    }

    const user = await getUser(decoded.userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        cart: [], 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Clear cache before fetching to ensure fresh data
    const cacheKey = `cart_${user.email}`;
    cartCache.delete(cacheKey);

    const cartItems = await fetchCartFromStrapi(user.email);

    // Enrich with product data
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await getProduct(item.productSlug);
        return {
          ...item,
          product: product || { 
            name: "Product Not Found", 
            slug: item.productSlug, 
            sellingPrice: 0, 
            images: [] 
          }
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      cart: enrichedItems, 
      totalItems: enrichedItems.length 
    });

  } catch (err) {
    console.error('Cart GET error:', err);
    return NextResponse.json({ 
      success: false, 
      cart: [], 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Add new item to cart or update quantity
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
    const user = await getUser(decoded.userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    const body = await req.json();
    const { productSlug, quantity = 1, documentId } = body;

    // Clear cart cache immediately for this user
    const cacheKey = `cart_${user.email}`;
    cartCache.delete(cacheKey);

    // If documentId is provided, this is a quantity update request
    if (documentId) {
      const result = await updateCartItemQuantity(documentId, quantity, user);
      // Clear cache again after update
      cartCache.delete(cacheKey);
      return result;
    }

    // Otherwise, this is an add to cart request
    if (!productSlug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product slug is required' 
      }, { status: 400 });
    }

    const product = await getProduct(productSlug);
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Get or create user's cart
    let userCart = await getUserCart(user.email);
    if (!userCart) {
      userCart = await createCartForUser(user.email);
    }

    // Check if product already exists in cart - refresh cart data first
    const freshCartItems = await fetchCartFromStrapi(user.email);
    const existingCartItem = freshCartItems.find(item => item.productSlug === productSlug);

    if (existingCartItem) {
      // Update existing cart item quantity
      const newQuantity = existingCartItem.quantity + quantity;
      const unitPrice = product.sellingPrice || product.MRP || 0;
      const totalPrice = newQuantity * unitPrice;

      const updateRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${existingCartItem.documentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            quantity: newQuantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice
          }
        })
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error('Failed to update cart item:', errorText);
        throw new Error('Failed to update existing cart item');
      }

      // Update cart total
      const newCartTotal = userCart.totalAmount - existingCartItem.totalPrice + totalPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache one more time
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Cart item quantity updated',
        action: 'updated'
      });
    } else {
      // Create new cart item
      const unitPrice = product.sellingPrice || product.MRP || 0;
      const totalPrice = quantity * unitPrice;

      const createRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
            productSlug: productSlug,
            productVariant: product.variants?.[0] || 'Default',
            cart: {
              connect: [userCart.id]
            }
          }
        })
      });

      if (!createRes.ok) {
        const errorText = await createRes.text();
        console.error('Failed to create cart item:', errorText);
        throw new Error('Failed to create cart item');
      }

      // Update cart total
      const newCartTotal = (userCart.totalAmount || 0) + totalPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache one more time
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Item added to cart',
        action: 'created'
      });
    }

  } catch (err) {
    console.error('Add to cart error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
    const user = await getUser(decoded.userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Clear cache immediately
    const cacheKey = `cart_${user.email}`;
    cartCache.delete(cacheKey);

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('documentId');
    
    if (!itemId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item ID required' 
      }, { status: 400 });
    }

    // Get the cart item first
    const cartItemRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${itemId}`, {
      headers: { 
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` 
      }
    });

    if (!cartItemRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart item not found' 
      }, { status: 404 });
    }

    const cartItemData = await cartItemRes.json();
    const cartItem = cartItemData.data;

    // Get user's cart
    const userCart = await getUserCart(user.email);
    if (!userCart) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart not found' 
      }, { status: 404 });
    }

    if (cartItem.quantity > 1) {
      // Decrease quantity by 1
      const newQuantity = cartItem.quantity - 1;
      const newTotalPrice = newQuantity * cartItem.unitPrice;
      
      const updateRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            quantity: newQuantity,
            totalPrice: newTotalPrice
          }
        })
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      // Update cart total amount
      const newCartTotal = userCart.totalAmount - cartItem.unitPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Quantity decreased',
        action: 'decreased' 
      });
    } else {
      // Delete the cart item completely
      const deleteRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${itemId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` 
        }
      });

      if (!deleteRes.ok) {
        throw new Error('Failed to delete cart item');
      }

      // Update cart total amount
      const newCartTotal = userCart.totalAmount - cartItem.totalPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Item removed from cart',
        action: 'deleted' 
      });
    }

  } catch (err) {
    console.error('Remove item error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}

// Helper function for quantity updates (used by POST when documentId is provided)
async function updateCartItemQuantity(documentId, quantity, user) {
  try {
    if (quantity < 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quantity cannot be negative' 
      }, { status: 400 });
    }

    // Clear cache
    const cacheKey = `cart_${user.email}`;
    cartCache.delete(cacheKey);

    // Get the cart item first
    const cartItemRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${documentId}`, {
      headers: { 
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!cartItemRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart item not found' 
      }, { status: 404 });
    }

    const cartItemData = await cartItemRes.json();
    const cartItem = cartItemData.data;

    // Get product to verify pricing
    const product = await getProduct(cartItem.productSlug);
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Associated product not found' 
      }, { status: 404 });
    }

    // Get user's cart
    const userCart = await getUserCart(user.email);
    if (!userCart) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart not found' 
      }, { status: 404 });
    }

    if (quantity === 0) {
      // Delete the item if quantity is 0
      const deleteRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${documentId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` 
        }
      });

      if (!deleteRes.ok) {
        throw new Error('Failed to delete cart item');
      }

      // Update cart total
      const newCartTotal = userCart.totalAmount - cartItem.totalPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Item removed from cart',
        action: 'deleted'
      });
    } else {
      // Update quantity
      const unitPrice = product.sellingPrice || product.MRP || 0;
      const newTotalPrice = quantity * unitPrice;
      const oldTotalPrice = cartItem.totalPrice;

      const updateRes = await fetch(`${process.env.STRAPI_URL}/api/cart-items/${documentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: newTotalPrice
          }
        })
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      // Calculate new cart total
      const newCartTotal = userCart.totalAmount - oldTotalPrice + newTotalPrice;
      await updateCartTotal(userCart.id, newCartTotal);

      // Clear cache
      cartCache.delete(cacheKey);

      return NextResponse.json({ 
        success: true, 
        message: 'Quantity updated successfully',
        action: 'updated'
      });
    }
  } catch (err) {
    console.error('Update quantity error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}

// Helper function to update cart total
async function updateCartTotal(cartId, newTotal) {
  await fetch(`${process.env.STRAPI_URL}/api/carts/${cartId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        totalAmount: Math.max(0, newTotal)
      }
    })
  });
}