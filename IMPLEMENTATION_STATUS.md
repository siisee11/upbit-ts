## Feature coverage vs official Upbit API

Status legend: ✅ = available in code, Partial = limited subset, ✖️ = not implemented.

| Category   | Feature group                     | Key feature                                              | REST support | WebSocket support | Notes |
|------------|-----------------------------------|----------------------------------------------------------|--------------|-------------------|-------|
| Quotation  | Trading pairs                     | List all supported pairs                                 | ✖️      | N/A               |       |
| Quotation  | Candles (OHLCV)                   | Time unit OHLCV stats per pair                           | Partial      | ✖️           | REST: only 1-minute candles via `/v1/candles/minutes/1`. Other intervals and seconds/day/week/month/year are missing. |
| Quotation  | Trades                            | Recent trade history                                     | ✖️      | ✖️           |       |
| Quotation  | Ticker                            | Per-pair ticker (price/volume/change)                    | ✅    | ✖️           | Uses `/v1/ticker` with `markets` query. Quote-level ticker is not covered. |
| Quotation  | Orderbook                         | Orderbook snapshot and policy                            | ✅    | ✖️           | Snapshot via `/v1/orderbook`; orderbook policy endpoints are not covered. |
| Exchange   | Asset                             | Account balances                                         | ✅    | ✖️           | Uses `/v1/accounts` with JWT auth. |
| Exchange   | Order (create/cancel)             | Place/cancel orders                                      | Partial      | ✖️           | Only order creation via `/v1/orders` is implemented. No cancel or batch endpoints. |
| Exchange   | Order (query)                     | Order availability and lookups                           | ✖️      | ✖️           |       |
| Exchange   | Withdrawal (create/cancel)        | Submit or cancel withdrawals                             | ✖️      | ✖️           |       |
| Exchange   | Withdrawal (query)                | Withdrawal info and lists                                | ✖️      | ✖️           |       |
| Exchange   | Deposit address management        | Create/list deposit addresses                            | ✖️      | ✖️           |       |
| Exchange   | Deposit management                | Deposit info and lists                                   | ✖️      | ✖️           |       |
| Exchange   | Travel rule management            | Travel rule verification                                 | ✖️      | ✖️           |       |
| Exchange   | KRW deposit                       | Request KRW deposit                                      | ✖️      | ✖️           |       |
| Exchange   | Service info                      | Service status and API key list                          | ✖️      | ✖️           |       |
