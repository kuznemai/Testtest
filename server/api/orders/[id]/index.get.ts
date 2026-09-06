import type { Order } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

/** GET /api/orders/:id */
export default defineEventHandler((event): Order => {
  const user = requireUser(event);
  const id = getRouterParam(event, "id");
  const order = db.orders.find((candidate) => candidate.id === id && candidate.userId === user.id);

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  return order;
});
