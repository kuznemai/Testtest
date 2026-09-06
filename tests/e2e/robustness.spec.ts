import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { addFirstProductToCart, signIn } from "./helpers";

test("unknown URL renders the 404 page, not a blank screen", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("unknown order renders the 404 page", async ({ page }) => {
  await signIn(page);
  const response = await page.goto("/profile/orders/o_does_not_exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("a protected page sends a guest to sign-in and back again", async ({ page }) => {
  await page.goto("/profile/orders");
  await page.waitForURL((url) => url.pathname === "/login" && url.search.includes("/profile/orders"));

  await page.getByLabel("Email").fill("demo@iz.example");
  await page.getByLabel("Password").fill("demo1234");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/profile/orders");
  await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();
});

test("reloading an authenticated page keeps the session (SSR)", async ({ page }) => {
  await signIn(page);
  await page.goto("/profile/orders");
  await page.reload();

  await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();
  await expect(page).toHaveURL(/\/profile\/orders$/);
});

test("wrong credentials show an error instead of signing in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@iz.example");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByTestId("login-error")).toHaveText("Wrong email or password");
  await expect(page).toHaveURL(/\/login/);
});

test("a failing catalogue request shows a retry state", async ({ page }) => {
  // Start elsewhere so the catalogue is fetched by the browser rather than during SSR.
  await page.goto("/contact");
  await page.route("**/api/products*", (route) => route.fulfill({ status: 500, body: "{}" }));
  await page.getByRole("link", { name: "Devices" }).first().click();

  await expect(page.getByText("We could not load the catalogue")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("browser back and forward keep the user on real pages", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: "IZ Air" }).first().click();
  await page.waitForURL("**/product/iz-air");

  await page.goBack();
  await expect(page).toHaveURL(/\/shop$/);

  await page.goForward();
  await expect(page).toHaveURL(/\/product\/iz-air$/);
});

const PUBLIC_PATHS = ["/", "/shop", "/product/iz-one-pro", "/cart", "/login", "/register", "/favorites", "/offer", "/contact"];
const AUTHED_PATHS = ["/checkout", "/profile", "/profile/orders", "/profile/orders/o_seed_3", "/profile/orders/o_seed_3/tracking"];

async function expectNoHorizontalOverflow(page: Page, path: string): Promise<void> {
  await page.goto(path);
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflows, `${path} overflows horizontally at ${page.viewportSize()?.width}px`).toBe(false);
}

test("no public page scrolls horizontally", async ({ page }) => {
  for (const path of PUBLIC_PATHS) {
    await expectNoHorizontalOverflow(page, path);
  }
});

test("no account page scrolls horizontally", async ({ page }) => {
  await signIn(page);
  await addFirstProductToCart(page);

  for (const path of AUTHED_PATHS) {
    await expectNoHorizontalOverflow(page, path);
  }
});

// 320px is the narrowest layout the design has to survive.
test.describe("narrow viewports", () => {
  for (const width of [320, 360, 430]) {
    test(`nothing overflows at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 780 });
      for (const path of PUBLIC_PATHS) {
        await expectNoHorizontalOverflow(page, path);
      }
    });
  }
});
