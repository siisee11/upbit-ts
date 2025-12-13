# @jasset/upbit

Typed, minimal Upbit API helper focused on the endpoints currently used in this repo. It ships with REST helpers for balances, tickers, orderbooks, 1-minute candles, and basic order placement.

## Quickstart

```ts
import { createUpbitClient } from "@jasset/upbit";

const client = createUpbitClient({
  accessKey: process.env.UPBIT_ACCESS_KEY!,
  secretKey: process.env.UPBIT_SECRET_KEY!,
});

const accounts = await client.exchange.accounts();
const [ticker] = await client.quotation.ticker({ markets: ["KRW-BTC"] });
const candles = await client.quotation.candles({ market: "KRW-BTC", count: 30 });
const [orderbook] = await client.quotation.orderbook({ markets: ["KRW-BTC"], count: 15 });

const order = await client.exchange.orders({
  market: "KRW-BTC",
  side: "bid",
  ordType: "limit",
  price: 1000000,
  volume: 0.001,
});
```

Notes:
- REST only; no WebSocket helpers are implemented yet.
- `getCandles` uses `/v1/candles/minutes/1`, so it only returns 1-minute candles. Count is clamped to 1–200 with a default of 60.
- `getOrderbook` uses `/v1/orderbook` with `markets`, optional `level`, and an optional `count` clamped to 1–30 (default 30).
- Orders are validated locally; only creation is supported today. Cancellation, querying past orders, and batch actions are not implemented.

