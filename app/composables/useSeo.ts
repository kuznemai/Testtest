interface SeoInput {
  title: string;
  description: string;
  /** Absolute or root-relative path of a representative image. */
  image?: string;
}

/**
 * Page metadata plus the canonical/OG tags a storefront needs. Thin on purpose —
 * it only removes the repetition of building absolute URLs on every page.
 */
export function useSeo({ title, description, image }: SeoInput): void {
  const route = useRoute();
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
  const canonical = `${siteUrl}${route.path}`;
  const ogImage = image ? `${siteUrl}${image}` : `${siteUrl}/hero-phone.png`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  });

  useHead({ link: [{ rel: "canonical", href: canonical }] });
}
