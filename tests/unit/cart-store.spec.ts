import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCartStore } from "~/stores/cart";

describe("cart store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts empty", () => {
    const cart = useCartStore();
    expect(cart.isEmpty).toBe(true);
    expect(cart.count).toBe(0);
  });

  it("merges a repeated add into one line", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.add("p1", "v1", 2);

    expect(cart.items).toHaveLength(1);
    expect(cart.quantityOf("p1", "v1")).toBe(3);
    expect(cart.count).toBe(3);
  });

  it("keeps different variants of one product apart", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.add("p1", "v2");

    expect(cart.items).toHaveLength(2);
    expect(cart.count).toBe(2);
  });

  it("caps the quantity per line", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 50);
    expect(cart.quantityOf("p1", "v1")).toBe(10);

    cart.setQuantity("p1", "v1", 99);
    expect(cart.quantityOf("p1", "v1")).toBe(10);
  });

  it("removes the line when the quantity drops to zero", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.setQuantity("p1", "v1", 0);

    expect(cart.items).toHaveLength(0);
    expect(cart.isEmpty).toBe(true);
  });

  it("derives count from items rather than tracking it separately", () => {
    const cart = useCartStore();
    cart.add("p1", "v1", 2);
    cart.add("p2", "v9", 3);
    cart.remove("p1", "v1");

    expect(cart.count).toBe(3);
  });

  it("clears everything", () => {
    const cart = useCartStore();
    cart.add("p1", "v1");
    cart.clear();

    expect(cart.isEmpty).toBe(true);
  });
});
