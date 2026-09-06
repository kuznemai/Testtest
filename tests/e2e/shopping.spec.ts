import { expect, test } from "@playwright/test";
import { addFirstProductToCart, fillCheckoutForm, registerNewUser, signIn } from "./helpers";

test("catalogue → product → configure → cart → checkout", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Our devices" })).toBeVisible();

  await page.getByRole("link", { name: "IZ One Pro" }).first().click();
  await page.waitForURL("**/product/iz-one-pro");

  const priceBefore = await page.getByTestId("product-price").textContent();
  await page.getByRole("button", { name: /512 GB/ }).click();
  await expect(page.getByTestId("product-price")).not.toHaveText(priceBefore ?? "");

  await page.getByTestId("add-to-cart").click();
  await page.goto("/cart");

  await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();
  await expect(page.getByTestId("cart-total")).toBeVisible();

  await signIn(page);
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Delivery and payment" })).toBeVisible();
});

test("empty cart shows an empty state instead of a checkout button", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByText("Your cart is empty")).toBeVisible();
  await expect(page.getByTestId("go-to-checkout")).toHaveCount(0);
});

test("quantity changes are re-priced by the server", async ({ page }) => {
  await addFirstProductToCart(page);
  await page.goto("/cart");

  const total = page.getByTestId("cart-total");
  const single = await total.textContent();

  await page.getByRole("button", { name: /Increase quantity/ }).click();
  await expect(total).not.toHaveText(single ?? "");

  await page.getByRole("button", { name: /Remove/ }).click();
  await expect(page.getByText("Your cart is empty")).toBeVisible();
});

test("register → profile → sign out", async ({ page }) => {
  const { name } = await registerNewUser(page);

  await expect(page.getByRole("heading", { name })).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL("**/");

  await page.goto("/profile");
  await page.waitForURL("**/login**");
});

test("checkout → order → payment success → order visible in profile", async ({ page }) => {
  await signIn(page);
  await addFirstProductToCart(page);

  await page.goto("/checkout");
  await fillCheckoutForm(page);
  await page.getByTestId("place-order").click();

  await page.waitForURL("**/payment/**");
  await page.getByTestId("pay-success").click();

  await page.waitForURL("**/payment/success**");
  await expect(page.getByRole("heading", { name: "Payment received" })).toBeVisible();

  await page.getByTestId("view-order").click();
  await expect(page.getByText("Paid", { exact: true })).toBeVisible();

  await page.goto("/profile/orders");
  await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();
});

test("declined payment lands on the failure screen and keeps the order payable", async ({ page }) => {
  await signIn(page);
  await addFirstProductToCart(page, "iz-one");

  await page.goto("/checkout");
  await fillCheckoutForm(page);
  await page.getByTestId("place-order").click();

  await page.waitForURL("**/payment/**");
  await page.getByTestId("pay-fail").click();

  await page.waitForURL("**/payment/failed**");
  await expect(page.getByRole("heading", { name: "Payment declined" })).toBeVisible();

  await page.getByTestId("retry-payment").click();
  await expect(page.getByRole("button", { name: "Pay now" })).toBeVisible();
});

test("orders → order → tracking timeline", async ({ page }) => {
  await signIn(page);
  await page.goto("/profile/orders");

  await page.getByTestId("order-IZ-1003").click();
  await page.waitForURL("**/profile/orders/o_seed_3");

  await page.getByTestId("open-tracking").click();
  await page.waitForURL("**/tracking");

  await expect(page.getByText("IZ Logistics")).toBeVisible();
  await expect(page.getByText("Handed to the carrier")).toBeVisible();
  await expect(page.getByText("Delivered", { exact: true })).toBeVisible();
});
