<script setup lang="ts">
import { fetchOrderTracking } from "~/api/orders";
import { formatDate, ORDER_STATUS_LABELS } from "~/utils/format";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const orderId = computed(() => String(route.params.id));

const { data: tracking, status, error, refresh } = await useAsyncData(
  () => `tracking-${orderId.value}`,
  () => fetchOrderTracking(orderId.value),
  { watch: [orderId] },
);

useSeo({
  title: tracking.value ? `Tracking ${tracking.value.orderNumber}` : "Tracking",
  description: "Follow your IZ order from the warehouse to your door.",
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <NuxtLink
      :to="`/profile/orders/${orderId}`"
      class="mb-6 inline-flex items-center gap-2 text-sm text-[var(--iz-muted)] hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
        <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Back to order
    </NuxtLink>

    <UiStateBlock
      v-if="error"
      tone="error"
      title="Tracking is unavailable"
      description="We could not reach the delivery service for this order."
    >
      <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
      <NuxtLink :to="`/profile/orders/${orderId}`" class="iz-btn iz-btn--ghost">Back to order</NuxtLink>
    </UiStateBlock>

    <div v-else-if="status === 'pending'" class="flex flex-col gap-3" aria-busy="true">
      <div v-for="n in 4" :key="n" class="iz-shimmer h-16 rounded-2xl" />
    </div>

    <template v-else-if="tracking">
      <header>
        <p class="iz-eyebrow">Delivery</p>
        <h1 class="iz-h1 mt-3 tabular-nums">{{ tracking.orderNumber }}</h1>
      </header>

      <dl class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="iz-card">
          <dt class="iz-label">Status</dt>
          <dd class="mt-1 text-lg text-white">{{ ORDER_STATUS_LABELS[tracking.status] }}</dd>
        </div>
        <div class="iz-card">
          <dt class="iz-label">Carrier</dt>
          <dd class="mt-1 text-lg text-white">{{ tracking.carrier ?? "Not assigned yet" }}</dd>
          <dd v-if="tracking.trackingNumber" class="mt-1 text-xs text-[var(--iz-muted)] tabular-nums">
            {{ tracking.trackingNumber }}
          </dd>
        </div>
        <div class="iz-card">
          <dt class="iz-label">{{ tracking.status === "delivered" ? "Delivered" : "Expected" }}</dt>
          <dd class="mt-1 text-lg text-white">{{ formatDate(tracking.expectedDeliveryAt) }}</dd>
        </div>
      </dl>

      <section class="mt-9">
        <h2 class="iz-label">History</h2>
        <div class="mt-4">
          <OrderTimeline :events="tracking.events" />
        </div>
      </section>
    </template>
  </div>
</template>
