import type {
  CartItemInput,
  CartLine,
  CartPreview,
  DeliveryMethodId,
  DeliveryOption,
  Product,
  ProductListItem,
  ProductVariant,
} from "../types";
import type { MockState } from "./state";

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    title: "Standard delivery",
    description: "Tracked courier, signature on arrival.",
    priceCents: 1900,
    etaDaysMin: 3,
    etaDaysMax: 6,
  },
  {
    id: "express",
    title: "Express delivery",
    description: "Next business day in most cities.",
    priceCents: 4900,
    etaDaysMin: 1,
    etaDaysMax: 2,
  },
  {
    id: "pickup",
    title: "Pickup point",
    description: "Collect from an IZ partner store.",
    priceCents: 0,
    etaDaysMin: 2,
    etaDaysMax: 4,
  },
];

export function findDeliveryOption(id: DeliveryMethodId | string): DeliveryOption | undefined {
  return DELIVERY_OPTIONS.find((option) => option.id === id);
}

export function variantLabel(variant: ProductVariant): string {
  return `${variant.storageGb} GB · ${variant.color}`;
}

export function toListItem(product: Product): ProductListItem {
  const prices = product.variants.map((variant) => variant.priceCents);
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    tagline: product.tagline,
    image: product.images[0]!,
    fromPriceCents: Math.min(...prices),
    inStock: product.variants.some((variant) => variant.stock > 0),
    badge: product.badge,
  };
}

interface ResolvedVariant {
  product: Product;
  variant: ProductVariant;
}

export function resolveVariant(state: MockState, productId: string, variantId: string): ResolvedVariant | null {
  const product = state.products.find((candidate) => candidate.id === productId);
  const variant = product?.variants.find((candidate) => candidate.id === variantId);
  return product && variant ? { product, variant } : null;
}

/**
 * Prices a cart. The client only ever sends ids and quantities — every amount the
 * shopper sees is computed here, which is also how the real backend must work.
 */
export function priceCart(
  state: MockState,
  items: CartItemInput[],
  deliveryMethodId?: DeliveryMethodId,
): CartPreview {
  const lines: CartLine[] = [];

  for (const item of items) {
    const resolved = resolveVariant(state, item.productId, item.variantId);
    if (!resolved) continue;

    const { product, variant } = resolved;
    const quantity = Math.max(1, Math.min(Math.trunc(item.quantity) || 1, 10));
    const available = variant.stock > 0;
    const lineTotalCents = available ? variant.priceCents * quantity : 0;

    lines.push({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      variantLabel: variantLabel(variant),
      image: product.images[0]!,
      unitPriceCents: variant.priceCents,
      quantity,
      lineTotalCents,
      available,
      maxQuantity: Math.min(variant.stock, 10),
    });
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const delivery = deliveryMethodId ? findDeliveryOption(deliveryMethodId) : undefined;
  const deliveryCents = subtotalCents > 0 && delivery ? delivery.priceCents : 0;

  return {
    lines,
    unavailableCount: lines.filter((line) => !line.available).length,
    totals: {
      currency: "USD",
      subtotalCents,
      deliveryCents,
      discountCents: 0,
      totalCents: subtotalCents + deliveryCents,
    },
  };
}
