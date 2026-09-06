import type { CartItemInput, CartPreview, DeliveryMethodId } from "#shared/types";
import { priceCart } from "~~/server/utils/catalog";

interface Body {
  items?: CartItemInput[];
  deliveryMethodId?: DeliveryMethodId;
}

/**
 * POST /api/cart/preview
 * Prices the cart server-side. The client never calculates money itself.
 */
export default defineEventHandler(async (event): Promise<CartPreview> => {
  const body = await readBody<Body>(event);
  const items = Array.isArray(body?.items) ? body.items : [];
  return priceCart(items, body?.deliveryMethodId);
});
