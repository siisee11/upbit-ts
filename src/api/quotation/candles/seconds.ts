import type { AxiosInstance } from "axios";
import { CANDLE_SECONDS_PATH } from "../../../config/constants";
import { toUpbitError, UpbitError } from "../../../errors";
import { normalizeCandle, type UpbitRawCandle } from "../../../normalizers";
import type { UpbitCandle, UpbitSecondCandleQuery } from "../../../types";

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const fetchSecondCandles = async (
    http: AxiosInstance,
    query: UpbitSecondCandleQuery,
): Promise<UpbitCandle[]> => {
    if (!query.market) {
        throw new UpbitError("Market is required for candles.");
    }

    const params: Record<string, any> = { market: query.market };

    if (query.to) {
        params.to = query.to;
    }

    if (query.count !== undefined) {
        params.count = clamp(query.count, 1, 200);
    }

    try {
        const response = await http.get<UpbitRawCandle[]>(CANDLE_SECONDS_PATH, {
            params,
        });
        return response.data.map(normalizeCandle);
    } catch (error) {
        throw toUpbitError(error, "Failed to fetch Upbit second candles.");
    }
};
