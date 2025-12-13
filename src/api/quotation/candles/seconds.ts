import type { AxiosInstance } from "axios";
import { CANDLE_SECONDS_PATH } from "../../../config/constants";
import { toUpbitError, UpbitError } from "../../../errors";
import { normalizeCandle, type UpbitRawCandle } from "../../../normalizers";
import type { UpbitCandle } from "./types";

export type UpbitSecondCandleQuery = {
    /**
     * 조회하고자 하는 페어(거래쌍)
     * @example "KRW-BTC"
     */
    market: string;
    /**
     * 조회 기간의 종료 시각.
     * 지정한 시각 이전 캔들을 조회합니다. 미지정시 요청 시각을 기준으로 최근 캔들이 조회됩니다.
     *
     * ISO 8601 형식의 datetime으로 다음과 같이 요청 할 수 있습니다. 실제 요청 시에는 공백 및 특수문자가 정상적으로 처리되도록 URL 인코딩을 수행해야 합니다.
     *
     * [예시] 2025-06-24T04:56:53Z
     * 2025-06-24 04:56:53
     * 2025-06-24T13:56:53+09:00
     *
     * 초 캔들은 요청 시점으로부터 최대 3개월 이전 데이터까지의 조회만 지원하므로, 3개월 이전 시각을 지정하는 경우 응답이 빈 배열로 반환됩니다.
     */
    to?: string;
    /**
     * 조회하고자 하는 캔들의 개수.
     * 최대 200개의 캔들 조회를 지원하며, 기본값은 1입니다.
     * @default 1
     */
    count?: number;
};


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
