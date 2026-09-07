import { demoApiRequest } from "~/utils/demo-backend";

export interface ApiFetch {
  <T>(url: string, options?: { method?: string; body?: unknown; query?: Record<string, unknown> }): Promise<T>;
}

/**
 * Single place where HTTP happens. Swapping the mock backend for the real one is a
 * change of `NUXT_PUBLIC_API_BASE`, not a change in any page or component.
 *
 * The static GitHub Pages build has no server, so there it runs the same mock handlers
 * in the browser instead of issuing requests.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  if (config.public.staticDemo) {
    return { provide: { api: demoApiRequest as ApiFetch } };
  }

  // During SSR the incoming cookie must be forwarded so the session is visible.
  const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: "include",
    headers,
    retry: false,
  });

  return { provide: { api: api as unknown as ApiFetch } };
});
