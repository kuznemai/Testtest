# Frontend → backend API contract

Everything below is implemented today by the mock backend in `server/api`, and the
frontend talks to it exclusively through `app/api/*`. When the real backend is ready,
point `NUXT_PUBLIC_API_BASE` at it and delete `server/api` — no page, component or
store has to change as long as these shapes hold.

TypeScript definitions for every payload live in [`shared/types/index.ts`](../shared/types/index.ts).

## Conventions

- **Money** is always an integer in minor units (cents), field name ends in `Cents`.
  `currency` is an ISO-4217 code (`"USD"` today).
- **Dates** are ISO-8601 UTC strings.
- **Authentication** is a session cookie: `Set-Cookie: iz_session=…; HttpOnly; SameSite=Lax; Secure`.
  The frontend sends `credentials: "include"` and never reads or stores a token.
- **Errors** use the standard `{ statusCode, statusMessage, data? }` body.
  For form validation return `422` with `data.fields = { <fieldName>: <message> }`;
  the frontend maps those onto the matching inputs (`app/utils/api-error.ts`).

| Status | Frontend behaviour |
| --- | --- |
| `401` | Route middleware sends the visitor to `/login?redirect=…` |
| `404` | Renders the app's 404 page |
| `409` | Shown as an inline message (e.g. "already paid", "out of stock") |
| `422` | Field errors highlighted in the form |
| `5xx` | Error state with a "Try again" button |

---

## Catalogue — public

### `GET /products`

Query: `search?: string`, `sort?: "title" | "price" | "-price"`.

```jsonc
{ "items": ProductListItem[], "total": number }
```

`ProductListItem`: `{ id, slug, title, tagline, image, fromPriceCents, inStock, badge? }`.
`fromPriceCents` is the cheapest variant. `inStock` is true when any variant has stock.

### `GET /products/:slug`

Returns a `Product`: the list fields plus `description`, `highlights[]`, `images[]`,
`specs[] ({ label, value })` and `variants[]`.

`ProductVariant`: `{ id, storageGb, color, colorHex, priceCents, stock }`.
`stock` is a number so the UI can show "only N left"; `0` disables ordering.

### `GET /catalog/delivery-options`

`DeliveryOption[]`: `{ id: "standard" | "express" | "pickup", title, description, priceCents, etaDaysMin, etaDaysMax }`.

---

## Cart — public

### `POST /cart/preview`

The client stores only ids and quantities; **every amount comes from the server.**

Request: `{ items: [{ productId, variantId, quantity }], deliveryMethodId? }`
Response: `CartPreview`

```jsonc
{
  "lines": [{ "productId", "variantId", "slug", "title", "variantLabel", "image",
              "unitPriceCents", "quantity", "lineTotalCents",
              "available": true, "maxQuantity": 10 }],
  "unavailableCount": 0,
  "totals": { "currency": "USD", "subtotalCents", "deliveryCents", "discountCents", "totalCents" }
}
```

Unknown products are dropped silently; out-of-stock lines come back with
`available: false` and `lineTotalCents: 0` so the shopper is told what to remove.

---

## Auth

| Method | URL | Body | Response |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `{ name, email, password }` | `User` + session cookie |
| `POST` | `/auth/login` | `{ email, password }` | `User` + session cookie |
| `POST` | `/auth/logout` | — | `{ ok: true }`, cookie cleared |
| `GET` | `/auth/me` | — | `{ user: User \| null }` |
| `PATCH` | `/auth/me` | `{ name, email, phone }` | `User` (401 for guests) |

`User`: `{ id, email, name, phone: string | null, createdAt }`.

`GET /auth/me` must return `200 { user: null }` for a guest rather than `401` —
the app renders public pages for anonymous visitors during SSR.

Register/login validation errors are `422` with `data.fields` keyed by
`name` / `email` / `password`. A wrong password is `401 "Wrong email or password"`.

**Not implemented yet:** password recovery (needs transactional email) and email
verification. The sign-in page links to them as a placeholder.

---

## Orders — authenticated

### `GET /orders`

`OrderListItem[]`, newest first: `{ id, number, createdAt, status, totalCents, currency, itemCount, previewImages[] }`.

### `POST /orders`

```jsonc
{
  "items": [{ "productId", "variantId", "quantity" }],
  "deliveryMethodId": "standard",
  "paymentMethodId": "card" | "crypto" | "on_delivery",
  "address": { "fullName", "phone", "email", "country", "city", "street", "postalCode", "comment"? }
}
```

The backend **must re-price the order from the ids** and ignore any amount the client
might send. Returns the created `Order`.

- `400` empty cart
- `409` an item went out of stock between cart and checkout
- `422` address validation, `data.fields` keyed by the address field names

New orders start at `awaiting_payment`, or `created` when `paymentMethodId` is `on_delivery`.

### `GET /orders/:id`

Full `Order`: `{ id, number, createdAt, updatedAt, status, items[], totals, delivery, payment, address }`.
Must 404 for an order belonging to a different user.

`OrderStatus`: `created | awaiting_payment | paid | processing | shipped | delivered | cancelled`.

### `POST /orders/:id/cancel`

Allowed only while the status is `created` or `awaiting_payment`, otherwise `409`.
Returns the updated `Order`.

---

## Delivery tracking — authenticated

### `GET /orders/:id/tracking`

```jsonc
{
  "orderId", "orderNumber", "status",
  "carrier": "IZ Logistics" | null,
  "trackingNumber": string | null,
  "expectedDeliveryAt": string | null,
  "events": [{ "status", "title", "description", "at": string | null, "done": boolean }]
}
```

The frontend renders `events` as-is, in order — the backend decides the steps and their
copy. `at: null` marks a step that has not happened yet. A never-past
`expectedDeliveryAt` is expected for orders still in flight.

**Not implemented:** a real carrier integration. Today the events are derived from the
order status.

---

## Payments — authenticated

### `POST /payments`

Request `{ orderId }`, response `Payment`:

```jsonc
{ "id", "orderId", "orderNumber", "methodId", "status": "pending",
  "amountCents", "currency", "redirectUrl", "createdAt", "updatedAt" }
```

`redirectUrl` is where the shopper is sent to pay. In the mock it is an in-app page
(`/payment/:id`); with a real provider it becomes the provider's hosted URL and the
frontend flow does not change. Repeating the call for an order that already has a
pending payment returns the same payment.

- `409` order already paid or cancelled

### `GET /payments/:id`

Returns the `Payment`. `PaymentStatus`: `pending | paid | failed | cancelled`.

### `POST /payments/:id/complete` — **mock only**

Exists purely so the success / failure / cancelled screens are reachable without a
provider. With a real PSP this is replaced by a provider webhook to the backend, and
the frontend only reads `GET /payments/:id` after the redirect back.

**Card data is never collected by this frontend** and must stay that way — the provider
owns that form.

---

## What the backend owns (the frontend must not be trusted)

- Order totals, delivery prices and discounts
- Stock and availability
- Order and payment status transitions
- Whether the current user may see an order or payment
- Session lifetime and revocation
