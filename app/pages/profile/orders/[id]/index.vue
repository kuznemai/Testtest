<script setup lang="ts">
import { cancelOrder, fetchOrder } from "~/api/orders";
import { createPayment } from "~/api/payments";
import { formatDateTime, formatEta, formatPrice, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "~/utils/format";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const orderId = computed(() => String(route.params.id));

const { data: order, error, refresh } = await useAsyncData(
  () => `order-${orderId.value}`,
  () => fetchOrder(orderId.value),
  { watch: [orderId] },
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: "Order not found", fatal: true });
}

const actionError = ref("");
const isWorking = ref(false);

const canPay = computed(
  () => order.value?.status === "awaiting_payment" && order.value.payment.methodId !== "on_delivery",
);
const canCancel = computed(() => order.value?.status === "created" || order.value?.status === "awaiting_payment");

async function payNow(): Promise<void> {
  if (!order.value || isWorking.value) return;
  actionError.value = "";
  isWorking.value = true;
  try {
    const payment = await createPayment(order.value.id);
    await navigateTo(payment.redirectUrl);
  } catch (err) {
    actionError.value = toApiFailure(err, "We could not start the payment.").message;
  } finally {
    isWorking.value = false;
  }
}

async function cancel(): Promise<void> {
  if (!order.value || isWorking.value) return;
  actionError.value = "";
  isWorking.value = true;
  try {
    await cancelOrder(order.value.id);
    await refresh();
  } catch (err) {
    actionError.value = toApiFailure(err, "We could not cancel this order.").message;
  } finally {
    isWorking.value = false;
  }
}

useSeo({
  title: order.value ? `Order ${order.value.number}` : "Order",
  description: "Order contents, delivery details and payment status.",
});
</script>

<template>
  <div v-if="order" class="iz-wrap iz-wrap--narrow iz-page">
    <NuxtLink to="/profile/orders" class="mb-6 inline-flex items-center gap-2 text-sm text-[var(--iz-muted)] hover:text-white">
      <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
        <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      All orders
    </NuxtLink>

    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="iz-eyebrow">Order</p>
        <h1 class="iz-h1 mt-3 tabular-nums">{{ order.number }}</h1>
        <p class="mt-2 text-sm text-[var(--iz-muted)]">Placed {{ formatDateTime(order.createdAt) }}</p>
      </div>
      <OrderStatusBadge :status="order.status" />
    </header>

    <p v-if="actionError" class="iz-error mt-4" role="alert">{{ actionError }}</p>

    <div class="mt-6 flex flex-wrap gap-3">
      <button v-if="canPay" type="button" class="iz-btn iz-btn--solid" :disabled="isWorking" @click="payNow">
        {{ isWorking ? "Opening payment…" : "Pay now" }}
      </button>
      <NuxtLink :to="`/profile/orders/${order.id}/tracking`" class="iz-btn iz-btn--ghost" data-testid="open-tracking">
        Track delivery
      </NuxtLink>
      <button v-if="canCancel" type="button" class="iz-btn iz-btn--danger" :disabled="isWorking" @click="cancel">
        Cancel order
      </button>
    </div>

    <div class="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section>
        <h2 class="iz-label">Items</h2>
        <ul class="mt-3 flex flex-col gap-3">
          <li v-for="item in order.items" :key="item.variantId" class="flex items-center gap-4 rounded-xl border border-[var(--iz-border-soft)] bg-white/2 p-3">
            <img :src="item.image" :alt="item.title" width="48" height="64" loading="lazy" class="h-16 w-12 rounded-lg bg-black object-contain" >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-white">{{ item.title }}</p>
              <p class="text-xs text-[var(--iz-muted)]">{{ item.variantLabel }} · {{ item.quantity }} pc</p>
            </div>
            <p class="shrink-0 text-sm font-semibold text-white tabular-nums">{{ formatPrice(item.lineTotalCents) }}</p>
          </li>
        </ul>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 class="iz-label">Delivery</h2>
            <p class="mt-2 text-sm text-zinc-200">{{ order.delivery.title }}</p>
            <p class="text-xs text-[var(--iz-muted)]">{{ formatEta(order.delivery.etaDaysMin, order.delivery.etaDaysMax) }}</p>
            <address class="mt-3 text-sm leading-relaxed text-[var(--iz-muted)] not-italic">
              {{ order.address.fullName }}<br >
              {{ order.address.street }}<br >
              {{ order.address.city }}, {{ order.address.postalCode }}<br >
              {{ order.address.country }}<br >
              {{ order.address.phone }}
            </address>
            <p v-if="order.address.comment" class="mt-2 text-xs text-[var(--iz-muted)]">“{{ order.address.comment }}”</p>
          </div>

          <div>
            <h2 class="iz-label">Payment</h2>
            <p class="mt-2 text-sm text-zinc-200">{{ PAYMENT_METHOD_LABELS[order.payment.methodId] }}</p>
            <p class="text-xs text-[var(--iz-muted)]">Status: {{ PAYMENT_STATUS_LABELS[order.payment.status] }}</p>
          </div>
        </div>
      </section>

      <aside class="lg:sticky lg:top-24">
        <CartSummary :totals="order.totals" title="Order total" />
      </aside>
    </div>
  </div>
</template>
