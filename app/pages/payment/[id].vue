<script setup lang="ts">
import type { PaymentStatus } from "#shared/types";
import { completePayment, fetchPayment } from "~/api/payments";
import { formatPrice, PAYMENT_METHOD_LABELS } from "~/utils/format";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const paymentId = computed(() => String(route.params.id));

const { data: payment, error } = await useAsyncData(
  () => `payment-${paymentId.value}`,
  () => fetchPayment(paymentId.value),
  { watch: [paymentId] },
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: "Payment not found", fatal: true });
}

const actionError = ref("");
const pendingOutcome = ref<PaymentStatus | null>(null);

/**
 * Stands in for a hosted provider page. A real PSP owns this screen and the card
 * form; here the buttons just drive the mock backend to each end state.
 */
async function finish(outcome: "paid" | "failed" | "cancelled"): Promise<void> {
  if (!payment.value || pendingOutcome.value) return;
  actionError.value = "";
  pendingOutcome.value = outcome;

  try {
    await completePayment(payment.value.id, outcome);
    const query = { order: payment.value.orderId, payment: payment.value.id };

    if (outcome === "paid") await navigateTo({ path: "/payment/success", query });
    else if (outcome === "cancelled") await navigateTo({ path: "/payment/pending", query });
    else await navigateTo({ path: "/payment/failed", query });
  } catch (err) {
    actionError.value = toApiFailure(err, "The payment could not be completed.").message;
    pendingOutcome.value = null;
  }
}

useSeo({ title: "Payment", description: "Complete the payment for your IZ order." });
</script>

<template>
  <div v-if="payment" class="iz-wrap iz-page">
    <div class="mx-auto w-full max-w-lg">
      <p class="iz-eyebrow">Payment provider</p>
      <h1 class="iz-h1 mt-3">Confirm your payment</h1>
      <p class="mt-3 text-sm text-[var(--iz-muted)]">
        This screen simulates the provider's hosted page. No card details are collected here or anywhere on
        this site.
      </p>

      <div class="iz-card mt-7 flex flex-col gap-5">
        <dl class="flex flex-col gap-3 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-[var(--iz-muted)]">Order</dt>
            <dd class="tabular-nums text-white">{{ payment.orderNumber }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-[var(--iz-muted)]">Method</dt>
            <dd class="text-white">{{ PAYMENT_METHOD_LABELS[payment.methodId] }}</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 border-t border-[var(--iz-border-soft)] pt-3">
            <dt class="text-white">Amount</dt>
            <dd class="text-xl font-semibold tabular-nums text-white">
              {{ formatPrice(payment.amountCents, payment.currency) }}
            </dd>
          </div>
        </dl>

        <p v-if="actionError" class="iz-error" role="alert">{{ actionError }}</p>

        <div class="flex flex-col gap-3">
          <button
            type="button"
            class="iz-btn iz-btn--solid iz-btn--block"
            :disabled="pendingOutcome !== null"
            data-testid="pay-success"
            @click="finish('paid')"
          >
            {{ pendingOutcome === "paid" ? "Processing…" : `Pay ${formatPrice(payment.amountCents, payment.currency)}` }}
          </button>
          <button
            type="button"
            class="iz-btn iz-btn--ghost iz-btn--block"
            :disabled="pendingOutcome !== null"
            data-testid="pay-fail"
            @click="finish('failed')"
          >
            Simulate a declined payment
          </button>
          <button
            type="button"
            class="iz-btn iz-btn--quiet iz-btn--block"
            :disabled="pendingOutcome !== null"
            @click="finish('cancelled')"
          >
            Cancel and pay later
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
