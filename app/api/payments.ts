import type { Payment, PaymentStatus } from "#shared/types";

export function createPayment(orderId: string) {
  return useNuxtApp().$api<Payment>("/payments", { method: "POST", body: { orderId } });
}

export function fetchPayment(id: string) {
  return useNuxtApp().$api<Payment>(`/payments/${id}`);
}

/**
 * Stands in for the provider callback. With a real PSP the shopper leaves the site
 * and the backend receives a webhook instead — this call disappears.
 */
export function completePayment(
  id: string,
  outcome: Extract<PaymentStatus, "paid" | "failed" | "cancelled">,
) {
  return useNuxtApp().$api<Payment>(`/payments/${id}/complete`, { method: "POST", body: { outcome } });
}
