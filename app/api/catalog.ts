import type { CartItemInput, CartPreview, DeliveryMethodId, DeliveryOption } from "#shared/types";

export function fetchDeliveryOptions() {
  return useNuxtApp().$api<DeliveryOption[]>("/catalog/delivery-options");
}

/** The server owns pricing — the client only sends ids and quantities. */
export function previewCart(items: CartItemInput[], deliveryMethodId?: DeliveryMethodId) {
  return useNuxtApp().$api<CartPreview>("/cart/preview", {
    method: "POST",
    body: { items, deliveryMethodId },
  });
}
