import type { Payment, PaymentStatus } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

const OUTCOMES: PaymentStatus[] = ["paid", "failed", "cancelled"];

/**
 * POST /api/payments/:id/complete { outcome }
 *
 * Simulates the callback a payment provider would send to the backend. It exists
 * only so the success / failure / cancelled screens are reachable without a PSP.
 */
export default defineEventHandler(async (event): Promise<Payment> => {
  const user = requireUser(event);
  const id = getRouterParam(event, "id");
  const body = await readBody<{ outcome?: PaymentStatus }>(event);

  const payment = db.payments.find((candidate) => candidate.id === id);
  const order = payment && db.orders.find((candidate) => candidate.id === payment.orderId);

  if (!payment || !order || order.userId !== user.id) {
    throw createError({ statusCode: 404, statusMessage: "Payment not found" });
  }
  if (payment.status !== "pending") {
    throw createError({ statusCode: 409, statusMessage: "This payment is already closed" });
  }

  const outcome = OUTCOMES.includes(body?.outcome as PaymentStatus) ? body!.outcome! : "failed";
  const now = new Date().toISOString();

  payment.status = outcome;
  payment.updatedAt = now;
  order.payment.status = outcome;
  order.updatedAt = now;

  if (outcome === "paid") order.status = "paid";
  else if (outcome === "cancelled") order.status = "awaiting_payment";

  return payment;
});
