import type { AxiosInstance } from "axios";
import { TICKER_PATH } from "../../config/constants";
import { toUpbitError, UpbitError } from "../../errors";
import { normalizeTicker, type UpbitRawTicker } from "../../normalizers";
import type { UpbitTicker, UpbitTickerQuery } from "../../types";

/**
 * 페어 단위 현재가 조회
 *
 * 지정한 페어의 현재가를 조회합니다. 요청 시점 기준으로 해당 페어의 티커 스냅샷이 반환됩니다.
 *
 * 가격 변동 지표
 * 페어 현재가 조회시 반환되는 change, change_price, change_rate, signed_change_price, signed_change_rate 필드는 가격 변동에 관련된 지표를 반환하는 필드들입니다.
 * 해당 변동 지표들은 전일 종가를 기준으로 산출합니다.
 *
 * Rate Limit
 * 초당 최대 10회 호출할 수 있습니다. IP 단위로 측정되며 [현재가 그룹] 내에서 요청 가능 횟수를 공유합니다.
 *
 * @param http AxiosInstance
 * @param query UpbitTickerQuery
 * @returns Promise<UpbitTicker[]>
 */
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
