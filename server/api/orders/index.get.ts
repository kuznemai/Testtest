import type { OrderListItem } from "#shared/types";
import { db } from "~~/server/utils/db";
import { requireUser } from "~~/server/utils/session";

/** GET /api/orders — the signed-in user's orders, newest first. */
export default defineEventHandler((event): OrderListItem[] => {
  const user = requireUser(event);

  return db.orders
    .filter((order) => order.userId === user.id)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((order) => ({
      id: order.id,
      number: order.number,
      createdAt: order.createdAt,
      status: order.status,
      totalCents: order.totals.totalCents,
      currency: order.totals.currency,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      previewImages: order.items.slice(0, 3).map((item) => item.image),
    }));
});
