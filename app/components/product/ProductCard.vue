<script setup lang="ts">
import type { ProductListItem } from "#shared/types";
import { formatPrice } from "~/utils/format";
import { useFavoritesStore } from "~/stores/favorites";

const props = defineProps<{ product: ProductListItem }>();

const favorites = useFavoritesStore();
const isSaved = computed(() => favorites.has(props.product.id));
</script>

<template>
  <article class="card">
    <NuxtLink :to="`/product/${product.slug}`" class="card__media">
      <img
        :src="assetUrl(product.image)"
        :alt="product.title"
        width="240"
        height="320"
        loading="lazy"
        decoding="async"
      >
      <span v-if="product.badge" class="card__badge">{{ product.badge }}</span>
      <span v-if="!product.inStock" class="card__badge card__badge--muted">Out of stock</span>
    </NuxtLink>

    <ClientOnly>
      <button
        type="button"
        class="card__fav"
        :class="{ 'card__fav--on': isSaved }"
        :aria-pressed="isSaved"
        :aria-label="isSaved ? `Remove ${product.title} from saved` : `Save ${product.title}`"
        @click="favorites.toggle(product.id)"
      >
        <svg viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" aria-hidden="true">
          <path
            d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </ClientOnly>

    <div class="card__body">
      <h3 class="card__title">
        <NuxtLink :to="`/product/${product.slug}`">{{ product.title }}</NuxtLink>
      </h3>
      <p class="card__tagline">{{ product.tagline }}</p>

      <div class="card__foot">
        <p class="card__price">
          <span class="card__price-label">From</span>
          <span class="card__price-value">{{ formatPrice(product.fromPriceCents) }}</span>
        </p>
        <NuxtLink :to="`/product/${product.slug}`" class="iz-btn iz-btn--ghost card__cta">
          {{ product.inStock ? "Configure" : "Details" }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.1rem;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.035), rgb(255 255 255 / 0.01));
  transition:
    border-color 0.25s ease,
    transform 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgb(255 255 255 / 0.16);
}

.card__media {
  position: relative;
  display: flex;
  aspect-ratio: 4 / 3;
  align-items: center;
  justify-content: center;
  background: #000;
}

.card__media img {
  max-height: 100%;
  width: auto;
  object-fit: contain;
}

.card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid rgb(143 192 238 / 0.35);
  border-radius: 999px;
  background: rgb(10 20 40 / 0.75);
  color: var(--iz-accent);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card__badge--muted {
  top: auto;
  bottom: 0.75rem;
  border-color: rgb(255 255 255 / 0.16);
  color: #9aa8b8;
}

.card__fav {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgb(5 8 15 / 0.6);
  color: #9aa8b8;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.card__fav:hover {
  color: #fff;
  background: rgb(5 8 15 / 0.85);
}

.card__fav--on {
  color: #f87171;
}

.card__fav svg {
  width: 1.3rem;
  height: 1.3rem;
}

.card__body {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem 1.15rem;
}

.card__title {
  color: #fff;
  font-size: 1.02rem;
  font-weight: 600;
}

.card__tagline {
  color: var(--iz-muted);
  font-size: 0.83rem;
  font-weight: 300;
  line-height: 1.45;
}

.card__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.card__price-label {
  display: block;
  color: #6f8095;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.card__price-value {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.card__cta {
  min-height: 2.5rem;
  padding: 0.55rem 1.15rem;
  font-size: 0.85rem;
}
</style>
