import type { Order, OrderStatus, OrderTracking, TrackingEvent } from "../types";

/** Fulfilment steps a healthy order walks through, in order. */
const FLOW: OrderStatus[] = ["created", "paid", "processing", "shipped", "delivered"];

const STEP_COPY: Record<OrderStatus, { title: string; description: string }> = {
  created: { title: "Order placed", description: "We received your order and reserved the devices." },
  awaiting_payment: { title: "Awaiting payment", description: "Complete the payment to start fulfilment." },
  paid: { title: "Payment confirmed", description: "Payment cleared and the order moved to our warehouse." },
  processing: { title: "Preparing your device", description: "Configuring IZ OS and running the pre-ship checks." },
  shipped: { title: "Handed to the carrier", description: "The parcel is on its way to the delivery address." },
  delivered: { title: "Delivered", description: "The parcel was handed over at the delivery address." },
  cancelled: { title: "Order cancelled", description: "The order was cancelled and any payment was released." },
};

function reachedIndex(status: OrderStatus): number {
  if (status === "awaiting_payment" || status === "created") return 0;
  return Math.max(0, FLOW.indexOf(status));
}

export function buildTracking(order: Order): OrderTracking {
  const created = new Date(order.createdAt).getTime();

  if (order.status === "cancelled") {
    const events: TrackingEvent[] = [
      { status: "created", ...STEP_COPY.created, at: order.createdAt, done: true },
      { status: "cancelled", ...STEP_COPY.cancelled, at: order.updatedAt, done: true },
    ];
    return {
      orderId: order.id,
      orderNumber: order.number,
      status: order.status,
      carrier: null,
      trackingNumber: null,
      expectedDeliveryAt: null,
      events,
    };
  }

  const reached = reachedIndex(order.status);
  const events: TrackingEvent[] = FLOW.map((status, index) => {
    const done = index <= reached;
    const isAwaitingPayment = order.status === "awaiting_payment" && status === "paid";
    const step = isAwaitingPayment ? STEP_COPY.awaiting_payment : STEP_COPY[status];

    return {
      status,
      title: step.title,
      description: step.description,
      // Steps are spread one day apart from the order date — enough for a readable timeline.
      at: done ? new Date(created + index * 86_400_000).toISOString() : null,
      done,
    };
  });

  const shipped = order.status === "shipped" || order.status === "delivered";
  // An order still in flight must never advertise a delivery date in the past.
  const estimate = Math.max(created + order.delivery.etaDaysMax * 86_400_000, Date.now() + 86_400_000);
  const expectedDeliveryAt =
    order.status === "delivered" ? events[FLOW.indexOf("delivered")]!.at : new Date(estimate).toISOString();

  return {
    orderId: order.id,
    orderNumber: order.number,
    status: order.status,
    carrier: shipped ? "IZ Logistics" : null,
    trackingNumber: shipped ? `IZL${order.number.replace(/\D/g, "")}AE` : null,
    expectedDeliveryAt,
    events,
  };
}
