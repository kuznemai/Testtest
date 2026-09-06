import { computed, ref } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "iz.favorites.v1";

/** Saved products. A browser-local preference, never sent to the server. */
export const useFavoritesStore = defineStore("favorites", () => {
  const ids = ref<string[]>([]);
  const isHydrated = ref(false);
  const count = computed(() => ids.value.length);

  function has(productId: string): boolean {
    return ids.value.includes(productId);
  }

  function toggle(productId: string): void {
    ids.value = has(productId) ? ids.value.filter((id) => id !== productId) : [...ids.value, productId];
  }

  function hydrate(): void {
    if (isHydrated.value) return;
    isHydrated.value = true;
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) ids.value = parsed.filter((id): id is string => typeof id === "string");
    } catch {
      ids.value = [];
    }
  }

  function persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value));
    } catch {
      // Ignore storage failures — favourites are a convenience, not state we own.
    }
  }

  return { ids, count, has, toggle, hydrate, persist };
});
