<script setup lang="ts">
import type { DeliveryMethodId, PaymentMethodId, ShippingAddress } from "#shared/types";
import { fetchDeliveryOptions } from "~/api/catalog";
import { createOrder } from "~/api/orders";
import { createPayment } from "~/api/payments";
import { useCartPreview } from "~/composables/useCartPreview";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { formatEta, formatPrice, PAYMENT_METHOD_LABELS } from "~/utils/format";
import { isFilled, isValidEmail, isValidPhone, normalizePhone } from "~/utils/validation";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "auth" });

const cart = useCartStore();
const auth = useAuthStore();

const deliveryMethodId = ref<DeliveryMethodId>("standard");
const paymentMethodId = ref<PaymentMethodId>("card");

const { data: deliveryOptions } = await useAsyncData("delivery-options", fetchDeliveryOptions, {
  default: () => [],
});

const { preview, isLoading } = useCartPreview(deliveryMethodId);

const PAYMENT_METHODS: { id: PaymentMethodId; description: string }[] = [
  { id: "card", description: "You will be redirected to our payment provider." },
  { id: "crypto", description: "Pay in BTC or a stablecoin via the provider page." },
  { id: "on_delivery", description: "Pay the courier when the device arrives." },
];

const form = reactive({
  fullName: auth.user?.name ?? "",
  phone: auth.user?.phone ?? "",
  email: auth.user?.email ?? "",
  country: "",
  city: "",
  street: "",
  postalCode: "",
  comment: "",
});

const errors = ref<Record<string, string>>({});
const submitError = ref("");
const isSubmitting = ref(false);

function validate(): boolean {
  errors.value = {};

  if (!isFilled(form.fullName, 2)) errors.value.fullName = "Enter the recipient name";
  if (!isValidPhone(form.phone)) errors.value.phone = "Enter a valid phone number";
  if (!isValidEmail(form.email)) errors.value.email = "Enter a valid email address";
  if (!isFilled(form.country)) errors.value.country = "Enter a country";
  if (!isFilled(form.city)) errors.value.city = "Enter a city";
  if (!isFilled(form.street, 4)) errors.value.street = "Enter a street and building";
  if (!isFilled(form.postalCode)) errors.value.postalCode = "Enter a postal code";

  return Object.keys(errors.value).length === 0;
}

const canSubmit = computed(
  () => !cart.isEmpty && preview.value.unavailableCount === 0 && !isSubmitting.value,
);

async function submit(): Promise<void> {
  submitError.value = "";
  if (!validate() || !canSubmit.value) return;

  isSubmitting.value = true;
  try {
    const address: ShippingAddress = {
      fullName: form.fullName.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim(),
      country: form.country.trim(),
      city: form.city.trim(),
      street: form.street.trim(),
      postalCode: form.postalCode.trim(),
      comment: form.comment.trim() || undefined,
    };

    const order = await createOrder({
      items: cart.items,
      deliveryMethodId: deliveryMethodId.value,
      paymentMethodId: paymentMethodId.value,
      address,
    });

    cart.clear();

    if (paymentMethodId.value === "on_delivery") {
      await navigateTo(`/profile/orders/${order.id}`);
      return;
    }

    const payment = await createPayment(order.id);
    await navigateTo(payment.redirectUrl);
  } catch (error) {
    const failure = toApiFailure(error, "We could not place your order. Please try again.");
    errors.value = { ...errors.value, ...failure.fields };
    submitError.value = failure.message;
  } finally {
    isSubmitting.value = false;
  }
}

useSeo({ title: "Checkout", description: "Delivery details and payment for your IZ order." });
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <header class="mb-8">
      <p class="iz-eyebrow">Checkout</p>
      <h1 class="iz-h1 mt-3">Delivery and payment</h1>
    </header>

    <ClientOnly>
      <template #fallback>
        <div class="iz-shimmer h-40 rounded-2xl" aria-hidden="true" />
      </template>

      <UiStateBlock
        v-if="cart.isEmpty"
        title="Your cart is empty"
        description="Add a device before checking out."
      >
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse devices</NuxtLink>
      </UiStateBlock>

      <form v-else class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start" novalidate @submit.prevent="submit">
        <div class="flex flex-col gap-8">
          <section class="iz-card">
            <h2 class="iz-label">Recipient</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <UiFormField id="co-name" v-model="form.fullName" label="Full name" autocomplete="name" :error="errors.fullName" required />
              <UiFormField id="co-phone" v-model="form.phone" label="Phone" type="tel" inputmode="tel" autocomplete="tel" :error="errors.phone" required />
              <UiFormField id="co-email" v-model="form.email" label="Email" type="email" inputmode="email" autocomplete="email" :error="errors.email" required class="sm:col-span-2" />
            </div>
          </section>

          <section class="iz-card">
            <h2 class="iz-label">Address</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <UiFormField id="co-country" v-model="form.country" label="Country" autocomplete="country-name" :error="errors.country" required />
              <UiFormField id="co-city" v-model="form.city" label="City" autocomplete="address-level2" :error="errors.city" required />
              <UiFormField id="co-street" v-model="form.street" label="Street and building" autocomplete="street-address" :error="errors.street" required class="sm:col-span-2" />
              <UiFormField id="co-postal" v-model="form.postalCode" label="Postal code" autocomplete="postal-code" :error="errors.postalCode" required />
            </div>

            <div class="mt-4">
              <label class="iz-label" for="co-comment">Comment for the courier</label>
              <textarea id="co-comment" v-model="form.comment" class="iz-input min-h-24" rows="3" placeholder="Entrance, floor, delivery window…" />
            </div>
          </section>

          <section class="iz-card">
            <h2 class="iz-label">Delivery</h2>
            <div class="mt-4 flex flex-col gap-3">
              <label
                v-for="option in deliveryOptions"
                :key="option.id"
                class="choice"
                :class="{ 'choice--active': deliveryMethodId === option.id }"
              >
                <input v-model="deliveryMethodId" type="radio" name="delivery" :value="option.id" class="choice__input" >
                <span class="choice__body">
                  <span class="choice__title">{{ option.title }}</span>
                  <span class="choice__meta">{{ option.description }} · {{ formatEta(option.etaDaysMin, option.etaDaysMax) }}</span>
                </span>
                <span class="choice__price">{{ option.priceCents > 0 ? formatPrice(option.priceCents) : "Free" }}</span>
              </label>
            </div>
          </section>

          <section class="iz-card">
            <h2 class="iz-label">Payment</h2>
            <div class="mt-4 flex flex-col gap-3">
              <label
                v-for="method in PAYMENT_METHODS"
                :key="method.id"
                class="choice"
                :class="{ 'choice--active': paymentMethodId === method.id }"
              >
                <input v-model="paymentMethodId" type="radio" name="payment" :value="method.id" class="choice__input" >
                <span class="choice__body">
                  <span class="choice__title">{{ PAYMENT_METHOD_LABELS[method.id] }}</span>
                  <span class="choice__meta">{{ method.description }}</span>
                </span>
              </label>
            </div>
            <p class="mt-4 text-xs leading-relaxed text-[var(--iz-muted)]">
              Card details are never entered on this site — the payment provider collects them on its own page.
            </p>
          </section>
        </div>

        <aside class="lg:sticky lg:top-24">
          <CartSummary :totals="preview.totals" title="Order summary">
            <ul class="flex flex-col gap-1.5 border-t border-[var(--iz-border-soft)] pt-3 text-xs text-[var(--iz-muted)]">
              <li v-for="line in preview.lines" :key="line.variantId" class="flex justify-between gap-3">
                <span class="truncate">{{ line.quantity }} × {{ line.title }}</span>
                <span class="tabular-nums">{{ formatPrice(line.lineTotalCents) }}</span>
              </li>
            </ul>

            <p v-if="submitError" class="iz-error" role="alert">{{ submitError }}</p>

            <button
              type="submit"
              class="iz-btn iz-btn--solid iz-btn--block"
              :disabled="!canSubmit || isLoading"
              data-testid="place-order"
            >
              {{ isSubmitting ? "Placing order…" : "Place order" }}
            </button>

            <NuxtLink to="/cart" class="iz-btn iz-btn--quiet iz-btn--block">Back to cart</NuxtLink>
          </CartSummary>
        </aside>
      </form>
    </ClientOnly>
  </div>
</template>

<style scoped>
.choice {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--iz-border);
  border-radius: 0.85rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.choice:hover {
  border-color: rgb(255 255 255 / 0.2);
}

.choice--active {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.08);
}

.choice__input {
  height: 1.1rem;
  width: 1.1rem;
  flex-shrink: 0;
  accent-color: #4da3ff;
}

.choice__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.choice__title {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
}

.choice__meta {
  color: var(--iz-muted);
  font-size: 0.8rem;
  line-height: 1.4;
}

.choice__price {
  flex-shrink: 0;
  color: #e7eef6;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}
</style>
