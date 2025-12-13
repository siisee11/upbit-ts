## Feature coverage vs official Upbit API

Status legend: Supported = available in code, Partial = limited subset, Not yet = not implemented.

| Category   | Feature group                     | Key feature                                              | REST support | WebSocket support | Notes |
|------------|-----------------------------------|----------------------------------------------------------|--------------|-------------------|-------|
| Quotation  | Trading pairs                     | List all supported pairs                                 | Not yet      | N/A               |       |
| Quotation  | Candles (OHLCV)                   | Time unit OHLCV stats per pair                           | Partial      | Not yet           | REST: only 1-minute candles via `/v1/candles/minutes/1`. Other intervals and seconds/day/week/month/year are missing. |
| Quotation  | Trades                            | Recent trade history                                     | Not yet      | Not yet           |       |
| Quotation  | Ticker                            | Per-pair ticker (price/volume/change)                    | Supported    | Not yet           | Uses `/v1/ticker` with `markets` query. Quote-level ticker is not covered. |
| Quotation  | Orderbook                         | Orderbook snapshot and policy                            | Supported    | Not yet           | Snapshot via `/v1/orderbook`; orderbook policy endpoints are not covered. |
| Exchange   | Asset                             | Account balances                                         | Supported    | Not yet           | Uses `/v1/accounts` with JWT auth. |
| Exchange   | Order (create/cancel)             | Place/cancel orders                                      | Partial      | Not yet           | Only order creation via `/v1/orders` is implemented. No cancel or batch endpoints. |
| Exchange   | Order (query)                     | Order availability and lookups                           | Not yet      | Not yet           |       |
| Exchange   | Withdrawal (create/cancel)        | Submit or cancel withdrawals                             | Not yet      | Not yet           |       |
| Exchange   | Withdrawal (query)                | Withdrawal info and lists                                | Not yet      | Not yet           |       |
| Exchange   | Deposit address management        | Create/list deposit addresses                            | Not yet      | Not yet           |       |
| Exchange   | Deposit management                | Deposit info and lists                                   | Not yet      | Not yet           |       |
| Exchange   | Travel rule management            | Travel rule verification                                 | Not yet      | Not yet           |       |
| Exchange   | KRW deposit                       | Request KRW deposit                                      | Not yet      | Not yet           |       |
| Exchange   | Service info                      | Service status and API key list                          | Not yet      | Not yet           |       |
