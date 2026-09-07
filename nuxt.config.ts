import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves a project site from a sub-path, so prerender targets need it too.
const baseURL = process.env.NUXT_APP_BASE_URL ?? "/";
const withBase = (route: string): string => `${baseURL.replace(/\/$/, "")}${route}`;
const PUBLIC_ROUTES = ["/", "/shop", "/cart", "/login", "/register", "/favorites", "/offer", "/contact"];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      // Point this at the real backend once it exists (NUXT_PUBLIC_API_BASE).
      apiBase: "/api",
      siteUrl: "http://localhost:3000",
      /**
       * Static-hosting mode (GitHub Pages): there is no server, so the mock backend
       * runs in the browser. Never enable it against a real API.
       */
      staticDemo: false,
    },
  },

  nitro: {
    prerender: {
      // Product pages are reached by crawling the catalogue. Account, checkout and
      // payment pages are not prerendered: what they show depends on who is signed in,
      // so they boot from the SPA fallback instead.
      crawlLinks: true,
      // Nitro reports crawled routes with and without the base, so ignore both forms.
      ignore: ["/profile", "/checkout", "/payment"].flatMap((route) => [route, withBase(route)]),
      routes: PUBLIC_ROUTES.map(withBase),
      failOnError: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [
        { rel: "icon", type: "image/png", href: "/iz-mark-white.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap",
        },
      ],
    },
  },

  eslint: {
    config: { stylistic: false },
  },
});
