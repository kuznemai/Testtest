import type { Product } from "#shared/types";
import { db } from "~~/server/utils/db";

/** GET /api/products/:slug */
export default defineEventHandler((event): Product => {
  const slug = getRouterParam(event, "slug");
  const product = db.products.find((candidate) => candidate.slug === slug);

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: "Product not found" });
  }
  return product;
});
