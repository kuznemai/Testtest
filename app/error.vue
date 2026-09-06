<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const isNotFound = computed(() => props.error.statusCode === 404);

const title = computed(() => (isNotFound.value ? "Page not found" : "Something went wrong"));
const description = computed(() =>
  isNotFound.value
    ? "The page you were looking for has moved or never existed."
    : props.error.statusMessage || "An unexpected error occurred. Please try again.",
);

useHead({ title: title.value });
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--iz-bg)]">
    <AppHeader />

    <main class="flex flex-1 items-center">
      <div class="iz-wrap iz-wrap--narrow py-20 text-center">
        <p class="iz-eyebrow">Error {{ error.statusCode }}</p>
        <h1 class="iz-h2 mx-auto max-w-[18ch]">{{ title }}</h1>
        <p class="iz-lead mx-auto text-center">{{ description }}</p>

        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" class="iz-btn iz-btn--solid" @click="clearError({ redirect: '/' })">
            Back to the store
          </button>
          <NuxtLink to="/shop" class="iz-btn iz-btn--ghost" @click="clearError()">Browse devices</NuxtLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
