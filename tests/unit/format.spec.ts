import { describe, expect, it } from "vitest";
import { formatDate, formatEta, formatPrice, ORDER_STATUS_LABELS } from "~/utils/format";

describe("formatPrice", () => {
  it("renders whole amounts without decimals", () => {
    expect(formatPrice(119900)).toBe("$1,199");
  });

  it("keeps cents when the amount is not whole", () => {
    expect(formatPrice(119950)).toBe("$1,199.50");
  });

  it("never renders NaN for missing data", () => {
    expect(formatPrice(undefined)).toBe("$0");
    expect(formatPrice(Number.NaN)).toBe("$0");
  });
});

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-03-14T10:00:00.000Z")).toBe("14 Mar 2026");
  });

  it("never renders Invalid Date", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });
});

describe("formatEta", () => {
  it("collapses an equal range", () => {
    expect(formatEta(2, 2)).toBe("2 days");
  });

  it("renders a range", () => {
    expect(formatEta(3, 6)).toBe("3–6 days");
  });
});

describe("order status labels", () => {
  it("covers every status in the domain model", () => {
    expect(Object.keys(ORDER_STATUS_LABELS)).toEqual([
      "created",
      "awaiting_payment",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]);
  });
});
