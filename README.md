# Bayse Market

## Overview

This project is a React application that displays real-time market data for a cryptocurrency event. It features a responsive design, with a navigation bar, market header, price chart, order book, trades tape, buy/sell panel, market rules, related markets, join call-to-action, and a footer. The application uses the Bayse API to fetch data and displays it in a user-friendly format.

## Features

- Real-time market data display
- Navigation bar with event image, title, status badge, and ticker stats

---

## Setup

```bash
cp .env.local.example .env.local
# Add your API key:
# NEXT_PUBLIC_BAYSE_API_KEY=your_public_api_key
# NEXT_PUBLIC_BAYSE_API_BASE=https://api.bayse.markets

pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/markets/will-woldl-win-a-grammy-award`.

To view a different market: navigate to `/markets/<event-slug>`.

---

## Architecture

### Data layer (`lib/api.ts`)

Thin fetch wrapper that attaches `X-Public-Key` from `NEXT_PUBLIC_BAYSE_API_KEY`. Every function returns `ApiResult<T>` — either `{ data, error: null }` or `{ data: null, error }`. No exceptions leak into components.

**Mock fallback**: When `NEXT_PUBLIC_BAYSE_API_KEY` is not set or the API returns an error, the app returns hardcoded demo data matching the "Will Wiz Khalifa Win A Grammy Award?" market. This ensures the demo works without any API key configured.

Five endpoints consumed:
| Function | Endpoint |
|---|---|
| `getEventBySlug` | `GET /v1/events/:slug` |
| `getTicker` | `GET /v1/markets/:id/ticker` |
| `getOrderBook` | `GET /v1/markets/:id/orderbook` |
| `getTrades` | `GET /v1/markets/:id/trades` |
| `getPriceHistory` | `GET /v1/markets/:id/price-history` |

### Types (`lib/types.ts`)

All API shapes are typed. Derived types (`AugmentedOrderBook`, `AugmentedOrderLevel`, `OrderBookStats`) are separate to keep raw vs. processed concerns distinct.

### Derived logic (`lib/utils.ts`)

Pure functions:

- `formatPrice(n, decimals?)` — format number with fixed decimals
- `formatVolume(n)` — compact notation (1.2K, 3.4M)
- `computeOrderBookStats(bids, asks)` — best bid/ask, spread, spreadPct, midpoint
- `augmentOrderLevels(levels, maxCumulative)` — adds `cumulativeSize` and `depthPct` for depth bars
- `augmentOrderBook(raw)` — sorts both sides, normalises depth bars across sides, computes stats

### Hooks (`hooks/useMarketData.ts`)

`usePolledData<T>` is a generic hook that handles initial fetch + optional polling interval. Each panel uses a separate hook instance, so a failure in one does **not** affect others.

Polling intervals:
| Hook | Interval |
|---|---|
| `useEvent` | Once (static) |
| `useTicker` | 5 s |
| `useOrderBook` | 2 s |
| `useTrades` | 5 s |
| `usePriceHistory` | 30 s |

### Components

Each panel independently handles: `loading` → skeleton, `error` → error state with retry, `empty` → illustrated empty state, `data` → rendered content.

| Component        | Notes                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `Navbar`         | Bayse logo, nav links, Sign In button                                                            |
| `MarketHeader`   | Event image, title, status badge, ticker stats (price, volume, change)                           |
| `PriceChart`     | Recharts AreaChart, 4 timeframe toggles (1H/1D/1W/All)                                           |
| `OrderBook`      | Depth ladder with proportional background bars, best bid/ask/spread/mid row, Yes/No outcome tabs |
| `TradesTape`     | Scrollable tape, colour-coded by taker side                                                      |
| `BuySellPanel`   | Toggle, price/size inputs, order summary. **UI only — no write calls.**                          |
| `MarketRules`    | Resolution criteria text                                                                         |
| `RelatedMarkets` | Related market links                                                                             |
| `JoinCTA`        | Blue CTA banner with QR code                                                                     |
| `Footer`         | Link columns, social icons, legal                                                                |

---

## Tests

```bash
pnpm test          # run once
pnpm run test:watch  # watch mode
```

17 tests across 2 files:

- **`lib/utils.test.ts`** (14 tests) — `formatPrice`, `formatVolume`, `computeOrderBookStats`, `augmentOrderLevels`, `augmentOrderBook`
- **`components/market/OrderBook.test.tsx`** (3 tests) — loading state, tab rendering, null market IDs

---

## Design decisions

**Order book depth bars**: bars fill from the outside edge inward, normalised against the maximum cumulative size across _both_ sides, so relative depth between bid and ask is comparable at a glance.

**Asks displayed inverted**: asks are rendered in descending order with the best ask (lowest price) closest to the midpoint row, matching the conventional order book layout.

**Per-panel error isolation**: each data hook is independent. A 500 from the trades endpoint shows an error card in the trades panel only; everything else continues working and retrying.

**Buy/Sell panel is UI-only**: field validation runs locally (price must be 0–1, size > 0). No order submission. The "Trade" button is disabled until fields are valid, then shows an alert confirming it's a demo build.

**Mock data fallback**: the app works out-of-the-box without an API key by returning hardcoded demo data for the Grammy market. This makes the demo self-contained.

---

## Assumptions

- API base URL: `https://api.bayse.markets` (adjust via `NEXT_PUBLIC_BAYSE_API_BASE`)
- Price history endpoint accepts a `resolution` query param (`5m`, `1h`, `1d`)
- Order book returns `bids` and `asks` as flat arrays; sorting is done client-side
- Trades include a `side` or `takerSide` field (`"buy"` | `"sell"`)

---

## Deployment

url: https://bayse-market.vercel.app/ (Vercel)
