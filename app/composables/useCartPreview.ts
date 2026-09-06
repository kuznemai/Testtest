import type { CartPreview, DeliveryMethodId } from "#shared/types";
import { previewCart } from "~/api/catalog";
import { useCartStore } from "~/stores/cart";

const EMPTY: CartPreview = {
  lines: [],
  unavailableCount: 0,
  totals: { currency: "USD", subtotalCents: 0, deliveryCents: 0, discountCents: 0, totalCents: 0 },
};

/**
 * Server-priced view of the cart, shared by the cart page and checkout.
 * Client-only: the cart lives in browser storage, so there is nothing to render on
 * the server and no hydration mismatch to guard against.
 */
export function useCartPreview(deliveryMethodId?: Ref<DeliveryMethodId | undefined>) {
  const cart = useCartStore();

  const { data, status, error, refresh } = useAsyncData<CartPreview>(
    "cart-preview",
    () => (cart.items.length === 0 ? Promise.resolve(EMPTY) : previewCart(cart.items, deliveryMethodId?.value)),
    {
      server: false,
      default: () => EMPTY,
      // Quantities mutate in place, so watch a stable serialisation of the cart.
      watch: [() => JSON.stringify(cart.items), () => deliveryMethodId?.value],
    },
  );

  return {
    preview: computed(() => data.value ?? EMPTY),
    isLoading: computed(() => status.value === "pending" && !cart.isEmpty),
    error,
    refresh,
  };
}
