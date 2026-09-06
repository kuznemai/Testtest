<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const orderId = computed(() => (typeof route.query.order === "string" ? route.query.order : ""));

useSeo({ title: "Payment pending", description: "The payment has not been completed yet." });
</script>

<template>
  <PaymentResult
    tone="pending"
    eyebrow="Payment"
    title="Payment not completed"
    description="You left the payment page before it finished. The order is waiting — you can pay it any time from the order page."
    :order-id="orderId"
  />
</template>
