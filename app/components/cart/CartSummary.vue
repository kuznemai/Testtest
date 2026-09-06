<script setup lang="ts">
import type { CartTotals } from "#shared/types";
import { formatPrice } from "~/utils/format";

withDefaults(
  defineProps<{
    totals: CartTotals;
    title?: string;
    deliveryHint?: string;
  }>(),
  { title: "Summary", deliveryHint: "" },
);
</script>

<template>
  <div class="summary">
    <h2 class="summary__title">{{ title }}</h2>

    <dl class="summary__rows">
      <div class="summary__row">
        <dt>Subtotal</dt>
        <dd>{{ formatPrice(totals.subtotalCents, totals.currency) }}</dd>
      </div>
      <div class="summary__row">
        <dt>Delivery</dt>
        <dd>
          <template v-if="totals.deliveryCents > 0">{{ formatPrice(totals.deliveryCents, totals.currency) }}</template>
          <template v-else>{{ deliveryHint || "Free" }}</template>
        </dd>
      </div>
      <div v-if="totals.discountCents > 0" class="summary__row">
        <dt>Discount</dt>
        <dd>−{{ formatPrice(totals.discountCents, totals.currency) }}</dd>
      </div>
    </dl>

    <div class="summary__total">
      <span>Total</span>
      <span data-testid="cart-total">{{ formatPrice(totals.totalCents, totals.currency) }}</span>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.15rem, 2vw, 1.6rem);
  border: 1px solid var(--iz-border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.04), rgb(255 255 255 / 0.012));
}

.summary__title {
  color: var(--iz-muted);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.summary__rows {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.summary__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  color: var(--iz-muted);
  font-size: 0.9rem;
}

.summary__row dd {
  color: #e7eef6;
  font-variant-numeric: tabular-nums;
}

.summary__total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--iz-border-soft);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
