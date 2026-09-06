import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPhone, normalizePhone, safeRedirectPath } from "~/utils/validation";

describe("normalizePhone", () => {
  it("keeps an international number", () => {
    expect(normalizePhone("+1 (555) 010-0123")).toBe("+15550100123");
  });

  it("converts a leading 8 to +7", () => {
    expect(normalizePhone("8 916 123 45 67")).toBe("+79161234567");
  });

  it("rejects numbers that are too short or too long", () => {
    expect(normalizePhone("12345")).toBe("");
    expect(normalizePhone("1234567890123456")).toBe("");
  });
});

describe("isValidEmail", () => {
  it.each(["a@b.co", "marina.k@iz.example"])("accepts %s", (value) => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each(["", "a@b", "a b@c.com", "@b.com"])("rejects %s", (value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("mirrors normalizePhone", () => {
    expect(isValidPhone("+15550100123")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
  });
});

describe("safeRedirectPath", () => {
  it("allows in-app paths", () => {
    expect(safeRedirectPath("/profile/orders")).toBe("/profile/orders");
  });

  it("blocks protocol-relative and absolute URLs", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/");
    expect(safeRedirectPath("https://evil.com")).toBe("/");
    expect(safeRedirectPath("http://evil.com/x")).toBe("/");
  });

  it("falls back for junk input", () => {
    expect(safeRedirectPath(undefined, "/shop")).toBe("/shop");
    expect(safeRedirectPath("%E0%A4%A", "/shop")).toBe("/shop");
  });
});
