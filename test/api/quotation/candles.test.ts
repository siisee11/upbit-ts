import axios from "axios";
import nock from "nock";
import { describe, expect, it } from "vitest";
import {
  fetchMinuteCandles,
  fetchSecondCandles,
} from "../../../src/api/quotation/candles";
import {
  CANDLE_PATH,
  CANDLE_SECONDS_PATH,
  DEFAULT_BASE_URL,
} from "../../../src/config/constants";
import type { UpbitRawCandle } from "../../../src/normalizers";

describe("Candles API", () => {
  const http = axios.create({ baseURL: DEFAULT_BASE_URL });

  const mockCandle: UpbitRawCandle = {
    market: "KRW-BTC",
    candle_date_time_kst: "2023-01-01T00:00:00",
    timestamp: 1672531200000,
    opening_price: 1000,
    high_price: 1100,
    low_price: 900,
    trade_price: 1050,
    candle_acc_trade_price: 1000000,
    candle_acc_trade_volume: 1000,
    unit: 1,
  };

  describe("fetchMinuteCandles", () => {
    it("should fetch minute candles", async () => {
      nock(DEFAULT_BASE_URL)
        .get(CANDLE_PATH)
        .query({ market: "KRW-BTC", count: 60 })
        .reply(200, [mockCandle]);

      const result = await fetchMinuteCandles(http, { market: "KRW-BTC" });
      expect(result).toHaveLength(1);
      expect(result[0].market).toBe("KRW-BTC");
    });
  });

  describe("fetchSecondCandles", () => {
    it("should fetch second candles with required params", async () => {
      nock(DEFAULT_BASE_URL)
        .get(CANDLE_SECONDS_PATH)
        .query({ market: "KRW-BTC" })
        .reply(200, [mockCandle]);

      const result = await fetchSecondCandles(http, { market: "KRW-BTC" });
      expect(result).toHaveLength(1);
      expect(result[0].market).toBe("KRW-BTC");
    });

    it("should fetch second candles with optional params", async () => {
      const _parsedUrl = new URL(CANDLE_SECONDS_PATH, DEFAULT_BASE_URL);
      nock(DEFAULT_BASE_URL)
        .get(CANDLE_SECONDS_PATH)
        .query({ market: "KRW-BTC", to: "2023-01-01T00:00:00Z", count: 10 })
        .reply(200, [mockCandle]);

      const result = await fetchSecondCandles(http, {
        market: "KRW-BTC",
        to: "2023-01-01T00:00:00Z",
        count: 10,
      });
      expect(result).toHaveLength(1);
    });

    it("should throw error if market is missing", async () => {
      await expect(fetchSecondCandles(http, { market: "" })).rejects.toThrow(
        "Market is required for candles.",
      );
    });
  });
});
