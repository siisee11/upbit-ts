# Changelog

## 0.2.0

### Features

- Added granular order methods to `UpbitExchange` for better developer experience.
  - `client.exchange.orders.bid.limit.post(request)`
  - `client.exchange.orders.bid.price.post(request)`
  - `client.exchange.orders.bid.best.post(request)`
  - `client.exchange.orders.ask.limit.post(request)`
  - `client.exchange.orders.ask.market.post(request)`
  - `client.exchange.orders.ask.best.post(request)`

## 0.1.0

### Breaking Changes

- Refactored `UpbitClient` methods to use a hierarchical structure for better intuition and consistency.
  - `client.exchange.accounts()` -> `client.exchange.accounts.get()`
  - `client.exchange.orders(request)` -> `client.exchange.orders.post(request)`
  - `client.quotation.ticker(query)` -> `client.quotation.ticker.get(query)`
  - `client.quotation.orderbook(query)` -> `client.quotation.orderbook.get(query)`
  - `client.quotation.candlesMinutes(query)` -> `client.quotation.candles.minutes.get(query)`
  - `client.quotation.candlesSeconds(query)` -> `client.quotation.candles.seconds.get(query)`
  - `client.quotation.candlesDays(query)` -> `client.quotation.candles.days.get(query)`
