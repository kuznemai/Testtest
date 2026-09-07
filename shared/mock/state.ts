import type { Order, OrderItem, Payment, Product } from "../types";
import { products } from "./products";

/**
 * State for the mock backend.
 *
 * It runs in two places: inside Nitro during `npm run dev`/`npm run build`, and inside
 * the browser for the static GitHub Pages demo, which has no server at all. Keeping it
 * free of Node APIs is what makes the second case possible.
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
  /**
   * Plain text on purpose: this is a fixture, not authentication. The real backend
   * hashes passwords and this field disappears with the rest of `shared/mock`.
   */
  password: string;
}

export type MockOrder = Order & { userId: string };

export interface MockState {
  products: Product[];
  users: MockUser[];
  orders: MockOrder[];
  payments: Payment[];
  orderSequence: number;
}

let idCounter = 0;

export function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
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

function seedItem(product: Product, variantIndex: number, quantity: number): OrderItem {
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

export function createMockState(): MockState {
  const demoUser: MockUser = {
    id: "u_demo",
    email: "demo@iz.example",
    name: "Marina Kuznetsova",
    phone: "+15550100123",
    createdAt: daysAgo(120),
    password: "demo1234",
  };

  const catalogue = products.map((product) => structuredClone(product));
  const [onePro, one, vault] = catalogue as [Product, Product, Product];

  const buildOrder = (
    seq: number,
    status: Order["status"],
    paymentStatus: Payment["status"],
    createdAt: string,
    items: OrderItem[],
    deliveryCents: number,
  ): MockOrder => {
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

  const orders: MockOrder[] = [
    buildOrder(1, "awaiting_payment", "pending", daysAgo(1), [seedItem(onePro, 1, 1)], 0),
    buildOrder(2, "cancelled", "cancelled", daysAgo(5), [seedItem(vault, 1, 1)], 1900),
    buildOrder(3, "shipped", "paid", daysAgo(9), [seedItem(onePro, 0, 1), seedItem(vault, 0, 1)], 1900),
    buildOrder(4, "delivered", "paid", daysAgo(38), [seedItem(one, 1, 1)], 1900),
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

  return { products: catalogue, users: [demoUser], orders, payments, orderSequence: 4 };
}
