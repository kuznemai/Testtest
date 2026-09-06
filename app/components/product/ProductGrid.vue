<script setup lang="ts">
import type { ProductListItem } from "#shared/types";

withDefaults(
  defineProps<{
    products: ProductListItem[];
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  { loading: false, skeletonCount: 6 },
);
</script>

<template>
  <div v-if="loading" class="grid" aria-busy="true" aria-label="Loading devices">
    <div v-for="n in skeletonCount" :key="n" class="skeleton">
      <div class="skeleton__media iz-shimmer" />
      <div class="skeleton__body">
        <div class="skeleton__line iz-shimmer" style="width: 70%" />
        <div class="skeleton__line iz-shimmer" style="width: 45%" />
        <div class="skeleton__line iz-shimmer" style="height: 2.25rem; margin-top: 0.75rem" />
      </div>
    </div>
  </div>

  <div v-else-if="products.length > 0" class="grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>

  <slot v-else name="empty" />
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: clamp(0.85rem, 1.6vw, 1.35rem);
}

.skeleton {
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.1rem;
}

.skeleton__media {
  aspect-ratio: 4 / 3;
}

.skeleton__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 1.1rem 1.4rem;
}

.skeleton__line {
  height: 0.8rem;
  border-radius: 0.35rem;
}
</style>
