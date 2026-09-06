<script setup lang="ts">
const currentYear = new Date().getFullYear();

const NAV = [
  { label: "Home", to: "/" },
  { label: "Devices", to: "/shop" },
  { label: "Technology", to: "/offer" },
  { label: "Support", to: "/contact" },
];

const SOCIAL = [
  {
    label: "Telegram",
    href: "https://t.me/",
    path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.593l-2.963-.924c-.644-.204-.657-.644.135-.953l11.57-4.461c.537-.194 1.006.131.832.966z",
  },
  {
    label: "X",
    href: "https://x.com/",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    path: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
  },
];
</script>

<template>
  <footer class="site-footer">
    <div class="iz-wrap">
      <div class="site-footer__top">
        <NuxtLink to="/" class="site-footer__brand" aria-label="IZ Secure — home">
          <img src="/iz-logo-white.png" alt="" width="160" height="93" >
        </NuxtLink>

        <nav class="site-footer__nav" aria-label="Footer">
          <NuxtLink v-for="link in NAV" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        </nav>

        <div class="site-footer__social">
          <a
            v-for="social in SOCIAL"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="social.path" />
            </svg>
          </a>
        </div>

        <nav class="site-footer__legal" aria-label="Legal">
          <NuxtLink to="/contact">Privacy</NuxtLink>
          <NuxtLink to="/contact">Terms</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <span>Technology for a more open future.</span>
        <span>&copy; {{ currentYear }} IZ Secure. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--iz-border-soft);
  padding-block: clamp(2rem, 3.5vw, 3rem) clamp(1.5rem, 2.5vw, 2rem);
}

.site-footer__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2.5rem);
}

.site-footer__brand img {
  height: clamp(2.2rem, 3.2vw, 3rem);
  width: auto;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(1.1rem, 2.4vw, 2.5rem);
}

.site-footer__nav a {
  color: #dfe8f2;
  font-size: clamp(0.82rem, 0.98vw, 0.92rem);
  transition: color 0.2s ease;
}

.site-footer__nav a:hover {
  color: var(--iz-accent);
}

.site-footer__social {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.site-footer__social a {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #7e93a9;
  transition: color 0.2s ease;
}

.site-footer__social a:hover {
  color: var(--iz-accent);
}

.site-footer__social svg {
  width: 1.2rem;
  height: 1.2rem;
}

.site-footer__legal {
  display: flex;
  align-items: center;
  gap: clamp(0.9rem, 1.8vw, 1.75rem);
}

.site-footer__legal a {
  color: #7e93a9;
  font-size: clamp(0.76rem, 0.9vw, 0.85rem);
  transition: color 0.2s ease;
}

.site-footer__legal a:hover {
  color: #dfe8f2;
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: clamp(1.5rem, 2.5vw, 2.25rem);
  padding-top: clamp(1rem, 1.8vw, 1.5rem);
  border-top: 1px solid var(--iz-border-soft);
  color: #6f8095;
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: 300;
}
</style>
