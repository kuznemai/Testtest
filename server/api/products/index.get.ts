import type { ProductListItem } from "#shared/types";
import { db } from "~~/server/utils/db";
import { toListItem } from "~~/server/utils/catalog";

/** GET /api/products?search=&sort=title|price|-price */
export default defineEventHandler((event): { items: ProductListItem[]; total: number } => {
  const { search, sort } = getQuery(event);

  let items = db.products.map(toListItem);

  if (typeof search === "string" && search.trim()) {
    const query = search.trim().toLowerCase();
    items = items.filter(
      (item) => item.title.toLowerCase().includes(query) || item.tagline.toLowerCase().includes(query),
    );
  }

  if (sort === "price") items.sort((a, b) => a.fromPriceCents - b.fromPriceCents);
  else if (sort === "-price") items.sort((a, b) => b.fromPriceCents - a.fromPriceCents);
  else items.sort((a, b) => a.title.localeCompare(b.title));

  return { items, total: items.length };
});
