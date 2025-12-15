import type { AxiosInstance } from "axios";
import { TICKER_PATH } from "../../config/constants";
import { toUpbitError, UpbitError } from "../../errors";
import { normalizeTicker, type UpbitRawTicker } from "../../normalizers";

export type UpbitTicker = {
  /**
   * 페어(거래쌍)의 코드
   * @example "KRW-BTC"
   */
  market: string;
  /**
   * 최근 체결 일자 (UTC 기준)
   * @format yyyyMMdd
   */
  tradeDate: string;
  /**
   * 최근 체결 시각 (UTC 기준)
   * @format HHmmss
   */
  tradeTime: string;
  /**
   * 최근 체결 일자 (KST 기준)
   * @format yyyyMMdd
   */
  tradeDateKst: string;
  /**
   * 최근 체결 시각 (KST 기준)
   * @format HHmmss
   */
  tradeTimeKst: string;
  /**
   * 종가 (현재가)
   * 해당 페어의 현재 가격입니다.
   */
  tradePrice: number;
  /**
   * 시가
   * 해당 페어의 첫 거래 가격입니다.
   */
  openingPrice: number;
  /**
   * 고가
   * 해당 페어의 최고 거래 가격입니다.
   */
  highPrice: number;
  /**
   * 저가
   * 해당 페어의 최저 거래 가격입니다.
   */
  lowPrice: number;
  /**
   * 전일 종가 (UTC 0시 기준)
   */
  prevClosingPrice: number;
  /**
   * 가격 변동 상태
   *
   * EVEN: 보합
   * RISE: 상승
   * FALL: 하락
   */
  change: "RISE" | "EVEN" | "FALL";
  /**
   * 전일 종가 대비 가격 변화(절대값)
   * "trade_price" - "prev_closing_price"로 계산됩니다.
   */
  changePrice: number;
  /**
   * 전일 종가 대비 가격 변화 (절대값)
   * ("trade_price" - "prev_closing_price") ÷ "prev_closing_price" 으로 계산됩니다.
   */
  changeRate: number;
  /**
   * 전일 종가 대비 가격 변화
   * "trade_price" - "prev_closing_price"로 계산되며, 현재 종가가 전일 종가보다 얼마나 상승 또는 하락했는지를 나타냅니다.
   *
   * 양수(+): 현재 종가가 전일 종가보다 상승한 경우
   * 음수(-): 현재 종가가 전일 종가보다 하락한 경우
   */
  signedChangePrice: number;
  /**
   * 전일 종가 대비 가격 변화율
   * ("trade_price" - "prev_closing_price") ÷ "prev_closing_price" 으로 계산됩니다.
   *
   * 양수(+): 가격 상승
   * 음수(-): 가격 하락
   * @example 0.015 // 1.5% 상승
   */
  signedChangeRate: number;
  /**
   * 최근 거래 수량
   */
  tradeVolume: number;
  /**
   * 누적 거래 금액 (UTC 0시 기준)
   */
  accTradePrice: number;
  /**
   * 24시간 누적 거래 금액
   */
  accTradePrice24h: number;
  /**
   * 누적 거래량 (UTC 0시 기준)
   */
  accTradeVolume: number;
  /**
   * 24시간 누적 거래량
   */
  accTradeVolume24h: number;
  /**
   * 체결 시각의 밀리초단위 타임스탬프
   */
  tradeTimestamp: number;
  /**
   * 현재가 정보가 반영된 시각의 타임스탬프(ms)
   */
  timestamp: number;
  /**
   * 52주 신고가
   */
  highest52WeekPrice: number;
  /**
   * 52주 신고가 달성일
   * @format yyyy-MM-dd
   */
  highest52WeekDate: string;
  /**
   * 52주 신저가
   */
  lowest52WeekPrice: number;
  /**
   * 52주 신저가 달성일
   * @format yyyy-MM-dd
   */
  lowest52WeekDate: string;
};

export type UpbitTickerResponse = {
  tickers: UpbitTicker[];
};

export type UpbitTickerQuery = {
  /**
   * 조회하고자 하는 페어(거래쌍) 목록.
   * 2개 이상의 페어에 대해 조회하고자 하는 경우 쉼표(,)로 구분된 문자열 형식으로 요청합니다.
   *
   * @example "KRW-BTC,KRW-ETH,BTC-ETH,BTC-XRP"
   */
  markets: string[];
};

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
