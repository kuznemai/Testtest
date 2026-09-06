import type { Currency, OrderStatus, PaymentStatus } from "#shared/types";

const LOCALE = "en-GB";

/** Money is stored in minor units everywhere; format from cents, never from floats. */
export function formatPrice(cents: number | null | undefined, currency: Currency = "USD"): string {
  const value = Number.isFinite(cents) ? (cents as number) / 100 : 0;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    // en-GB renders USD as "US$" by default; the store is dollar-only.
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatEta(minDays: number, maxDays: number): string {
  return minDays === maxDays ? `${minDays} days` : `${minDays}–${maxDays} days`;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: "Created",
  awaiting_payment: "Awaiting payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Badge classes per status — one place so they never drift between screens. */
export const ORDER_STATUS_TONES: Record<OrderStatus, string> = {
  created: "bg-white/5 text-zinc-300 border-white/10",
  awaiting_payment: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  paid: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  processing: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  shipped: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/30",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Card",
  crypto: "Crypto",
  on_delivery: "On delivery",
};
