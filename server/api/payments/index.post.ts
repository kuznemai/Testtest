import type { Payment } from "#shared/types";
import { createId, db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

/**
 * POST /api/payments { orderId }
 *
 * Stands in for "backend asks the PSP to create a payment and returns where to send
 * the shopper". `redirectUrl` points at the in-app mock provider page; with a real
 * provider it becomes an external URL and the frontend flow stays the same.
 */
export default defineEventHandler(async (event): Promise<Payment> => {
  const user = requireUser(event);
  const body = await readBody<{ orderId?: string }>(event);
  const order = db.orders.find(
    (candidate) => candidate.id === body?.orderId && candidate.userId === user.id,
  );

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  if (order.status === "cancelled") {
    throw createError({ statusCode: 409, statusMessage: "This order was cancelled" });
  }
  if (order.payment.status === "paid") {
    throw createError({ statusCode: 409, statusMessage: "This order is already paid" });
  }

  const existing = db.payments.find(
    (candidate) => candidate.orderId === order.id && candidate.status === "pending",
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const payment: Payment = {
    id: createId("pay"),
    orderId: order.id,
    orderNumber: order.number,
    methodId: order.payment.methodId,
    status: "pending",
    amountCents: order.totals.totalCents,
    currency: order.totals.currency,
    redirectUrl: "",
    createdAt: now,
    updatedAt: now,
  };
  payment.redirectUrl = `/payment/${payment.id}`;

  db.payments.push(payment);
  order.payment.paymentId = payment.id;
  order.payment.status = "pending";
  order.status = "awaiting_payment";
  order.updatedAt = now;

  return payment;
});
