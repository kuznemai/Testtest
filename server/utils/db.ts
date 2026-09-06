import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Order, OrderItem, Payment, Product, User } from "#shared/types";
import { products } from "../data/products";

/**
 * In-memory mock database.
 *
 * It lives for as long as the Nuxt server process does: the seeded demo account
 * and its orders are always there, anything created at runtime is lost on restart.
 * Replacing this module (plus the handlers in `server/api`) with calls to the real
 * backend is the whole migration path.
 */

export interface StoredUser extends User {
  passwordHash: string;
}

/** Order rows carry the owner id, which never leaves the server. */
export type OrderRow = Order & { userId: string };

interface Database {
  products: Product[];
  users: StoredUser[];
  /** session token -> user id */
  sessions: Map<string, string>;
  orders: OrderRow[];
  payments: Payment[];
  orderSequence: number;
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  return `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 32);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createId(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export function daysAhead(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

const DEMO_ADDRESS = {
  fullName: "Marina Kuznetsova",
  phone: "+15550100123",
  email: "demo@iz.example",
  country: "United Arab Emirates",
  city: "Dubai",
  street: "Sheikh Zayed Road 121, apt. 904",
  postalCode: "00000",
};

function seedOrderItem(product: Product, variantIndex: number, quantity: number): OrderItem {
  const variant = product.variants[variantIndex]!;
  return {
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    title: product.title,
    variantLabel: `${variant.storageGb} GB · ${variant.color}`,
    image: product.images[0]!,
    unitPriceCents: variant.priceCents,
    quantity,
    lineTotalCents: variant.priceCents * quantity,
  };
}

function seed(): Database {
  const demoUser: StoredUser = {
    id: "u_demo",
    email: "demo@iz.example",
    name: "Marina Kuznetsova",
    phone: "+15550100123",
    createdAt: daysAgo(120),
    passwordHash: hashPassword("demo1234"),
  };

  const [onePro, one, vault] = products as [Product, Product, Product];

  const buildOrder = (
    seq: number,
    status: Order["status"],
    paymentStatus: Payment["status"],
    createdAt: string,
    items: OrderItem[],
    deliveryCents: number,
  ): OrderRow => {
    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    return {
      id: `o_seed_${seq}`,
      userId: demoUser.id,
      number: `IZ-${1000 + seq}`,
      createdAt,
      updatedAt: createdAt,
      status,
      items,
      totals: {
        currency: "USD",
        subtotalCents,
        deliveryCents,
        discountCents: 0,
        totalCents: subtotalCents + deliveryCents,
      },
      delivery:
        deliveryCents === 0
          ? { methodId: "pickup", title: "Pickup point", priceCents: 0, etaDaysMin: 2, etaDaysMax: 4 }
          : {
              methodId: "standard",
              title: "Standard delivery",
              priceCents: deliveryCents,
              etaDaysMin: 3,
              etaDaysMax: 6,
            },
      payment: {
        methodId: "card",
        status: paymentStatus,
        paymentId: paymentStatus === "pending" ? "pay_seed_pending" : null,
      },
      address: { ...DEMO_ADDRESS },
    };
  };

  const orders: OrderRow[] = [
    buildOrder(1, "awaiting_payment", "pending", daysAgo(1), [seedOrderItem(onePro, 1, 1)], 0),
    buildOrder(2, "cancelled", "cancelled", daysAgo(5), [seedOrderItem(vault, 1, 1)], 1900),
    buildOrder(3, "shipped", "paid", daysAgo(9), [seedOrderItem(onePro, 0, 1), seedOrderItem(vault, 0, 1)], 1900),
    buildOrder(4, "delivered", "paid", daysAgo(38), [seedOrderItem(one, 1, 1)], 1900),
  ];

  const payments: Payment[] = [
    {
      id: "pay_seed_pending",
      orderId: "o_seed_1",
      orderNumber: "IZ-1001",
      methodId: "card",
      status: "pending",
      amountCents: orders[0]!.totals.totalCents,
      currency: "USD",
      redirectUrl: "/payment/pay_seed_pending",
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ];

  return {
    products,
    users: [demoUser],
    sessions: new Map(),
    orders,
    payments,
    orderSequence: 4,
  };
}

// Survives Nitro's dev-time module reloads.
const globalScope = globalThis as typeof globalThis & { __izStoreDb__?: Database };

export const db: Database = (globalScope.__izStoreDb__ ??= seed());
