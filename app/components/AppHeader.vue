<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";

withDefaults(defineProps<{ overlay?: boolean }>(), { overlay: false });

const auth = useAuthStore();
const cart = useCartStore();
const favorites = useFavoritesStore();
const route = useRoute();

const isMenuOpen = ref(false);

const NAV = [
  { label: "Home", to: "/" },
  { label: "Devices", to: "/shop" },
  { label: "Technology", to: "/offer" },
  { label: "Support", to: "/contact" },
];

// Close the drawer on navigation instead of watching the router inside the template.
watch(() => route.fullPath, () => {
  isMenuOpen.value = false;
});

// A fixed full-screen drawer must not leave the page scrollable behind it.
watch(isMenuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? "hidden" : "";
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});

async function signOut(): Promise<void> {
  await auth.logout();
  isMenuOpen.value = false;
  await navigateTo("/");
}
</script>

<template>
  <header class="site-header" :class="overlay ? 'site-header--overlay' : 'site-header--solid'">
    <div class="site-header__row iz-wrap">
      <NuxtLink to="/" class="brand" aria-label="IZ Secure — home">
        <img class="brand__mark" src="/iz-mark-white.png" alt="" width="60" height="43" >
        <span class="brand__tag">Secure<br >Tomorrow</span>
      </NuxtLink>

      <nav class="site-nav" aria-label="Main">
        <NuxtLink v-for="link in NAV" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
      </nav>

      <div class="site-actions">
        <NuxtLink to="/favorites" class="icon-btn" aria-label="Saved devices">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
          </svg>
          <ClientOnly>
            <span v-if="favorites.count > 0" class="icon-btn__badge">{{ favorites.count }}</span>
          </ClientOnly>
        </NuxtLink>

        <NuxtLink to="/cart" class="icon-btn" aria-label="Cart">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5.6 8h12.8l1 11.2a1.6 1.6 0 0 1-1.6 1.8H6.2a1.6 1.6 0 0 1-1.6-1.8L5.6 8Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path d="M8.8 8V6.4a3.2 3.2 0 0 1 6.4 0V8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <ClientOnly>
            <span v-if="cart.count > 0" class="icon-btn__badge">{{ cart.count }}</span>
          </ClientOnly>
        </NuxtLink>

        <NuxtLink
          :to="auth.isAuthenticated ? '/profile' : '/login'"
          class="icon-btn"
          :aria-label="auth.isAuthenticated ? 'Profile' : 'Sign in'"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8.5" r="3.6" stroke="currentColor" stroke-width="1.7" />
            <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </NuxtLink>

        <NuxtLink to="/shop" class="header-cta">Shop Now</NuxtLink>
      </div>

      <button
        type="button"
        class="burger"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Open menu"
        @click="isMenuOpen = true"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="isMenuOpen" id="mobile-menu" class="drawer" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="drawer__head iz-wrap">
        <NuxtLink to="/" class="brand">
          <img class="brand__mark" src="/iz-mark-white.png" alt="" width="60" height="43" >
          <span class="brand__tag">Secure<br >Tomorrow</span>
        </NuxtLink>
        <button type="button" class="icon-btn" aria-label="Close menu" @click="isMenuOpen = false">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <nav class="drawer__nav iz-wrap" aria-label="Mobile">
        <NuxtLink v-for="link in NAV" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        <NuxtLink to="/favorites">Saved devices</NuxtLink>
        <NuxtLink to="/cart">Cart <span v-if="cart.count > 0">({{ cart.count }})</span></NuxtLink>

        <template v-if="auth.isAuthenticated">
          <NuxtLink to="/profile">Profile</NuxtLink>
          <NuxtLink to="/profile/orders">My orders</NuxtLink>
          <button type="button" class="drawer__signout" @click="signOut">Log out</button>
        </template>
        <template v-else>
          <NuxtLink to="/login">Sign in</NuxtLink>
          <NuxtLink to="/register">Create account</NuxtLink>
        </template>

        <NuxtLink to="/shop" class="iz-btn iz-btn--solid mt-4 self-start">Shop Now</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  width: 100%;
}

.site-header--overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background: transparent;
}

.site-header--solid {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--iz-border-soft);
  background: rgb(5 7 13 / 0.88);
  backdrop-filter: blur(12px);
}

.site-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: clamp(0.85rem, 1.6vw, 1.5rem);
}

/* ---------------------------------------------------------------- brand */
.brand {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(0.7rem, 1.3vw, 1.1rem);
}

.brand__mark {
  height: clamp(1.6rem, 2.6vw, 2.4rem);
  width: auto;
}

.brand__tag {
  color: #cfe0f2;
  font-size: clamp(0.55rem, 0.75vw, 0.7rem);
  line-height: 1.7;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ------------------------------------------------------------------ nav */
.site-nav {
  display: none;
  align-items: center;
  gap: clamp(1.25rem, 2.6vw, 2.75rem);
}

.site-nav a {
  color: #e7eef6;
  font-size: clamp(0.86rem, 1.1vw, 1rem);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-nav a:hover,
.site-nav a.router-link-exact-active {
  color: var(--iz-accent);
}

/* -------------------------------------------------------------- actions */
.site-actions {
  display: none;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(0.35rem, 0.8vw, 0.7rem);
}

.icon-btn {
  position: relative;
  display: inline-flex;
  height: 2.75rem;
  min-width: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #e7eef6;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.icon-btn:hover {
  color: var(--iz-accent);
  background: rgb(255 255 255 / 0.06);
}

.icon-btn svg {
  width: 1.45rem;
  height: 1.45rem;
}

.icon-btn__badge {
  position: absolute;
  top: 0.35rem;
  right: 0.2rem;
  min-width: 1.05rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: var(--iz-accent-strong);
  color: #04070f;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.05rem;
  text-align: center;
}

.header-cta {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  margin-left: clamp(0.3rem, 0.8vw, 0.9rem);
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  background: #fff;
  color: #05080f;
  font-size: clamp(0.86rem, 1.05vw, 0.98rem);
  font-weight: 500;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.header-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgb(120 180 255 / 0.3);
}

/* --------------------------------------------------------------- drawer */
.burger {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
}

.burger svg {
  width: 1.6rem;
  height: 1.6rem;
}

.drawer {
  position: fixed;
  inset: 0;
  z-index: 250;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--iz-bg);
}

.drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
  border-bottom: 1px solid var(--iz-border-soft);
}

.drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: 1.5rem 3rem;
}

.drawer__nav a,
.drawer__signout {
  padding-block: 0.9rem;
  border-bottom: 1px solid var(--iz-border-soft);
  color: #e7eef6;
  font-size: 1.05rem;
  text-align: left;
}

.drawer__nav a:hover,
.drawer__signout:hover {
  color: var(--iz-accent);
}

.drawer__nav a.iz-btn {
  border-bottom: 0;
  color: #05080f;
}

@media (min-width: 1024px) {
  .site-nav,
  .site-actions {
    display: flex;
  }

  .burger,
  .drawer {
    display: none;
  }
}
</style>
