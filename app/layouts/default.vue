<script setup lang="ts">
const route = useRoute();

/** The landing page runs edge-to-edge under a transparent header. */
const isOverlayHeader = computed(() => route.path === "/");
</script>

<template>
  <div class="relative flex min-h-screen flex-col bg-[var(--iz-bg)]">
    <AppHeader :overlay="isOverlayHeader" />

    <main class="min-w-0 flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
