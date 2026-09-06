import type {
  CartItemInput,
  DeliveryMethodId,
  Order,
  OrderListItem,
  OrderTracking,
  PaymentMethodId,
  ShippingAddress,
} from "#shared/types";

export interface CreateOrderPayload {
  items: CartItemInput[];
  deliveryMethodId: DeliveryMethodId;
  paymentMethodId: PaymentMethodId;
  address: ShippingAddress;
}

export function fetchOrders() {
  return useNuxtApp().$api<OrderListItem[]>("/orders");
}

export function fetchOrder(id: string) {
  return useNuxtApp().$api<Order>(`/orders/${id}`);
}

export function fetchOrderTracking(id: string) {
  return useNuxtApp().$api<OrderTracking>(`/orders/${id}/tracking`);
}

export function createOrder(payload: CreateOrderPayload) {
  return useNuxtApp().$api<Order>("/orders", { method: "POST", body: payload });
}

export function cancelOrder(id: string) {
  return useNuxtApp().$api<Order>(`/orders/${id}/cancel`, { method: "POST" });
}
