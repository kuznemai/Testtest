import { useAuthStore } from "~/stores/auth";
import { safeRedirectPath } from "~/utils/validation";

/** Keeps signed-in users away from the sign-in and registration pages. */
export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().isAuthenticated) return;

  return navigateTo(safeRedirectPath(to.query.redirect, "/profile"));
});
