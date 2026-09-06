<script setup lang="ts">
/** Shared shell for the payment success / failed / pending screens. */
withDefaults(
  defineProps<{
    tone: "success" | "error" | "pending";
    eyebrow: string;
    title: string;
    description: string;
    orderId?: string;
  }>(),
  { orderId: "" },
);

const TONE_CLASS = {
  success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/35 bg-red-500/10 text-red-300",
  pending: "border-amber-500/35 bg-amber-500/10 text-amber-300",
} as const;
</script>

<template>
  <div class="iz-wrap iz-page">
    <div class="mx-auto flex w-full max-w-lg flex-col items-center gap-5 text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl border" :class="TONE_CLASS[tone]">
        <svg viewBox="0 0 24 24" fill="none" class="h-8 w-8" aria-hidden="true">
          <path
            v-if="tone === 'success'"
            d="m5 12.5 4.5 4.5L19 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            v-else-if="tone === 'error'"
            d="m7 7 10 10M17 7 7 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            v-else
            d="M12 7v5.5l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div>
        <p class="iz-eyebrow">{{ eyebrow }}</p>
        <h1 class="iz-h1 mt-3">{{ title }}</h1>
        <p class="mt-3 text-sm leading-relaxed text-[var(--iz-muted)]">{{ description }}</p>
      </div>

      <div class="mt-2 flex flex-wrap justify-center gap-3">
        <slot>
          <NuxtLink v-if="orderId" :to="`/profile/orders/${orderId}`" class="iz-btn iz-btn--solid">
            View order
          </NuxtLink>
          <NuxtLink to="/shop" class="iz-btn iz-btn--ghost">Keep shopping</NuxtLink>
        </slot>
      </div>
    </div>
  </div>
</template>
