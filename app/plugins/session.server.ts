import { useAuthStore } from "~/stores/auth";

/**
 * Resolves the session during SSR so protected pages render correctly on a hard
 * reload. Pinia state travels to the client in the payload, so no second request.
 */
export default defineNuxtPlugin(async () => {
  await useAuthStore().fetchUser();
});
