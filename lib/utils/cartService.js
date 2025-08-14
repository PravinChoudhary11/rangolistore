// utils/cartService.js
import { strapiRequest } from './strapiClient';

export async function addItemToCart({ cartId, productId, quantity = 1 }) {
  // 1. Check if item already exists in the cart
  const existingItems = await strapiRequest(
    `/cart-items?filters[cart][id][$eq]=${cartId}&filters[product][id][$eq]=${productId}`,
    'GET'
  );

  if (existingItems && existingItems.length > 0) {
    const item = existingItems[0];
    const updatedQuantity = item.attributes.quantity + quantity;

    return await strapiRequest(`/cart-items/${item.id}`, 'PUT', {
      quantity: updatedQuantity,
    });
  } else {
    // 2. Create new cart-item
    return await strapiRequest('/cart-items', 'POST', {
      cart: cartId,
      product: productId,
      quantity,
    });
  }
}

export async function removeItemFromCart(cartItemId) {
  return await strapiRequest(`/cart-items/${cartItemId}`, 'DELETE');
}

const STRAPI_URL = "http://localhost:1337";

