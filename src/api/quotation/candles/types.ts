export type UpbitCandle = {
  /**
   * 페어(거래쌍)의 코드
   * @example "KRW-BTC"
   */
  market: string;
  /**
   * 해당 캔들의 마지막 틱이 저장된 시각의 타임스탬프 (ms)
   */
  timestamp: number;
  /**
   * 캔들 구간의 시작 시각 (KST 기준)
   * @format yyyy-MM-dd'T'HH:mm:ss
   */
  timeKst: string;
  /**
   * 시가.
   * 해당 캔들의 첫 거래 가격입니다.
   */
  openingPrice: number;
  /**
   * 고가.
   * 해당 캔들의 최고 거래 가격입니다.
   */
  highPrice: number;
  /**
   * 저가.
   * 해당 캔들의 최저 거래 가격입니다.
   */
  lowPrice: number;
  /**
   * 종가.
   * 해당 페어의 현재 가격입니다.
   */
  tradePrice: number;
  /**
   * 해당 캔들 동안의 누적 거래 금액
   */
  accTradePrice: number;
  /**
   * 해당 캔들 동안의 누적 거래된 디지털 자산의 수량
   */
  accTradeVolume: number;
  /**
   * 분 단위(1, 3, 5, 10, 15, 30, 60, 240)
   */
  unit: number;
};

export type UpbitCandlesResponse = {
  candles: UpbitCandle[];
};

export type UpbitCandleQuery = {
  market: string;
  to?: string;
  count?: number;
};
