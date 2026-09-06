import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { CartItemInput } from "#shared/types";

const STORAGE_KEY = "iz.cart.v1";
const MAX_QUANTITY = 10;

function sameLine(item: CartItemInput, productId: string, variantId: string): boolean {
  return item.productId === productId && item.variantId === variantId;
}

/**
 * Holds only ids and quantities — every price the shopper sees comes back from the
 * server (`/api/cart/preview`), so the cart cannot drift out of sync with the catalog.
 */
export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItemInput[]>([]);
  const isHydrated = ref(false);

  const count = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
  const isEmpty = computed(() => items.value.length === 0);

  function quantityOf(productId: string, variantId: string): number {
    return items.value.find((item) => sameLine(item, productId, variantId))?.quantity ?? 0;
  }

  function add(productId: string, variantId: string, quantity = 1): void {
    const existing = items.value.find((item) => sameLine(item, productId, variantId));
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      return;
    }
    items.value.push({ productId, variantId, quantity: Math.min(quantity, MAX_QUANTITY) });
  }

  function setQuantity(productId: string, variantId: string, quantity: number): void {
    const next = Math.min(Math.max(Math.trunc(quantity), 0), MAX_QUANTITY);
    if (next <= 0) {
      remove(productId, variantId);
      return;
    }
    const existing = items.value.find((item) => sameLine(item, productId, variantId));
    if (existing) existing.quantity = next;
  }

  function remove(productId: string, variantId: string): void {
    items.value = items.value.filter((item) => !sameLine(item, productId, variantId));
  }

  function clear(): void {
    items.value = [];
  }

  /** Called from a client-only plugin; localStorage does not exist during SSR. */
  function hydrate(): void {
    if (isHydrated.value) return;
    isHydrated.value = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return;
      items.value = parsed.filter(
        (item): item is CartItemInput =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as CartItemInput).productId === "string" &&
          typeof (item as CartItemInput).variantId === "string" &&
          Number.isFinite((item as CartItemInput).quantity),
      );
    } catch {
      items.value = [];
    }
  }

  function persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    } catch {
      // Private mode or a full quota — the cart still works for this session.
    }
  }

  return {
    items,
    isHydrated,
    count,
    isEmpty,
    quantityOf,
    add,
    setQuantity,
    remove,
    clear,
    hydrate,
    persist,
  };
});
