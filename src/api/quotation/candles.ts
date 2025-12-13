import type { AxiosInstance } from "axios";
import { CANDLE_PATH } from "../../config/constants";
import { toUpbitError, UpbitError } from "../../errors";
import { normalizeCandle, type UpbitRawCandle } from "../../normalizers";
import type { UpbitCandle, UpbitCandleQuery } from "../../types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const fetchCandles = async (
  http: AxiosInstance,
  query: UpbitCandleQuery,
): Promise<UpbitCandle[]> => {
  if (!query.market) {
    throw new UpbitError("Market is required for candles.");
  }

  const count = Number.isFinite(query.count)
    ? clamp(Number(query.count ?? 60), 1, 200)
    : 60;

  try {
    const response = await http.get<UpbitRawCandle[]>(CANDLE_PATH, {
      params: { market: query.market, count },
    });
    return response.data.map(normalizeCandle);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit candles.");
  }
};
