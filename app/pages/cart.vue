<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useCartPreview } from "~/composables/useCartPreview";

const cart = useCartStore();
const { preview, isLoading, error, refresh } = useCartPreview();

const hasUnavailable = computed(() => preview.value.unavailableCount > 0);

useSeo({
  title: "Your cart",
  description: "Review the devices in your cart and continue to checkout.",
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <header class="mb-8">
      <p class="iz-eyebrow">Cart</p>
      <h1 class="iz-h1 mt-3">Your cart</h1>
    </header>

    <ClientOnly>
      <template #fallback>
        <div class="iz-shimmer h-40 rounded-2xl" aria-hidden="true" />
      </template>

      <UiStateBlock
        v-if="error"
        tone="error"
        title="We could not price your cart"
        description="The store is temporarily unreachable. Your items are still saved."
      >
        <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
      </UiStateBlock>

      <UiStateBlock
        v-else-if="cart.isEmpty"
        title="Your cart is empty"
        description="Add a device from the catalogue to continue."
      >
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse devices</NuxtLink>
      </UiStateBlock>

      <div v-else class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ul class="flex flex-col gap-3" :aria-busy="isLoading">
          <CartLine
            v-for="line in preview.lines"
            :key="line.productId + line.variantId"
            :line="line"
            @update:quantity="cart.setQuantity(line.productId, line.variantId, $event)"
            @remove="cart.remove(line.productId, line.variantId)"
          />
        </ul>

        <aside class="lg:sticky lg:top-24">
          <CartSummary :totals="preview.totals" delivery-hint="Chosen at checkout">
            <p v-if="hasUnavailable" class="iz-error">
              Remove the out-of-stock items before continuing to checkout.
            </p>

            <NuxtLink
              to="/checkout"
              class="iz-btn iz-btn--solid iz-btn--block"
              :class="{ 'pointer-events-none': hasUnavailable }"
              :aria-disabled="hasUnavailable"
              data-testid="go-to-checkout"
            >
              Continue to checkout
            </NuxtLink>

            <NuxtLink to="/shop" class="iz-btn iz-btn--quiet iz-btn--block">Keep shopping</NuxtLink>
          </CartSummary>
        </aside>
      </div>
    </ClientOnly>
  </div>
</template>
