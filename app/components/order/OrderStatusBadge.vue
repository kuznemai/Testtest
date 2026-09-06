<script setup lang="ts">
import type { OrderStatus } from "#shared/types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from "~/utils/format";

defineProps<{ status: OrderStatus }>();
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] tracking-wide uppercase"
    :class="ORDER_STATUS_TONES[status]"
  >
    {{ ORDER_STATUS_LABELS[status] }}
  </span>
</template>
