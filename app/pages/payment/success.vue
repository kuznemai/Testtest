<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const orderId = computed(() => (typeof route.query.order === "string" ? route.query.order : ""));

useSeo({ title: "Payment successful", description: "Your payment went through and the order is confirmed." });
</script>

<template>
  <PaymentResult
    tone="success"
    eyebrow="Payment"
    title="Payment received"
    description="Your order is confirmed. We are preparing the device and will email you when it ships."
    :order-id="orderId"
  >
    <NuxtLink v-if="orderId" :to="`/profile/orders/${orderId}`" class="iz-btn iz-btn--solid" data-testid="view-order">
      View order
    </NuxtLink>
    <NuxtLink v-if="orderId" :to="`/profile/orders/${orderId}/tracking`" class="iz-btn iz-btn--ghost">
      Track delivery
    </NuxtLink>
    <NuxtLink v-else to="/profile/orders" class="iz-btn iz-btn--solid">My orders</NuxtLink>
  </PaymentResult>
</template>
