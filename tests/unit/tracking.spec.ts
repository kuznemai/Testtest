import { describe, expect, it } from "vitest";
import type { Order } from "#shared/types";
import { buildTracking } from "#shared/mock/tracking";
import { createMockState } from "#shared/mock/state";

const db = createMockState();

function orderWithStatus(status: Order["status"]): Order {
  const base = db.orders[0]!;
  return { ...base, status, createdAt: "2026-03-01T00:00:00.000Z", updatedAt: "2026-03-02T00:00:00.000Z" };
}

describe("buildTracking", () => {
  it("marks every step done for a delivered order", () => {
    const tracking = buildTracking(orderWithStatus("delivered"));

    expect(tracking.events).toHaveLength(5);
    expect(tracking.events.every((event) => event.done)).toBe(true);
    expect(tracking.carrier).toBe("IZ Logistics");
    expect(tracking.trackingNumber).toBeTruthy();
  });

  it("stops at the current step for a shipped order", () => {
    const tracking = buildTracking(orderWithStatus("shipped"));

    expect(tracking.events.filter((event) => event.done)).toHaveLength(4);
    expect(tracking.events.at(-1)!.done).toBe(false);
    expect(tracking.events.at(-1)!.at).toBeNull();
  });

  it("shows only the created step while payment is pending", () => {
    const tracking = buildTracking(orderWithStatus("awaiting_payment"));

    expect(tracking.events.filter((event) => event.done)).toHaveLength(1);
    expect(tracking.events[1]!.title).toBe("Awaiting payment");
    expect(tracking.carrier).toBeNull();
  });

  it("collapses a cancelled order to two events with no delivery date", () => {
    const tracking = buildTracking(orderWithStatus("cancelled"));

    expect(tracking.events.map((event) => event.status)).toEqual(["created", "cancelled"]);
    expect(tracking.expectedDeliveryAt).toBeNull();
  });
});
