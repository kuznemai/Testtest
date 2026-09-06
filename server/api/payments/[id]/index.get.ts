import type { Payment } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

/** GET /api/payments/:id */
export default defineEventHandler((event): Payment => {
  const user = requireUser(event);
  const id = getRouterParam(event, "id");
  const payment = db.payments.find((candidate) => candidate.id === id);
  const order = payment && db.orders.find((candidate) => candidate.id === payment.orderId);

  if (!payment || !order || order.userId !== user.id) {
    throw createError({ statusCode: 404, statusMessage: "Payment not found" });
  }
  return payment;
});
