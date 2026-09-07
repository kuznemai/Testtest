/**
 * Prefixes a public asset path that came from data (product images, order thumbnails)
 * with the app base URL.
 *
 * Literal `src="/foo.png"` in a template is rewritten by the bundler; strings that
 * arrive at runtime are not, and would 404 when the site is served from a sub-path
 * such as GitHub Pages' `/Phones/`.
 */
export function assetUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  const base = useRuntimeConfig().app.baseURL;
  return `${base.replace(/\/$/, "")}${path}`;
}
