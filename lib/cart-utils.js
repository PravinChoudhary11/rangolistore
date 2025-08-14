// lib/cart-utils.js - Simplified full version

const STRAPI_URL = process.env.BACKEND_INTERNAL_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  throw new Error("Missing BACKEND_INTERNAL_URL or STRAPI_API_TOKEN");
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_TOKEN}`
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { headers, ...options });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// -------- Cart Retrieval & Creation --------
export async function getCartWithItems(userId) {
  const res = await fetchJSON(
    `${STRAPI_URL}/api/carts?filters[externalUserId][$eq]=${userId}&populate[cart_items][populate]=product,product.images`
  );
  return res.data?.[0] || null;
}

export async function createUserCart(userId, email) {
  const payload = {
    data: {
      externalUserId: String(userId),
      userEmail: email,
      totalAmount: 0,
      currency: 'RS',
      lastUpdated: new Date().toISOString()
    }
  };
  const res = await fetchJSON(`${STRAPI_URL}/api/carts`, { method: 'POST', body: JSON.stringify(payload) });
  return res.data;
}

export async function getOrCreateCart(userId, email) {
  return (await getCartWithItems(userId)) || (await createUserCart(userId, email));
}

// -------- Cart Items Management --------
export async function addItemToCart(userId, productId, qty = 1, price) {
  validateCartItemData({ productId, quantity: qty, unitPrice: price });
  const cart = await getCartWithItems(userId);
  if (!cart) throw new Error("Cart not found");

  const existing = await fetchJSON(
    `${STRAPI_URL}/api/cart-items?filters[cart][id][$eq]=${cart.id}&filters[product][id][$eq]=${productId}`
  );
  const item = existing.data?.[0];

  if (item) {
    const newQty = item.attributes.quantity + qty;
    await fetchJSON(`${STRAPI_URL}/api/cart-items/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { quantity: newQty, unitPrice: price, totalPrice: newQty * price } })
    });
  } else {
    await fetchJSON(`${STRAPI_URL}/api/cart-items`, {
      method: 'POST',
      body: JSON.stringify({ data: { cart: cart.id, product: productId, quantity: qty, unitPrice: price, totalPrice: qty * price } })
    });
  }
  await updateCartTotal(cart.id);
}

export async function removeItemFromCart(userId, cartItemId) {
  const item = await fetchJSON(`${STRAPI_URL}/api/cart-items/${cartItemId}?populate=cart`);
  const cartId = item.data.attributes.cart.data.id;
  const cart = await fetchJSON(`${STRAPI_URL}/api/carts/${cartId}`);
  if (cart.data.attributes.externalUserId !== String(userId)) throw new Error("Unauthorized");

  await fetchJSON(`${STRAPI_URL}/api/cart-items/${cartItemId}`, { method: 'DELETE' });
  await updateCartTotal(cartId);
}

export async function updateCartItemQuantity(userId, cartItemId, qty) {
  if (qty < 0) throw new Error("Quantity cannot be negative");
  if (qty === 0) return await removeItemFromCart(userId, cartItemId);

  const item = await fetchJSON(`${STRAPI_URL}/api/cart-items/${cartItemId}?populate=cart`);
  const cartId = item.data.attributes.cart.data.id;
  const cart = await fetchJSON(`${STRAPI_URL}/api/carts/${cartId}`);
  if (cart.data.attributes.externalUserId !== String(userId)) throw new Error("Unauthorized");

  await fetchJSON(`${STRAPI_URL}/api/cart-items/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: { quantity: qty, totalPrice: qty * item.data.attributes.unitPrice } })
  });
  await updateCartTotal(cartId);
}

export async function clearUserCart(userId) {
  const cart = await getCartWithItems(userId);
  if (!cart) return;
  const items = await fetchJSON(`${STRAPI_URL}/api/cart-items?filters[cart][id][$eq]=${cart.id}`);
  await Promise.all(items.data.map(i => fetchJSON(`${STRAPI_URL}/api/cart-items/${i.id}`, { method: 'DELETE' })));
  await updateCartTotal(cart.id);
}

// -------- Cart Totals & Stats --------
export async function updateCartTotal(cartId) {
  const items = await fetchJSON(`${STRAPI_URL}/api/cart-items?filters[cart][id][$eq]=${cartId}`);
  const total = items.data.reduce((sum, i) => sum + (i.attributes.totalPrice || 0), 0);
  await fetchJSON(`${STRAPI_URL}/api/carts/${cartId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: { totalAmount: total, lastUpdated: new Date().toISOString() } })
  });
  return total;
}

export async function getCartStats(userId) {
  const cart = await getCartWithItems(userId);
  if (!cart) return { itemCount: 0, totalAmount: 0, currency: 'RS', isEmpty: true };
  const items = cart.attributes.cart_items?.data || [];
  const itemCount = items.reduce((t, i) => t + (i.attributes?.quantity || 0), 0);
  return {
    itemCount,
    totalAmount: cart.attributes.totalAmount || 0,
    currency: cart.attributes.currency || 'RS',
    isEmpty: itemCount === 0,
    cartId: cart.id,
    lastUpdated: cart.attributes.lastUpdated
  };
}

// -------- Utility Functions --------
export function validateCartItemData({ productId, quantity, unitPrice }) {
  if (!productId || typeof productId !== 'string') throw new Error('Invalid productId');
  if (!quantity || typeof quantity !== 'number' || quantity <= 0) throw new Error('Invalid quantity');
  if (!unitPrice || typeof unitPrice !== 'number' || unitPrice <= 0) throw new Error('Invalid unitPrice');
}

export function formatCartData(cartData) {
  if (!cartData) return null;
  const attr = cartData.attributes || {};
  const items = attr.cart_items?.data || [];
  return {
    id: cartData.id,
    externalUserId: attr.externalUserId,
    userEmail: attr.userEmail,
    totalAmount: attr.totalAmount || 0,
    currency: attr.currency || 'RS',
    lastUpdated: attr.lastUpdated,
    itemCount: items.reduce((t, i) => t + (i.attributes?.quantity || 0), 0),
    items: items.map(i => ({
      id: i.id,
      quantity: i.attributes?.quantity || 0,
      unitPrice: i.attributes?.unitPrice || 0,
      totalPrice: i.attributes?.totalPrice || 0,
      productVariant: i.attributes?.productVariant,
      product: i.attributes?.product?.data ? {
        id: i.attributes.product.data.id,
        name: i.attributes.product.data.attributes?.name,
        slug: i.attributes.product.data.attributes?.slug,
        images: i.attributes.product.data.attributes?.images?.data || []
      } : null
    }))
  };
}

export async function checkProductAvailability(productId, qty) {
  try {
    const product = await fetchJSON(`${STRAPI_URL}/api/products/${productId}`);
    const stock = product.data.attributes?.stock || 0;
    const isActive = product.data.attributes?.isActive !== false;
    return isActive && stock >= qty;
  } catch {
    return false;
  }
}

export function calculateCartTotals(cart, taxRate = 0, discount = 0) {
  const subtotal = cart.totalAmount || 0;
  const tax = subtotal * taxRate;
  const discountAmt = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal + tax - discountAmt);
  return { subtotal, taxAmount: tax, discountAmount: discountAmt, total };
}

export async function mergeGuestCartWithUserCart(guestCartId, userId) {
  const guest = await fetchJSON(`${STRAPI_URL}/api/carts/${guestCartId}?populate[cart_items][populate]=product`);
  const guestItems = guest.data.attributes.cart_items?.data || [];
  const userCart = await getCartWithItems(userId);
  if (!userCart) throw new Error("User cart not found");

  for (const item of guestItems) {
    const { product, quantity, unitPrice } = item.attributes;
    if (product?.data?.id) {
      await addItemToCart(userId, product.data.id, quantity, unitPrice);
    }
  }
  await fetchJSON(`${STRAPI_URL}/api/carts/${guestCartId}`, { method: 'DELETE' });
  return await getCartWithItems(userId);
}
