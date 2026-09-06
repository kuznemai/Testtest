import type { CartItemInput, DeliveryMethodId, Order, PaymentMethodId, ShippingAddress } from "#shared/types";
import { createId, db } from "~~/server/utils/db";
import { findDeliveryOption, priceCart } from "~~/server/utils/catalog";
import { requireUser } from "~~/server/utils/session";
import { asString, EMAIL_PATTERN, fieldErrors } from "~~/server/utils/validation";

interface Body {
  items?: CartItemInput[];
  deliveryMethodId?: DeliveryMethodId;
  paymentMethodId?: PaymentMethodId;
  address?: Partial<ShippingAddress>;
}

const PAYMENT_METHODS: PaymentMethodId[] = ["card", "crypto", "on_delivery"];

/** POST /api/orders — creates an order from ids only; prices are recomputed here. */
export default defineEventHandler(async (event): Promise<Order> => {
  const user = requireUser(event);
  const body = await readBody<Body>(event);

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Your cart is empty" });
  }

  const delivery = findDeliveryOption(body?.deliveryMethodId ?? "");
  const paymentMethodId = PAYMENT_METHODS.includes(body?.paymentMethodId as PaymentMethodId)
    ? (body!.paymentMethodId as PaymentMethodId)
    : null;

  const address = body?.address ?? {};
  const errors: Record<string, string> = {};
  const fullName = asString(address.fullName);
  const phone = asString(address.phone);
  const email = asString(address.email);
  const country = asString(address.country);
  const city = asString(address.city);
  const street = asString(address.street);
  const postalCode = asString(address.postalCode);

  if (fullName.length < 2) errors.fullName = "Enter the recipient name";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (!country) errors.country = "Enter a country";
  if (!city) errors.city = "Enter a city";
  if (street.length < 4) errors.street = "Enter a street and building";
  if (!postalCode) errors.postalCode = "Enter a postal code";
  if (!delivery) errors.deliveryMethodId = "Choose a delivery method";
  if (!paymentMethodId) errors.paymentMethodId = "Choose a payment method";
  if (Object.keys(errors).length > 0) fieldErrors(errors);

  const priced = priceCart(items, delivery!.id);
  if (priced.lines.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Your cart is empty" });
  }
  if (priced.unavailableCount > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Some items went out of stock. Please review your cart.",
    });
  }

  const now = new Date().toISOString();
  db.orderSequence += 1;

  const order = {
    id: createId("o"),
    userId: user.id,
    number: `IZ-${1000 + db.orderSequence}`,
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
    payment: {
      methodId: paymentMethodId!,
      status: (paymentMethodId === "on_delivery" ? "pending" : "pending") as Order["payment"]["status"],
      paymentId: null,
    },
    address: { fullName, phone, email, country, city, street, postalCode, comment: asString(address.comment) || undefined },
  };

  // Reserve stock so the "out of stock" states in the UI are reachable.
  for (const item of order.items) {
    const variant = db.products
      .find((product) => product.id === item.productId)
      ?.variants.find((candidate) => candidate.id === item.variantId);
    if (variant) variant.stock = Math.max(0, variant.stock - item.quantity);
  }

  db.orders.push(order);
  return order;
});
