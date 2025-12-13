export type UpbitAccount = {
  currency: string;
  balance: number;
  locked: number;
  avgBuyPrice: number;
  avgBuyPriceModified: boolean;
  unitCurrency: string;
};

export type UpbitAccountsResponse = {
  accounts: UpbitAccount[];
};

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

export type UpbitCandle = {
  market: string;
  timestamp: number;
  timeKst: string;
  openingPrice: number;
  highPrice: number;
  lowPrice: number;
  tradePrice: number;
  accTradePrice: number;
  accTradeVolume: number;
  unit: number;
};

export type UpbitCandlesResponse = {
  candles: UpbitCandle[];
};

export type UpbitOrderSide = "bid" | "ask";

export type UpbitOrderType = "limit" | "price" | "market" | "best";

export type UpbitOrderRequest = {
  market: string;
  side: UpbitOrderSide;
  ordType?: UpbitOrderType;
  volume?: number;
  price?: number;
  identifier?: string;
  timeInForce?: "ioc" | "fok" | "post_only";
  smpType?: "cancel_maker" | "cancel_taker" | "reduce";
};

export type UpbitOrder = {
  uuid: string;
  side: UpbitOrderSide;
  ordType: UpbitOrderType;
  price: number | null;
  state: string;
  market: string;
  createdAt: string;
  volume: number | null;
  remainingVolume: number | null;
  reservedFee: number | null;
  remainingFee: number | null;
  paidFee: number | null;
  locked: number | null;
  executedVolume: number | null;
  tradeCount: number;
  timeInForce?: "ioc" | "fok" | "post_only";
  identifier?: string;
  smpType?: "cancel_maker" | "cancel_taker" | "reduce";
  preventedVolume: number;
  preventedLocked: number;
};

export type UpbitOrderResponse = {
  order: UpbitOrder;
};

export type UpbitOrderErrorCode =
  | "invalid_parameter"
  | "invalid_time_in_force"
  | "invalid_price_bid"
  | "invalid_price_ask"
  | "over_krw_funds_bid"
  | "over_krw_funds_ask"
  | "insufficient_funds_bid"
  | "insufficient_funds_ask"
  | "notfoundmarket"
  | "market_offline"
  | string;

export type UpbitClientOptions = {
  baseURL?: string;
  accessKey?: string;
  secretKey?: string;
};

export type UpbitCredentials = Required<
  Pick<UpbitClientOptions, "accessKey" | "secretKey">
>;

export type UpbitTickerQuery = {
  /**
   * 조회하고자 하는 페어(거래쌍) 목록.
   * 2개 이상의 페어에 대해 조회하고자 하는 경우 쉼표(,)로 구분된 문자열 형식으로 요청합니다.
   *
   * @example "KRW-BTC,KRW-ETH,BTC-ETH,BTC-XRP"
   */
  markets: string[];
};

export type UpbitCandleQuery = {
  market: string;
  count?: number;
};

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
