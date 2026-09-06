<script setup lang="ts">
import type { ProductSort } from "~/api/products";
import { fetchProducts } from "~/api/products";

const route = useRoute();
const router = useRouter();

const search = ref(typeof route.query.q === "string" ? route.query.q : "");
const sort = ref<ProductSort>(
  (["title", "price", "-price"] as const).includes(route.query.sort as ProductSort)
    ? (route.query.sort as ProductSort)
    : "title",
);

// Debounced so typing does not fire a request per keystroke.
const debouncedSearch = ref(search.value);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(search, (value) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = value;
  }, 300);
});

onBeforeUnmount(() => clearTimeout(debounceTimer));

// Keep the URL shareable and back-button friendly.
watch([debouncedSearch, sort], ([q, sortBy]) => {
  router.replace({
    query: {
      ...(q ? { q } : {}),
      ...(sortBy !== "title" ? { sort: sortBy } : {}),
    },
  });
});

const { data, status, error, refresh } = await useAsyncData(
  "shop-products",
  () => fetchProducts({ search: debouncedSearch.value || undefined, sort: sort.value }),
  { watch: [debouncedSearch, sort] },
);

const products = computed(() => data.value?.items ?? []);
const isLoading = computed(() => status.value === "pending");

function resetFilters(): void {
  search.value = "";
  debouncedSearch.value = "";
  sort.value = "title";
}

useSeo({
  title: "Devices",
  description: "Every IZ smartphone: hardened hardware, a privacy-first OS and five years of security updates.",
});
</script>

<template>
  <div class="iz-wrap iz-page">
    <header class="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="iz-eyebrow">Catalogue</p>
        <h1 class="iz-h1 mt-3">Our devices</h1>
        <p class="mt-3 max-w-xl text-sm text-[var(--iz-muted)] sm:text-base">
          Every model runs IZ OS with the same security guarantees. Pick the size and storage that fit you.
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="w-full sm:w-56">
          <label class="iz-label" for="shop-sort">Sort by</label>
          <select id="shop-sort" v-model="sort" class="iz-input">
            <option value="title">Name</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
          </select>
        </div>

        <div class="w-full sm:w-64">
          <label class="iz-label" for="shop-search">Search</label>
          <input
            id="shop-search"
            v-model="search"
            class="iz-input"
            type="search"
            placeholder="Find a device…"
            autocomplete="off"
          >
        </div>
      </div>
    </header>

    <UiStateBlock
      v-if="error"
      tone="error"
      title="We could not load the catalogue"
      description="The store is temporarily unreachable. Please try again."
    >
      <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
    </UiStateBlock>

    <ProductGrid v-else :products="products" :loading="isLoading">
      <template #empty>
        <UiStateBlock title="No devices found" description="Try a different search term or clear the filters.">
          <button type="button" class="iz-btn iz-btn--ghost" @click="resetFilters">Clear filters</button>
        </UiStateBlock>
      </template>
    </ProductGrid>
  </div>
</template>
