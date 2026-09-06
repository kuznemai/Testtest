/**
 * Domain contract shared by the Nuxt app and the mock server.
 *
 * All money is expressed in integer minor units (cents) to avoid floating point
 * drift; the real backend is expected to use the same representation.
 */

export type Currency = "USD";

/* ---------------------------------------------------------------- catalog */

export interface ProductVariant {
  id: string;
  storageGb: number;
  color: string;
  colorHex: string;
  priceCents: number;
  /** Units available; 0 means the configuration cannot be ordered. */
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  images: string[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  badge?: string;
}

/** Catalog list item — same shape, trimmed to what a grid needs. */
export interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  image: string;
  fromPriceCents: number;
  inStock: boolean;
  badge?: string;
}

/* ------------------------------------------------------------------- cart */

/** What the client persists. Prices always come back from the server. */
export interface CartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  variantLabel: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  /** false when the configuration went out of stock after it was added. */
  available: boolean;
  maxQuantity: number;
}

export interface CartTotals {
  currency: Currency;
  subtotalCents: number;
  deliveryCents: number;
  discountCents: number;
  totalCents: number;
}

export interface CartPreview {
  lines: CartLine[];
  totals: CartTotals;
  unavailableCount: number;
}

/* --------------------------------------------------------------- delivery */

export type DeliveryMethodId = "standard" | "express" | "pickup";

export interface DeliveryOption {
  id: DeliveryMethodId;
  title: string;
  description: string;
  priceCents: number;
  etaDaysMin: number;
  etaDaysMax: number;
}

/* ---------------------------------------------------------------- payment */

export type PaymentMethodId = "card" | "crypto" | "on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  methodId: PaymentMethodId;
  status: PaymentStatus;
  amountCents: number;
  currency: Currency;
  /** Where the shopper is sent to complete the payment (mock provider page). */
  redirectUrl: string;
  createdAt: string;
  updatedAt: string;
}

/* ----------------------------------------------------------------- orders */

export type OrderStatus =
  | "created"
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  variantLabel: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  comment?: string;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: CartTotals;
  delivery: {
    methodId: DeliveryMethodId;
    title: string;
    priceCents: number;
    etaDaysMin: number;
    etaDaysMax: number;
  };
  payment: {
    methodId: PaymentMethodId;
    status: PaymentStatus;
    paymentId: string | null;
  };
  address: ShippingAddress;
}

export interface OrderListItem {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  totalCents: number;
  currency: Currency;
  itemCount: number;
  previewImages: string[];
}

/* --------------------------------------------------------------- tracking */

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  /** ISO date once the step happened, null while it is still ahead. */
  at: string | null;
  done: boolean;
}

export interface OrderTracking {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  carrier: string | null;
  trackingNumber: string | null;
  expectedDeliveryAt: string | null;
  events: TrackingEvent[];
}

/* ------------------------------------------------------------------- auth */

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
}

/* ---------------------------------------------------------------- errors */

/** Shape of a 4xx body: `data.fields` maps a form field to its message. */
export interface ApiErrorData {
  fields?: Record<string, string>;
}
