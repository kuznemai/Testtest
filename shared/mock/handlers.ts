import type {
  CartItemInput,
  DeliveryMethodId,
  Order,
  PaymentMethodId,
  PaymentStatus,
  ShippingAddress,
  User,
} from "../types";
import { DELIVERY_OPTIONS, findDeliveryOption, priceCart, toListItem } from "./pricing";
import { createId, type MockState, type MockUser } from "./state";
import { buildTracking } from "./tracking";

/**
 * The whole mock backend, as one transport-free dispatcher.
 *
 * Nitro calls it in `server/api/[...path].ts`; the static GitHub Pages build calls it
 * straight from the browser. One implementation, two adapters — and deleting this
 * directory plus the Nitro route is the entire migration to a real backend.
 */

export interface MockRequest {
  method: string;
  /** Path without the `/api` prefix, e.g. `orders/o_1/tracking`. */
  path: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
  /** Resolved from the session cookie (Nitro) or browser storage (static demo). */
  userId: string | null;
}

export interface MockResponse {
  status: number;
  body: unknown;
  /** Present when the request opened or closed a session. */
  session?: { userId: string | null };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PAYMENT_METHODS: PaymentMethodId[] = ["card", "crypto", "on_delivery"];
const PAYMENT_OUTCOMES: PaymentStatus[] = ["paid", "failed", "cancelled"];
const CANCELLABLE: Order["status"][] = ["created", "awaiting_payment"];

function fail(status: number, message: string, fields?: Record<string, string>): MockResponse {
  return {
    status,
    body: {
      statusCode: status,
      statusMessage: message,
      ...(fields ? { data: { fields } } : {}),
    },
  };
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function publicUser(user: MockUser): User {
  const { password: _password, ...rest } = user;
  return rest;
}

function currentUser(state: MockState, userId: string | null): MockUser | null {
  return userId ? (state.users.find((user) => user.id === userId) ?? null) : null;
}

export function handleMockRequest(state: MockState, request: MockRequest): MockResponse {
  const segments = request.path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const method = request.method.toUpperCase();
  const body = (request.body ?? {}) as Record<string, unknown>;
  const [resource, second, third] = segments;

  /* ------------------------------------------------------------- catalogue */

  if (resource === "products" && method === "GET") {
    if (second) {
      const product = state.products.find((candidate) => candidate.slug === second);
      return product ? { status: 200, body: product } : fail(404, "Product not found");
    }

    let items = state.products.map(toListItem);
    const search = request.query?.search?.trim().toLowerCase();
    if (search) {
      items = items.filter(
        (item) => item.title.toLowerCase().includes(search) || item.tagline.toLowerCase().includes(search),
      );
    }

    const sort = request.query?.sort;
    if (sort === "price") items.sort((a, b) => a.fromPriceCents - b.fromPriceCents);
    else if (sort === "-price") items.sort((a, b) => b.fromPriceCents - a.fromPriceCents);
    else items.sort((a, b) => a.title.localeCompare(b.title));

    return { status: 200, body: { items, total: items.length } };
  }

  if (resource === "catalog" && second === "delivery-options" && method === "GET") {
    return { status: 200, body: DELIVERY_OPTIONS };
  }

  if (resource === "cart" && second === "preview" && method === "POST") {
    const items = Array.isArray(body.items) ? (body.items as CartItemInput[]) : [];
    return { status: 200, body: priceCart(state, items, body.deliveryMethodId as DeliveryMethodId) };
  }

  /* ------------------------------------------------------------------ auth */

  if (resource === "auth") {
    if (second === "register" && method === "POST") {
      const name = asString(body.name);
      const email = asString(body.email).toLowerCase();
      const password = typeof body.password === "string" ? body.password : "";

      const errors: Record<string, string> = {};
      if (name.length < 2) errors.name = "Enter your name";
      if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
      if (password.length < 8) errors.password = "Use at least 8 characters";
      if (state.users.some((user) => user.email === email)) errors.email = "This email is already registered";
      if (Object.keys(errors).length > 0) return fail(422, "Please check the highlighted fields", errors);

      const user: MockUser = {
        id: createId("u"),
        email,
        name,
        phone: null,
        createdAt: new Date().toISOString(),
        password,
      };
      state.users.push(user);
      return { status: 200, body: publicUser(user), session: { userId: user.id } };
    }

    if (second === "login" && method === "POST") {
      const email = asString(body.email).toLowerCase();
      const password = typeof body.password === "string" ? body.password : "";
      const user = state.users.find((candidate) => candidate.email === email);

      if (!user || user.password !== password) return fail(401, "Wrong email or password");
      return { status: 200, body: publicUser(user), session: { userId: user.id } };
    }

    if (second === "logout" && method === "POST") {
      return { status: 200, body: { ok: true }, session: { userId: null } };
    }

    if (second === "me" && method === "GET") {
      const user = currentUser(state, request.userId);
      return { status: 200, body: { user: user ? publicUser(user) : null } };
    }

    if (second === "me" && method === "PATCH") {
      const user = currentUser(state, request.userId);
      if (!user) return fail(401, "Authentication required");

      const name = asString(body.name);
      const email = asString(body.email).toLowerCase();
      const errors: Record<string, string> = {};
      if (name.length < 2) errors.name = "Enter your name";
      if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
      if (Object.keys(errors).length > 0) return fail(422, "Please check the highlighted fields", errors);

      user.name = name;
      user.email = email;
      user.phone = asString(body.phone) || null;
      return { status: 200, body: publicUser(user) };
    }
  }

  /* ---------------------------------------------------------------- orders */

  if (resource === "orders") {
    const user = currentUser(state, request.userId);
    if (!user) return fail(401, "Authentication required");

    if (!second && method === "GET") {
      const items = state.orders
        .filter((order) => order.userId === user.id)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .map((order) => ({
          id: order.id,
          number: order.number,
          createdAt: order.createdAt,
          status: order.status,
          totalCents: order.totals.totalCents,
          currency: order.totals.currency,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          previewImages: order.items.slice(0, 3).map((item) => item.image),
        }));
      return { status: 200, body: items };
    }

    if (!second && method === "POST") return createOrder(state, user, body);

    const order = state.orders.find((candidate) => candidate.id === second && candidate.userId === user.id);
    if (!order) return fail(404, "Order not found");

    if (!third && method === "GET") return { status: 200, body: order };
    if (third === "tracking" && method === "GET") return { status: 200, body: buildTracking(order) };

    if (third === "cancel" && method === "POST") {
      if (!CANCELLABLE.includes(order.status)) return fail(409, "This order can no longer be cancelled");

      order.status = "cancelled";
      order.payment.status = "cancelled";
      order.updatedAt = new Date().toISOString();

      const payment = state.payments.find((candidate) => candidate.id === order.payment.paymentId);
      if (payment?.status === "pending") {
        payment.status = "cancelled";
        payment.updatedAt = order.updatedAt;
      }
      return { status: 200, body: order };
    }
  }

  /* -------------------------------------------------------------- payments */

  if (resource === "payments") {
    const user = currentUser(state, request.userId);
    if (!user) return fail(401, "Authentication required");

    if (!second && method === "POST") return startPayment(state, user.id, asString(body.orderId));

    const payment = state.payments.find((candidate) => candidate.id === second);
    const order = payment && state.orders.find((candidate) => candidate.id === payment.orderId);
    if (!payment || !order || order.userId !== user.id) return fail(404, "Payment not found");

    if (!third && method === "GET") return { status: 200, body: payment };

    if (third === "complete" && method === "POST") {
      if (payment.status !== "pending") return fail(409, "This payment is already closed");

      const outcome = PAYMENT_OUTCOMES.includes(body.outcome as PaymentStatus)
        ? (body.outcome as PaymentStatus)
        : "failed";
      const now = new Date().toISOString();

      payment.status = outcome;
      payment.updatedAt = now;
      order.payment.status = outcome;
      order.updatedAt = now;

      if (outcome === "paid") order.status = "paid";
      else if (outcome === "cancelled") order.status = "awaiting_payment";

      return { status: 200, body: payment };
    }
  }

  return fail(404, "Not found");
}

function createOrder(state: MockState, user: MockUser, body: Record<string, unknown>): MockResponse {
  const items = Array.isArray(body.items) ? (body.items as CartItemInput[]) : [];
  if (items.length === 0) return fail(400, "Your cart is empty");

  const delivery = findDeliveryOption(String(body.deliveryMethodId ?? ""));
  const paymentMethodId = PAYMENT_METHODS.includes(body.paymentMethodId as PaymentMethodId)
    ? (body.paymentMethodId as PaymentMethodId)
    : null;

  const address = (body.address ?? {}) as Partial<ShippingAddress>;
  const fullName = asString(address.fullName);
  const phone = asString(address.phone);
  const email = asString(address.email);
  const country = asString(address.country);
  const city = asString(address.city);
  const street = asString(address.street);
  const postalCode = asString(address.postalCode);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "Enter the recipient name";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (!country) errors.country = "Enter a country";
  if (!city) errors.city = "Enter a city";
  if (street.length < 4) errors.street = "Enter a street and building";
  if (!postalCode) errors.postalCode = "Enter a postal code";
  if (!delivery) errors.deliveryMethodId = "Choose a delivery method";
  if (!paymentMethodId) errors.paymentMethodId = "Choose a payment method";
  if (Object.keys(errors).length > 0) return fail(422, "Please check the highlighted fields", errors);

  const priced = priceCart(state, items, delivery!.id);
  if (priced.lines.length === 0) return fail(400, "Your cart is empty");
  if (priced.unavailableCount > 0) {
    return fail(409, "Some items went out of stock. Please review your cart.");
  }

  const now = new Date().toISOString();
  state.orderSequence += 1;

  const order = {
    id: createId("o"),
    userId: user.id,
    number: `IZ-${1000 + state.orderSequence}`,
    createdAt: now,
    updatedAt: now,
    status: (paymentMethodId === "on_delivery" ? "created" : "awaiting_payment") as Order["status"],
    items: priced.lines.map(({ available: _available, maxQuantity: _maxQuantity, ...item }) => item),
    totals: priced.totals,
    delivery: {
      methodId: delivery!.id,
      title: delivery!.title,
      priceCents: delivery!.priceCents,
      etaDaysMin: delivery!.etaDaysMin,
      etaDaysMax: delivery!.etaDaysMax,
    },
    payment: { methodId: paymentMethodId!, status: "pending" as PaymentStatus, paymentId: null },
    address: { fullName, phone, email, country, city, street, postalCode, comment: asString(address.comment) || undefined },
  };

  // Reserve stock so the "out of stock" states in the UI are reachable.
  for (const item of order.items) {
    const variant = state.products
      .find((product) => product.id === item.productId)
      ?.variants.find((candidate) => candidate.id === item.variantId);
    if (variant) variant.stock = Math.max(0, variant.stock - item.quantity);
  }

  state.orders.push(order);
  return { status: 200, body: order };
}

function startPayment(state: MockState, userId: string, orderId: string): MockResponse {
  const order = state.orders.find((candidate) => candidate.id === orderId && candidate.userId === userId);
  if (!order) return fail(404, "Order not found");
  if (order.status === "cancelled") return fail(409, "This order was cancelled");
  if (order.payment.status === "paid") return fail(409, "This order is already paid");

  const existing = state.payments.find(
    (candidate) => candidate.orderId === order.id && candidate.status === "pending",
  );
  if (existing) return { status: 200, body: existing };

  const now = new Date().toISOString();
  const id = createId("pay");
  const payment = {
    id,
    orderId: order.id,
    orderNumber: order.number,
    methodId: order.payment.methodId,
    status: "pending" as PaymentStatus,
    amountCents: order.totals.totalCents,
    currency: order.totals.currency,
    redirectUrl: `/payment/${id}`,
    createdAt: now,
    updatedAt: now,
  };

  state.payments.push(payment);
  order.payment.paymentId = payment.id;
  order.payment.status = "pending";
  order.status = "awaiting_payment";
  order.updatedAt = now;

  return { status: 200, body: payment };
}
