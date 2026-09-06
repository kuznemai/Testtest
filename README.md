# IZ Secure — storefront

Nuxt 4 storefront for a line of smartphones running a hardened OS: catalogue,
configuration, cart, checkout, payment, orders and delivery tracking.

The real backend does not exist yet, so the app ships with a **mock API** under
`server/api` backed by an in-memory database. Every screen is fully functional against
it — see [`docs/api-contract.md`](docs/api-contract.md) for the contract the real
backend has to implement.

## Getting started

```bash
npm install
npm run dev
```

The store runs on http://localhost:3000.

Demo account: **demo@iz.example** / **demo1234** — it comes with four seeded orders
(awaiting payment, cancelled, shipped, delivered) so the order and tracking screens have
something real to show. Accounts you register yourself work too, but the in-memory
database resets whenever the server restarts.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `.output` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (`--fix` variant: `npm run lint:fix`) |
| `npm run typecheck` | `vue-tsc` over app, server and shared code |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright, desktop + mobile, against a production build |

`npm run test:e2e` drives the Chrome installed on the machine (`channel: "chrome"`), so
no separate Playwright browser download is needed.

## Layout

```
app/
  api/           one function per backend endpoint — the only place URLs appear
  components/    landing/, product/, cart/, order/, payment/, ui/
  composables/   useCartPreview (server-priced cart), useSeo
  middleware/    auth (protected routes), guest (login/register)
  pages/         file-based routes
  plugins/       api ($fetch instance), session.server, persistence.client
  stores/        cart, auth, favorites
server/
  api/           mock backend
  data/          seed catalogue
  utils/         in-memory db, session cookies, pricing, tracking
shared/types/    domain types used by both sides
```

## Routes

| Path | Notes |
| --- | --- |
| `/` | Landing page |
| `/shop` | Catalogue with search and sorting |
| `/product/[slug]` | Product page with storage/colour configuration |
| `/favorites` | Saved devices (browser-local) |
| `/cart`, `/checkout` | Checkout requires sign-in |
| `/login`, `/register` | Guests only |
| `/profile`, `/profile/orders`, `/profile/orders/[id]`, `/profile/orders/[id]/tracking` | Requires sign-in |
| `/payment/[id]`, `/payment/success`, `/payment/failed`, `/payment/pending` | Payment flow |
| `/offer`, `/contact` | Technology and support pages |

## Configuration

Copy `.env.example` to `.env`. The only variable that matters for switching backends:

```env
NUXT_PUBLIC_API_BASE=/api        # the built-in mock; point at the real API when ready
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never put secrets in `NUXT_PUBLIC_*` — those values are shipped to the browser.

## Deployment

`npm run build` produces a Node server in `.output`; run it with
`node .output/server/index.mjs`. The project used to deploy to GitHub Pages as a static
SPA — that is no longer possible now that it renders on the server and serves an API,
so it needs a Node host.
