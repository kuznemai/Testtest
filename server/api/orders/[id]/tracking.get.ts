import type { OrderTracking } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";
import { buildTracking } from "~~/server/utils/tracking";

/** GET /api/orders/:id/tracking */
export default defineEventHandler((event): OrderTracking => {
  const user = requireUser(event);
  const id = getRouterParam(event, "id");
  const order = db.orders.find((candidate) => candidate.id === id && candidate.userId === user.id);

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  return buildTracking(order);
});
