/**
 * Single place where HTTP happens. Swapping the mock backend for the real one is a
 * change of `NUXT_PUBLIC_API_BASE`, not a change in any page or component.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  // During SSR the incoming cookie must be forwarded so the session is visible.
  const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: "include",
    headers,
    retry: false,
  });

  return { provide: { api } };
});
