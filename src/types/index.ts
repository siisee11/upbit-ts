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
  market: string;
  tradeDate: string;
  tradeTime: string;
  tradeDateKst: string;
  tradeTimeKst: string;
  tradePrice: number;
  openingPrice: number;
  highPrice: number;
  lowPrice: number;
  prevClosingPrice: number;
  change: "RISE" | "EVEN" | "FALL";
  changePrice: number;
  changeRate: number;
  signedChangePrice: number;
  signedChangeRate: number;
  tradeVolume: number;
  accTradePrice: number;
  accTradePrice24h: number;
  accTradeVolume: number;
  accTradeVolume24h: number;
  tradeTimestamp: number;
  timestamp: number;
  highest52WeekPrice: number;
  highest52WeekDate: string;
  lowest52WeekPrice: number;
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
