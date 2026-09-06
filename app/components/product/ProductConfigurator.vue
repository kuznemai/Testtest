<script setup lang="ts">
import type { ProductVariant } from "#shared/types";
import { formatPrice } from "~/utils/format";

const props = defineProps<{
  variants: ProductVariant[];
  modelValue: string;
}>();

const emit = defineEmits<{ "update:modelValue": [variantId: string] }>();

const selected = computed(() => props.variants.find((variant) => variant.id === props.modelValue));

const storages = computed(() => [...new Set(props.variants.map((variant) => variant.storageGb))].sort((a, b) => a - b));

const colors = computed(() => {
  const seen = new Map<string, { color: string; colorHex: string }>();
  for (const variant of props.variants) {
    if (!seen.has(variant.color)) seen.set(variant.color, { color: variant.color, colorHex: variant.colorHex });
  }
  return [...seen.values()];
});

function variantFor(storageGb: number, color: string): ProductVariant | undefined {
  return props.variants.find((variant) => variant.storageGb === storageGb && variant.color === color);
}

/** Keeps the other axis fixed when one is changed, falling back to any match. */
function selectStorage(storageGb: number): void {
  const next = variantFor(storageGb, selected.value?.color ?? "") ?? props.variants.find((v) => v.storageGb === storageGb);
  if (next) emit("update:modelValue", next.id);
}

function selectColor(color: string): void {
  const next = variantFor(selected.value?.storageGb ?? 0, color) ?? props.variants.find((v) => v.color === color);
  if (next) emit("update:modelValue", next.id);
}

function storagePrice(storageGb: number): number {
  const matches = props.variants.filter((variant) => variant.storageGb === storageGb);
  return Math.min(...matches.map((variant) => variant.priceCents));
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <fieldset>
      <legend class="iz-label">Storage</legend>
      <div class="options">
        <button
          v-for="storageGb in storages"
          :key="storageGb"
          type="button"
          class="option"
          :class="{ 'option--active': selected?.storageGb === storageGb }"
          :aria-pressed="selected?.storageGb === storageGb"
          @click="selectStorage(storageGb)"
        >
          <span class="option__title">{{ storageGb }} GB</span>
          <span class="option__meta">{{ formatPrice(storagePrice(storageGb)) }}</span>
        </button>
      </div>
    </fieldset>

    <fieldset>
      <legend class="iz-label">Colour</legend>
      <div class="options">
        <button
          v-for="color in colors"
          :key="color.color"
          type="button"
          class="option"
          :class="{
            'option--active': selected?.color === color.color,
            'option--unavailable': !variantFor(selected?.storageGb ?? 0, color.color),
          }"
          :aria-pressed="selected?.color === color.color"
          @click="selectColor(color.color)"
        >
          <span class="swatch" :style="{ background: color.colorHex }" aria-hidden="true" />
          <span class="option__title">{{ color.color }}</span>
        </button>
      </div>
    </fieldset>

    <p v-if="selected" class="availability" :class="selected.stock > 0 ? 'availability--in' : 'availability--out'">
      <span class="availability__dot" aria-hidden="true" />
      <template v-if="selected.stock > 5">In stock, ships within 24 hours</template>
      <template v-else-if="selected.stock > 0">Only {{ selected.stock }} left in stock</template>
      <template v-else>This configuration is out of stock</template>
    </p>
  </div>
</template>

<style scoped>
fieldset {
  border: 0;
  padding: 0;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.option {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 1rem;
  border: 1px solid var(--iz-border);
  border-radius: 0.8rem;
  background: rgb(255 255 255 / 0.02);
  color: #dfe8f2;
  text-align: left;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.option:hover {
  border-color: rgb(255 255 255 / 0.22);
}

.option--active {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.1);
  color: #fff;
}

/* The combination does not exist; clicking still switches to the nearest match. */
.option--unavailable .option__title {
  opacity: 0.55;
}

.option__title {
  font-size: 0.92rem;
  font-weight: 500;
}

.option__meta {
  color: var(--iz-muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.swatch {
  height: 1.1rem;
  width: 1.1rem;
  border: 1px solid rgb(255 255 255 / 0.35);
  border-radius: 999px;
}

.availability {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.88rem;
}

.availability--in {
  color: #6ee7b7;
}

.availability--out {
  color: #fca5a5;
}

.availability__dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 999px;
  background: currentColor;
}
</style>
