import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";

/** Browser storage only exists on the client, so restoring/saving happens here. */
export default defineNuxtPlugin(() => {
  const cart = useCartStore();
  const favorites = useFavoritesStore();

  cart.hydrate();
  favorites.hydrate();

  watch(() => cart.items, () => cart.persist(), { deep: true });
  watch(() => favorites.ids, () => favorites.persist(), { deep: true });
});
