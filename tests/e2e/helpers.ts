import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const DEMO_USER = { email: "demo@iz.example", password: "demo1234" };

/** Registers a fresh account; the mock backend keeps users in memory per run. */
export async function registerNewUser(page: Page): Promise<{ email: string; name: string }> {
  const email = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}@iz.example`;
  const name = "Test Shopper";

  await page.goto("/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("supersecret1");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/profile");

  return { email, name };
}

export async function signIn(page: Page, user = DEMO_USER): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
}

/** Opens a product, picks the first in-stock configuration and adds it to the cart. */
export async function addFirstProductToCart(page: Page, slug = "iz-one-pro"): Promise<void> {
  await page.goto(`/product/${slug}`);
  const addButton = page.getByTestId("add-to-cart");
  await expect(addButton).toBeEnabled();
  await addButton.click();
  await expect(page.getByRole("link", { name: /Go to cart/ })).toBeVisible();
}

export async function fillCheckoutForm(page: Page): Promise<void> {
  await page.getByLabel("Full name").fill("Test Shopper");
  await page.getByLabel("Phone").fill("+15550100999");
  await page.getByLabel("Email").fill("shopper@iz.example");
  await page.getByLabel("Country").fill("United Arab Emirates");
  await page.getByLabel("City").fill("Dubai");
  await page.getByLabel("Street and building").fill("Sheikh Zayed Road 12");
  await page.getByLabel("Postal code").fill("00000");
}
