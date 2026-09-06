<script setup lang="ts">
import { fetchOrders } from "~/api/orders";
import { formatDate, formatPrice } from "~/utils/format";

definePageMeta({ middleware: "auth" });

const { data: orders, status, error, refresh } = await useAsyncData("profile-orders", fetchOrders, {
  default: () => [],
});

useSeo({ title: "My orders", description: "Every order you placed with IZ, with its current status." });
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <header class="mb-8">
      <p class="iz-eyebrow">Account</p>
      <h1 class="iz-h1 mt-3">My orders</h1>
    </header>

    <ProfileNav />

    <div class="mt-8">
      <UiStateBlock
        v-if="error"
        tone="error"
        title="We could not load your orders"
        description="The store is temporarily unreachable."
      >
        <button type="button" class="iz-btn iz-btn--solid" @click="refresh()">Try again</button>
      </UiStateBlock>

      <div v-else-if="status === 'pending'" class="flex flex-col gap-3" aria-busy="true">
        <div v-for="n in 3" :key="n" class="iz-shimmer h-24 rounded-2xl" />
      </div>

      <UiStateBlock
        v-else-if="orders.length === 0"
        title="No orders yet"
        description="Once you place an order it will show up here with its delivery status."
      >
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse devices</NuxtLink>
      </UiStateBlock>

      <ul v-else class="flex flex-col gap-3">
        <li v-for="order in orders" :key="order.id">
          <NuxtLink :to="`/profile/orders/${order.id}`" class="order-row" :data-testid="`order-${order.number}`">
            <div class="order-row__previews" aria-hidden="true">
              <img v-for="(image, index) in order.previewImages" :key="index" :src="image" alt="" width="32" height="42" loading="lazy" >
            </div>

            <div class="min-w-0 flex-1">
              <p class="order-row__number">{{ order.number }}</p>
              <p class="order-row__meta">
                {{ formatDate(order.createdAt) }} · {{ order.itemCount }}
                {{ order.itemCount === 1 ? "item" : "items" }}
              </p>
            </div>

            <OrderStatusBadge :status="order.status" />

            <p class="order-row__total">{{ formatPrice(order.totalCents, order.currency) }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.order-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1rem;
  background: rgb(255 255 255 / 0.02);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.order-row:hover {
  border-color: rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.04);
}

.order-row__previews {
  display: flex;
  gap: 0.35rem;
}

.order-row__previews img {
  height: 2.6rem;
  width: 2rem;
  border-radius: 0.4rem;
  background: #000;
  object-fit: contain;
}

.order-row__number {
  color: #fff;
  font-size: 0.98rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.order-row__meta {
  margin-top: 0.15rem;
  color: var(--iz-muted);
  font-size: 0.82rem;
}

.order-row__total {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 480px) {
  .order-row__total {
    margin-left: auto;
  }
}
</style>
