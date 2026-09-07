<script setup lang="ts">
import type { CartLine } from "#shared/types";
import { formatPrice } from "~/utils/format";

defineProps<{ line: CartLine; readonly?: boolean }>();

const emit = defineEmits<{
  "update:quantity": [quantity: number];
  remove: [];
}>();
</script>

<template>
  <li class="line" :class="{ 'line--unavailable': !line.available }">
    <NuxtLink :to="`/product/${line.slug}`" class="line__media">
      <img :src="assetUrl(line.image)" :alt="line.title" width="72" height="96" loading="lazy" >
    </NuxtLink>

    <div class="line__body">
      <div class="line__head">
        <div class="min-w-0">
          <h3 class="line__title">
            <NuxtLink :to="`/product/${line.slug}`">{{ line.title }}</NuxtLink>
          </h3>
          <p class="line__variant">{{ line.variantLabel }}</p>
          <p v-if="!line.available" class="line__warning">Out of stock — remove it to continue</p>
        </div>

        <p class="line__total">{{ formatPrice(line.available ? line.lineTotalCents : 0) }}</p>
      </div>

      <div v-if="!readonly" class="line__controls">
        <UiQuantityStepper
          :model-value="line.quantity"
          :max="Math.max(1, line.maxQuantity)"
          @update:model-value="emit('update:quantity', $event)"
        />
        <span class="line__unit">{{ formatPrice(line.unitPriceCents) }} each</span>
        <button type="button" class="line__remove" :aria-label="`Remove ${line.title}`" @click="emit('remove')">
          Remove
        </button>
      </div>

      <p v-else class="line__unit">{{ line.quantity }} × {{ formatPrice(line.unitPriceCents) }}</p>
    </div>
  </li>
</template>

<style scoped>
.line {
  display: flex;
  gap: clamp(0.85rem, 2vw, 1.5rem);
  padding: clamp(0.9rem, 2vw, 1.35rem);
  border: 1px solid var(--iz-border-soft);
  border-radius: 1rem;
  background: rgb(255 255 255 / 0.02);
}

.line--unavailable {
  border-color: rgb(248 113 113 / 0.3);
}

.line__media {
  display: flex;
  height: 6rem;
  width: 4.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.7rem;
  background: #000;
}

.line__media img {
  max-height: 90%;
  max-width: 90%;
  width: auto;
  object-fit: contain;
}

.line__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.9rem;
}

.line__head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.line__title {
  color: #fff;
  font-size: 0.98rem;
  font-weight: 500;
}

.line__variant {
  margin-top: 0.2rem;
  color: var(--iz-muted);
  font-size: 0.83rem;
}

.line__warning {
  margin-top: 0.35rem;
  color: #fca5a5;
  font-size: 0.8rem;
}

.line__total {
  flex-shrink: 0;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.line__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.line__unit {
  color: var(--iz-muted);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

.line__remove {
  margin-left: auto;
  min-height: 2.25rem;
  padding-inline: 0.5rem;
  color: #7e93a9;
  font-size: 0.82rem;
  transition: color 0.2s ease;
}

.line__remove:hover {
  color: #fca5a5;
}

@media (max-width: 480px) {
  .line__head {
    flex-direction: column;
    gap: 0.5rem;
  }

  .line__remove {
    margin-left: 0;
  }
}
</style>
