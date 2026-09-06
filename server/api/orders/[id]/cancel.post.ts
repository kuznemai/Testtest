import type { Order } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

const CANCELLABLE: Order["status"][] = ["created", "awaiting_payment"];

/** POST /api/orders/:id/cancel */
export default defineEventHandler((event): Order => {
  const user = requireUser(event);
  const id = getRouterParam(event, "id");
  const order = db.orders.find((candidate) => candidate.id === id && candidate.userId === user.id);

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  if (!CANCELLABLE.includes(order.status)) {
    throw createError({ statusCode: 409, statusMessage: "This order can no longer be cancelled" });
  }

  order.status = "cancelled";
  order.payment.status = "cancelled";
  order.updatedAt = new Date().toISOString();

  const payment = db.payments.find((candidate) => candidate.id === order.payment.paymentId);
  if (payment && payment.status === "pending") {
    payment.status = "cancelled";
    payment.updatedAt = order.updatedAt;
  }

  return order;
});
