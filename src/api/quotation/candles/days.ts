import type { AxiosInstance } from "axios";
import { CANDLE_DAYS_PATH } from "../../../config/constants";
import { toUpbitError, UpbitError } from "../../../errors";
import { normalizeCandle, type UpbitRawCandle } from "../../../normalizers";
import type { UpbitCandle, UpbitDayCandleQuery } from "./types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * 일(Day) 캔들 조회
 *
 * 일 단위 캔들 목록을 조회합니다.
 *
 * 종가 환산 통화(converting_price_unit)
 * 'converting_price_unit' 파라미터를 지정하여 원화 마켓이 아닌 다른 마켓(예시: BTC마켓)의 일 캔들 조회시 종가('trade_price')를 원화로 환산하여 조회할 수 있습니다. 파라미터를 원화('KRW')로 지정하는 경우 converted_trade_price 필드에 원화로 환산된 종가 정보가 반환됩니다. 현재 원화 환산만을 지원하고 있으며, 추후 지원 통화는 추가될 수 있습니다.
 *
 * 캔들은 해당 시간대에 체결이 발생한 경우에만 생성됩니다.
 * 해당 캔들의 시작 시각부터 종료 시각까지 체결이 발생하지 않은 경우 캔들이 생성되지 않으며, 응답에도 포함되지 않습니다. 예를 들어, candle_date_time이 2024-08-31T00:00:00인 일 캔들의 경우 2024-08-31T00:00:00(이상)부터 2024-09-01T00:00:00(미만)까지 체결이 발생하지 않은 경우 생성되지 않습니다.
 *
 * Rate Limit
 * 초당 최대 10회 호출할 수 있습니다. IP 단위로 측정되며 [캔들 그룹] 내에서 요청 가능 횟수를 공유합니다.
 *
 * @param http AxiosInstance
 * @param query UpbitDayCandleQuery
 * @returns Promise<UpbitCandle[]>
 */
export const fetchDayCandles = async (
  http: AxiosInstance,
  query: UpbitDayCandleQuery,
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

  if (query.converting_price_unit) {
    params.converting_price_unit = query.converting_price_unit;
  }

  try {
    const response = await http.get<UpbitRawCandle[]>(CANDLE_DAYS_PATH, {
      params,
    });
    return response.data.map(normalizeCandle);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit day candles.");
  }
};
