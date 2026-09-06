import type { Product, ProductListItem } from "#shared/types";

export type ProductSort = "title" | "price" | "-price";

export interface ProductQuery {
  search?: string;
  sort?: ProductSort;
}

export function fetchProducts(query: ProductQuery = {}) {
  return useNuxtApp().$api<{ items: ProductListItem[]; total: number }>("/products", { query });
}

export function fetchProduct(slug: string) {
  return useNuxtApp().$api<Product>(`/products/${slug}`);
}
