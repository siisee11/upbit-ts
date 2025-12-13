# @jasset/upbit

A lightweight, fully typed TypeScript client for the Upbit API. Designed for developers who need a simple yet powerful interface for crypto trading and market data. Supports REST endpoints for balances, tickers, orderbooks, candles, and order management.

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

You can find implementation status in the [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) file.