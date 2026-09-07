import { describe, expect, it } from "vitest";
import { priceCart, toListItem, variantLabel } from "#shared/mock/pricing";
import { createMockState } from "#shared/mock/state";

const db = createMockState();

const product = db.products.find((candidate) => candidate.slug === "iz-one-pro")!;
const inStock = product.variants.find((variant) => variant.stock > 0)!;
const outOfStock = product.variants.find((variant) => variant.stock === 0)!;

describe("priceCart", () => {
  it("multiplies unit price by quantity", () => {
    const preview = priceCart(db, [{ productId: product.id, variantId: inStock.id, quantity: 3 }]);

    expect(preview.lines).toHaveLength(1);
    expect(preview.lines[0]!.lineTotalCents).toBe(inStock.priceCents * 3);
    expect(preview.totals.subtotalCents).toBe(inStock.priceCents * 3);
  });

  it("adds the delivery price only when there is something to ship", () => {
    const withItems = priceCart(db, [{ productId: product.id, variantId: inStock.id, quantity: 1 }], "standard");
    const empty = priceCart(db, [], "standard");

    expect(withItems.totals.deliveryCents).toBe(1900);
    expect(withItems.totals.totalCents).toBe(withItems.totals.subtotalCents + 1900);
    expect(empty.totals.deliveryCents).toBe(0);
    expect(empty.totals.totalCents).toBe(0);
  });

  it("charges nothing for an out-of-stock line and flags it", () => {
    const preview = priceCart(db, [{ productId: product.id, variantId: outOfStock.id, quantity: 2 }]);

    expect(preview.unavailableCount).toBe(1);
    expect(preview.lines[0]!.available).toBe(false);
    expect(preview.lines[0]!.lineTotalCents).toBe(0);
    expect(preview.totals.totalCents).toBe(0);
  });

  it("drops lines that no longer exist in the catalogue", () => {
    const preview = priceCart(db, [{ productId: "p_gone", variantId: "v_gone", quantity: 1 }]);

    expect(preview.lines).toHaveLength(0);
    expect(preview.totals.subtotalCents).toBe(0);
  });

  it("clamps quantities to a sane range", () => {
    const tooMany = priceCart(db, [{ productId: product.id, variantId: inStock.id, quantity: 999 }]);
    const tooFew = priceCart(db, [{ productId: product.id, variantId: inStock.id, quantity: 0 }]);

    expect(tooMany.lines[0]!.quantity).toBe(10);
    expect(tooFew.lines[0]!.quantity).toBe(1);
  });
});

describe("toListItem", () => {
  it("exposes the cheapest variant price", () => {
    const item = toListItem(product);
    const cheapest = Math.min(...product.variants.map((variant) => variant.priceCents));

    expect(item.fromPriceCents).toBe(cheapest);
    expect(item.inStock).toBe(true);
  });

  it("marks a product with no stock as unavailable", () => {
    const field = db.products.find((candidate) => candidate.slug === "iz-field")!;
    expect(toListItem(field).inStock).toBe(false);
  });
});

describe("variantLabel", () => {
  it("reads as storage then colour", () => {
    expect(variantLabel(inStock)).toBe(`${inStock.storageGb} GB · ${inStock.color}`);
  });
});
