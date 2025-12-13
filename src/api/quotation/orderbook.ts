import type { AxiosInstance } from "axios";
import { ORDERBOOK_PATH } from "../../config/constants";
import { toUpbitError, UpbitError } from "../../errors";
import { normalizeOrderbook, type UpbitRawOrderbook } from "../../normalizers";

export type UpbitOrderbookUnit = {
  askPrice: number;
  bidPrice: number;
  askSize: number;
  bidSize: number;
  level?: number;
};

export type UpbitOrderbook = {
  market: string;
  timestamp: number;
  totalAskSize: number;
  totalBidSize: number;
  orderbookUnits: UpbitOrderbookUnit[];
  level?: number;
};

export type UpbitOrderbookQuery = {
  markets: string[];
  level?: string | number;
  count?: number;
};

export type UpbitOrderbookResponse = {
  orderbook: UpbitOrderbook[];
};


const clampCount = (value: number) => Math.min(Math.max(value, 1), 30);

export const fetchOrderbook = async (
  http: AxiosInstance,
  query: UpbitOrderbookQuery,
): Promise<UpbitOrderbook[]> => {
  if (!query.markets?.length) {
    throw new UpbitError("At least one market is required for orderbook.");
  }

  const markets = query.markets.filter(Boolean).join(",");
  const params: Record<string, string | number> = { markets };

  if (query.level !== undefined) params.level = String(query.level);

  if (query.count !== undefined) {
    const parsedCount = Number(query.count);
    if (Number.isFinite(parsedCount)) params.count = clampCount(parsedCount);
  }

  try {
    const response = await http.get<UpbitRawOrderbook[]>(ORDERBOOK_PATH, {
      params,
    });
    return response.data.map(normalizeOrderbook);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit orderbook.");
  }
};
