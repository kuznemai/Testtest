import { useAuthStore } from "~/stores/auth";

/** Sends guests to the sign-in page and remembers where they were heading. */
export default defineNuxtRouteMiddleware((to) => {
  if (useAuthStore().isAuthenticated) return;

  return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
});
