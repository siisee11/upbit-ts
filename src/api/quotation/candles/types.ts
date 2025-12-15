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

export type UpbitDayCandleQuery = {
  /**
   * 조회하고자 하는 페어(거래쌍)
   * @example "KRW-BTC"
   */
  market: string;
  /**
   * 조회 기간의 종료 시각.
   * 지정한 시각 이전 캔들을 조회합니다. 미지정시 요청 시각을 기준으로 최근 캔들이 조회됩니다.
   *
   * ISO 8601 형식의 datetime으로 아래와 같이 요청 할 수 있습니다. 실제 요청 시에는 공백 및 특수문자가 정상적으로 처리되도록 URL 인코딩을 수행해야 합니다.
   *
   * [예시]
   * 2025-06-24T04:56:53Z
   * 2025-06-24 04:56:53
   * 2025-06-24T13:56:53+09:00
   */
  to?: string;
  /**
   * 조회하고자 하는 캔들의 개수.
   * 최대 200개의 캔들 조회를 지원하며, 기본값은 1입니다.
   * @default 1
   */
  count?: number;
  /**
   * 종가 환산 통화.
   * 종가를 특정 통화로 환산하고자 하는 경우 선택적으로 지정할 수 있습니다. 사용시 응답에 “converted_trade_price” 필드가 추가로 반환됩니다.
   *
   * [예시] “KRW”로 지정시 원가로 환산된 종가가 반환됨.
   */
  converting_price_unit?: string;
};
