<script setup lang="ts">
defineProps<{
  name: "chip" | "wallet" | "shield" | "network" | "contract" | "bolt" | "privacy";
}>();
</script>

<template>
  <!-- Simple paths + stroke 1.5 — reads sharp at 28px; solid indigo, no opacity -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="h-7 w-7 shrink-0 text-indigo-400"
    aria-hidden="true"
  >
    <!-- Chip: outer + inner dies (no noisy pin lines) -->
    <g v-if="name === 'chip'" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
      <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="2" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
    </g>

    <!-- Wallet -->
    <g v-else-if="name === 'wallet'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.75 8.25h12A2.25 2.25 0 0 1 18 10.5v7.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-9a2.25 2.25 0 0 1 2.25-2.25z" />
      <path d="M3.75 8.25V6.5c0-.966.784-1.75 1.75-1.75h9" />
      <circle cx="15" cy="13.5" r="0.9" fill="currentColor" stroke="none" />
    </g>

    <!-- Shield (compact shield + check) -->
    <g v-else-if="name === 'shield'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3.25 19.25 7v6c0 4.25-3.5 7.5-7.25 9-3.75-1.5-7.25-4.75-7.25-9V7L12 3.25z" />
      <path d="m9.25 12 2 2 3.5-3.5" />
    </g>

    <!-- Network: two nodes + link (replaces busy “fingerprint” path) -->
    <g
      v-else-if="name === 'network'"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <circle cx="7.5" cy="12" r="3" />
      <circle cx="16.5" cy="12" r="3" />
      <line x1="10.5" y1="12" x2="13.5" y2="12" />
    </g>

    <!-- Document -->
    <g v-else-if="name === 'contract'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.5 3.75H6.75A2.25 2.25 0 0 0 4.5 6v12a2.25 2.25 0 0 0 2.25 2.25h10.5A2.25 2.25 0 0 0 19.5 18V8.25L14.25 3.75H10.5z" />
      <path d="M10.5 3.75v4.5h4.5" />
      <path d="M8.25 13.5h7.5M8.25 16.5h5.25" />
    </g>

    <!-- Bolt -->
    <path
      v-else-if="name === 'bolt'"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
    />

    <!-- Lock -->
    <g v-else-if="name === 'privacy'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5.25" y="11.25" width="13.5" height="9.5" rx="2" />
      <path d="M8.25 11.25V8.25a3.75 3.75 0 0 1 7.5 0v3" />
      <circle cx="12" cy="15.75" r="1" fill="currentColor" stroke="none" />
    </g>
  </svg>
</template>
