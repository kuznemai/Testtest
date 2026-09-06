<script setup lang="ts">
/**
 * Empty / error / not-found placeholder. Used on every list and detail screen so
 * the shopper always sees what happened and what they can do next.
 */
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    tone?: "neutral" | "error";
  }>(),
  { description: "", tone: "neutral" },
);
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-4 py-16 text-center">
    <div
      class="flex h-14 w-14 items-center justify-center rounded-2xl border"
      :class="tone === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-white/10 bg-white/5 text-zinc-500'"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
        <path
          v-if="tone === 'error'"
          d="M12 8.5v5m0 3.5h.01M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-else
          d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h2 class="text-lg text-zinc-200">{{ title }}</h2>
    <p v-if="description" class="max-w-md text-sm text-zinc-500">{{ description }}</p>

    <div class="mt-3 flex flex-wrap justify-center gap-3">
      <slot />
    </div>
  </div>
</template>
