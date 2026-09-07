import { useAuthStore } from "~/stores/auth";

/**
 * Resolves the session before route middleware runs, so protected pages behave
 * correctly on a hard reload.
 *
 * With a server, SSR does it and Pinia ships the result in the payload. The static
 * GitHub Pages build has no server, so there it resolves in the browser instead.
 */
export default defineNuxtPlugin(async () => {
  const isStaticDemo = useRuntimeConfig().public.staticDemo;
  if (import.meta.server || isStaticDemo) {
    await useAuthStore().fetchUser();
  }
});
