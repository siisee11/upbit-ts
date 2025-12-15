import type { AxiosInstance } from "axios";
import { TRADES_TICKS_PATH } from "../../../config/constants";
import { toUpbitError, UpbitError } from "../../../errors";
import {
  normalizeTradeTick,
  type UpbitRawTradeTick,
} from "../../../normalizers";

export type UpbitTradeTick = {
  /**
   * 페어(거래쌍)의 코드
   * @example "KRW-BTC"
   */
  market: string;
  /**
   * 체결 일자 (UTC 기준)
   * @format yyyy-MM-dd
   */
  tradeDateUtc: string;
  /**
   * 체결 시각 (UTC 기준)
   * @format HH:mm:ss
   */
  tradeTimeUtc: string;
  /**
   * 체결 시각의 밀리초단위 타임스탬프
   */
  timestamp: number;
  /**
   * 최근 체결 가격
   */
  tradePrice: number;
  /**
   * 최근 거래 수량
   */
  tradeVolume: number;
  /**
   * 전일 종가 (UTC 0시 기준)
   */
  prevClosingPrice: number;
  /**
   * 전일 종가 대비 가격 변화.
   * "trade_price" - "prev_closing_price"로 계산되며, 현재 종가가 전일 종가보다 얼마나 상승 또는 하락했는지를 나타냅니다.
   *
   * 양수(+): 현재 종가가 전일 종가보다 상승한 경우
   * 음수(-): 현재 종가가 전일 종가보다 하락한 경우
   */
  changePrice: number;
  /**
   * 매수/매도 주문 구분
   *
   * ASK: 매도
   * BID: 매수
   */
  askBid: "ASK" | "BID";
  /**
   * 체결의 유일 식별자.
   * 해당 필드는 체결 순서를 보장하지 않습니다.
   */
  sequentialId: number;
};

export type UpbitTradeTickQuery = {
  /**
   * 조회하고자 하는 페어(거래쌍)의 코드
   * @example "KRW-BTC"
   */
  market: string;
  /**
   * 조회 대상 일자 내 조회 기간의 종료 시각(UTC).
   * 지정한 조회 일자 내에서 특정 시간대의 체결 내역을 조회하고자 하는 경우 선택적으로 사용할 수 있는 파라미터입니다.
   *
   * HHmmss 또는 HH:mm:ss 형식의 시간 포맷으로 입력합니다. 체결 목록이 지정한 시간부터 시간 역순으로 반환됩니다.
   *
   * @example "130000" // 13:00:00
   */
  to?: string;
  /**
   * 조회하고자 하는 체결 내역의 개수.
   * 최대 500개 조회를 지원하며 기본 값은 1입니다.
   *
   * @default 1
   */
  count?: number;
  /**
   * Pagination을 위한 조회 범위 지정용 커서.
   * 응답에 포함된 체결의 "sequential_id” 값을 이 필드에 입력하여 해당 체결 직전 데이터부터 “count”개의 이전 체결 이력을 이어서 조회할 수 있습니다.
   */
  cursor?: string;
  /**
   * 체결 내역 조회 대상 일자와 요청 시점과의 일 단위 offset.
   * 체결 내역은 체결 일을 지정하여 조회해야 하며 최대 7일의 조회 기간을 지원합니다. 일자 구분은 UTC를 기준으로 합니다.
   *
   * 1 이상 7 이하의 정수형으로 입력합니다. 빈 값으로 입력할 경우, 요청 일자에 발생한 체결 목록을 반환하며, 7을 입력하면 7일 이전에 발생한 체결 목록을 시간 역순(최신 체결 순)으로 반환합니다.
   */
  daysAgo?: number;
};

/**
 * 최근 체결 내역 조회
 *
 * 지정한 페어의 최근 체결 목록을 조회합니다.
 *
 * Rate Limit
 * 초당 최대 10회 호출할 수 있습니다. IP 단위로 측정되며 [체결 그룹] 내에서 요청 가능 횟수를 공유합니다.
 *
 * @param http AxiosInstance
 * @param query UpbitTradeTickQuery
 * @returns Promise<UpbitTradeTick[]>
 */
export const fetchTradeTicks = async (
  http: AxiosInstance,
  query: UpbitTradeTickQuery,
): Promise<UpbitTradeTick[]> => {
  if (!query.market) {
    throw new UpbitError("Market is required for trade ticks.");
  }

  try {
    const response = await http.get<UpbitRawTradeTick[]>(TRADES_TICKS_PATH, {
      params: {
        market: query.market,
        to: query.to,
        count: query.count,
        cursor: query.cursor,
        days_ago: query.daysAgo,
      },
    });

    return response.data.map(normalizeTradeTick);
  } catch (error) {
    throw toUpbitError(error, "Failed to fetch Upbit trade ticks.");
  }
};
