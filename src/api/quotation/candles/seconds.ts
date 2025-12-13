import type { AxiosInstance } from "axios";
import { CANDLE_SECONDS_PATH } from "../../../config/constants";
import { toUpbitError, UpbitError } from "../../../errors";
import { normalizeCandle, type UpbitRawCandle } from "../../../normalizers";
import type { UpbitCandle, UpbitSecondCandleQuery } from "../../../types";

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/**
 * 초(Second) 캔들 조회
 *
 * 초 단위 캔들 목록을 조회합니다.
 *
 * 초 캔들(초봉) 조회 지원 기간은 최대 3개월입니다.
 * 초 단위 캔들 조회 API는 요청 시점을 기준으로 최근 3개월 이내의 데이터만 제공합니다. 조회 가능 기간을 초과한 경우, 응답이 빈 리스트로 반환되거나, 요청한 개수(count)만큼 반환되지 않을 수 있습니다. 조회 가능 기간은 to 파라미터를 활용하여 확인하시기 바랍니다.
 * 캔들은 해당 시간대에 체결이 발생한 경우에만 생성됩니다.
 * 해당 캔들의 시작 시각부터 종료 시각까지 체결이 발생하지 않은 경우 캔들이 생성되지 않으며, 응답에도 포함되지 않습니다. 예를 들어, candle_date_time이 2024-08-31T22:25:00인 초 캔들의 경우 22:25:00(이상)부터 22:25:01(미만)까지 체결이 발생하지 않은 경우 생성되지 않습니다.
 *
 * Rate Limit
 * 초당 최대 10회 호출할 수 있습니다. IP 단위로 측정되며 [캔들 그룹] 내에서 요청 가능 횟수를 공유합니다.
 *
 * @param http AxiosInstance
 * @param query UpbitSecondCandleQuery
 * @returns Promise<UpbitCandle[]>
 */
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
