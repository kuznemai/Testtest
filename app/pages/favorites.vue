<script setup lang="ts">
import { fetchProducts } from "~/api/products";
import { useFavoritesStore } from "~/stores/favorites";

const favorites = useFavoritesStore();

// The whole catalogue is a handful of devices, so one request is cheaper than a
// dedicated endpoint; filtering happens locally against the saved ids.
const { data, status, error, refresh } = await useAsyncData("favorites-catalogue", () => fetchProducts(), {
  default: () => ({ items: [], total: 0 }),
});

const saved = computed(() => (data.value?.items ?? []).filter((product) => favorites.has(product.id)));

useSeo({ title: "Saved devices", description: "The IZ devices you saved for later." });
</script>

<template>
  <div class="iz-wrap iz-page">
    <header class="mb-8">
      <p class="iz-eyebrow">Saved</p>
      <h1 class="iz-h1 mt-3">Saved devices</h1>
      <p class="mt-3 max-w-xl text-sm text-[var(--iz-muted)]">
        Saved devices live in this browser only — they are not tied to your account.
      </p>
    </header>

    <UiStateBlock
      v-if="error"
      tone="error"
      title="We could not load your saved devices"
      description="The store is temporarily unreachable."
    >
      <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
    </UiStateBlock>

    <ClientOnly v-else>
      <template #fallback>
        <ProductGrid :products="[]" loading />
      </template>

      <ProductGrid :products="saved" :loading="status === 'pending'">
        <template #empty>
          <UiStateBlock
            title="Nothing saved yet"
            description="Tap the heart on a device to keep it here for later."
          >
            <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse devices</NuxtLink>
          </UiStateBlock>
        </template>
      </ProductGrid>
    </ClientOnly>
  </div>
</template>
