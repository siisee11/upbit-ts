import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchTradeTicks,
  type UpbitTradeTickQuery,
} from "../../../../src/api/quotation/trades/tick";
import { TRADES_TICKS_PATH } from "../../../../src/config/constants";

describe("fetchTradeTicks", () => {
  const mockGet = vi.fn();
  const mockHttp = {
    get: mockGet,
  } as unknown as AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch trade ticks successfully", async () => {
    const query: UpbitTradeTickQuery = {
      market: "KRW-BTC",
      count: 2,
    };

    const mockResponse = {
      data: [
        {
          market: "KRW-BTC",
          trade_date_utc: "2023-01-01",
          trade_time_utc: "12:00:00",
          timestamp: 1672574400000,
          trade_price: 20000000,
          trade_volume: 0.1,
          prev_closing_price: 19500000,
          change_price: 500000,
          ask_bid: "BID",
          sequential_id: 1001,
        },
        {
          market: "KRW-BTC",
          trade_date_utc: "2023-01-01",
          trade_time_utc: "11:59:59",
          timestamp: 1672574399000,
          trade_price: 19999000,
          trade_volume: 0.2,
          prev_closing_price: 19500000,
          change_price: 499000,
          ask_bid: "ASK",
          sequential_id: 1000,
        },
      ],
    };

    mockGet.mockResolvedValue(mockResponse);

    const result = await fetchTradeTicks(mockHttp, query);

    expect(mockGet).toHaveBeenCalledWith(TRADES_TICKS_PATH, {
      params: {
        market: "KRW-BTC",
        count: 2,
        to: undefined,
        cursor: undefined,
        days_ago: undefined,
      },
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      market: "KRW-BTC",
      tradeDateUtc: "2023-01-01",
      tradeTimeUtc: "12:00:00",
      timestamp: 1672574400000,
      tradePrice: 20000000,
      tradeVolume: 0.1,
      prevClosingPrice: 19500000,
      changePrice: 500000,
      askBid: "BID",
      sequentialId: 1001,
    });
  });

  it("should throw an error if market is missing", async () => {
    const query = {} as UpbitTradeTickQuery;

    await expect(fetchTradeTicks(mockHttp, query)).rejects.toThrow(
      "Market is required for trade ticks.",
    );
  });
});
