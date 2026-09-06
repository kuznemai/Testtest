<script setup lang="ts">
const config = useRuntimeConfig();

useHead({
  titleTemplate: (title) => (title ? `${title} — IZ Secure` : "IZ Secure"),
  meta: [{ name: "theme-color", content: "#05070d" }],
});

useSeoMeta({
  ogSiteName: "IZ Secure",
  ogUrl: config.public.siteUrl,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
