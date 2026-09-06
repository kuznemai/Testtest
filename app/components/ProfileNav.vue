<script setup lang="ts">
const LINKS = [
  { label: "Overview", to: "/profile" },
  { label: "Orders", to: "/profile/orders" },
];
</script>

<template>
  <nav class="profile-nav" aria-label="Profile">
    <NuxtLink v-for="link in LINKS" :key="link.to" :to="link.to" class="profile-nav__link">
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.profile-nav {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--iz-border-soft);
}

.profile-nav__link {
  padding: 0.7rem 1rem;
  border-bottom: 2px solid transparent;
  color: var(--iz-muted);
  font-size: 0.92rem;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.profile-nav__link:hover {
  color: #e7eef6;
}

.profile-nav__link.router-link-exact-active {
  border-bottom-color: var(--iz-accent);
  color: #fff;
}
</style>
