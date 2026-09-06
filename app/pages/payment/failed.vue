<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const orderId = computed(() => (typeof route.query.order === "string" ? route.query.order : ""));

useSeo({ title: "Payment failed", description: "The payment was declined. Your order is still waiting to be paid." });
</script>

<template>
  <PaymentResult
    tone="error"
    eyebrow="Payment"
    title="Payment declined"
    description="The provider declined the payment and nothing was charged. Your order is kept for 24 hours, so you can try again with another method."
  >
    <NuxtLink v-if="orderId" :to="`/profile/orders/${orderId}`" class="iz-btn iz-btn--solid" data-testid="retry-payment">
      Back to order
    </NuxtLink>
    <NuxtLink to="/profile/orders" class="iz-btn iz-btn--ghost">My orders</NuxtLink>
  </PaymentResult>
</template>
