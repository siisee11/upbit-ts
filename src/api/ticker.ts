import type { AxiosInstance } from "axios";
import { TICKER_PATH } from "../config/constants";
import { toUpbitError, UpbitError } from "../errors";
import { normalizeTicker, type UpbitRawTicker } from "../normalizers";
import type { UpbitTicker, UpbitTickerQuery } from "../types";

export const fetchTicker = async (
  http: AxiosInstance,
  query: UpbitTickerQuery,
): Promise<UpbitTicker[]> => {
  if (!query.markets?.length) {
    throw new UpbitError("At least one market is required for ticker.");
  }

  const markets = query.markets.filter(Boolean).join(",");

  try {
    const response = await http.get<UpbitRawTicker[]>(TICKER_PATH, {
      params: { markets },
    });
    return response.data.map(normalizeTicker);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit ticker.");
  }
};
