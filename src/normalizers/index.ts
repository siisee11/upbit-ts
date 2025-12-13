import type {
  UpbitAccount,
  UpbitCandle,
  UpbitOrder,
  UpbitOrderbook,
  UpbitOrderbookUnit,
  UpbitOrderSide,
  UpbitOrderType,
  UpbitTicker,
} from "../types";

export type UpbitRawAccount = {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
};

export type UpbitRawTicker = {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_price: number | string;
  opening_price: number | string;
  high_price: number | string;
  low_price: number | string;
  prev_closing_price: number | string;
  change: "RISE" | "EVEN" | "FALL";
  change_price: number | string;
  change_rate: number | string;
  signed_change_price: number | string;
  signed_change_rate: number | string;
  trade_volume: number | string;
  acc_trade_price: number | string;
  acc_trade_price_24h: number | string;
  acc_trade_volume: number | string;
  acc_trade_volume_24h: number | string;
  trade_timestamp: number | string;
  timestamp: number | string;
  highest_52_week_price: number | string;
  highest_52_week_date: string;
  lowest_52_week_price: number | string;
  lowest_52_week_date: string;
};

export type UpbitRawCandle = {
  market: string;
  candle_date_time_kst: string;
  timestamp: number;
  opening_price: number | string;
  high_price: number | string;
  low_price: number | string;
  trade_price: number | string;
  candle_acc_trade_price: number | string;
  candle_acc_trade_volume: number | string;
  unit?: number;
};

export type UpbitRawOrder = {
  uuid: string;
  side: UpbitOrderSide;
  ord_type: string;
  price: string | null;
  state: string;
  market: string;
  created_at: string;
  volume: string | null;
  remaining_volume: string | null;
  reserved_fee: string | null;
  remaining_fee: string | null;
  paid_fee: string | null;
  locked: string | null;
  executed_volume: string | null;
  trade_count: number;
  time_in_force?: string | null;
  identifier?: string | null;
  smp_type?: string | null;
  prevented_volume?: string | number | null;
  prevented_locked?: string | number | null;
};

export type UpbitRawOrderbookUnit = {
  ask_price: number | string;
  bid_price: number | string;
  ask_size: number | string;
  bid_size: number | string;
  level?: number | string;
};

export type UpbitRawOrderbook = {
  market: string;
  timestamp: number | string;
  total_ask_size: number | string;
  total_bid_size: number | string;
  orderbook_units: UpbitRawOrderbookUnit[];
  level?: number | string;
};

export const toNumber = (value: unknown) => {
  const normalized =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  return toNumber(value);
};

const normalizeOrderType = (value: string): UpbitOrderType => {
  if (value === "limit" || value === "price" || value === "market")
    return value;
  return "best";
};

const normalizeTimeInForce = (
  value: string | null | undefined,
): "ioc" | "fok" | "post_only" | undefined => {
  if (value === "ioc" || value === "fok" || value === "post_only") return value;
  return undefined;
};

const normalizeSmpType = (
  value: string | null | undefined,
): "cancel_maker" | "cancel_taker" | "reduce" | undefined => {
  if (
    value === "cancel_maker" ||
    value === "cancel_taker" ||
    value === "reduce"
  )
    return value;
  return undefined;
};

export const normalizeAccount = (raw: UpbitRawAccount): UpbitAccount => ({
  currency: raw.currency,
  balance: toNumber(raw.balance),
  locked: toNumber(raw.locked),
  avgBuyPrice: toNumber(raw.avg_buy_price),
  avgBuyPriceModified: Boolean(raw.avg_buy_price_modified),
  unitCurrency: raw.unit_currency ?? "KRW",
});

export const normalizeTicker = (raw: UpbitRawTicker): UpbitTicker => ({
  market: raw.market,
  tradeDate: raw.trade_date,
  tradeTime: raw.trade_time,
  tradeDateKst: raw.trade_date_kst,
  tradeTimeKst: raw.trade_time_kst,
  tradePrice: toNumber(raw.trade_price),
  openingPrice: toNumber(raw.opening_price),
  highPrice: toNumber(raw.high_price),
  lowPrice: toNumber(raw.low_price),
  prevClosingPrice: toNumber(raw.prev_closing_price),
  change: raw.change,
  changePrice: toNumber(raw.change_price),
  changeRate: toNumber(raw.change_rate),
  signedChangePrice: toNumber(raw.signed_change_price),
  signedChangeRate: toNumber(raw.signed_change_rate),
  tradeVolume: toNumber(raw.trade_volume),
  accTradePrice: toNumber(raw.acc_trade_price),
  accTradePrice24h: toNumber(raw.acc_trade_price_24h),
  accTradeVolume: toNumber(raw.acc_trade_volume),
  accTradeVolume24h: toNumber(raw.acc_trade_volume_24h),
  tradeTimestamp: toNumber(raw.trade_timestamp ?? raw.timestamp ?? Date.now()),
  timestamp: toNumber(raw.timestamp ?? raw.trade_timestamp ?? Date.now()),
  highest52WeekPrice: toNumber(raw.highest_52_week_price),
  highest52WeekDate: raw.highest_52_week_date,
  lowest52WeekPrice: toNumber(raw.lowest_52_week_price),
  lowest52WeekDate: raw.lowest_52_week_date,
});

export const normalizeCandle = (raw: UpbitRawCandle): UpbitCandle => ({
  market: raw.market,
  timestamp: raw.timestamp,
  timeKst: raw.candle_date_time_kst,
  openingPrice: toNumber(raw.opening_price),
  highPrice: toNumber(raw.high_price),
  lowPrice: toNumber(raw.low_price),
  tradePrice: toNumber(raw.trade_price),
  accTradePrice: toNumber(raw.candle_acc_trade_price),
  accTradeVolume: toNumber(raw.candle_acc_trade_volume),
  unit: raw.unit ?? 1,
});

export const normalizeOrder = (raw: UpbitRawOrder): UpbitOrder => ({
  uuid: raw.uuid,
  side: raw.side,
  ordType: normalizeOrderType(raw.ord_type),
  price: toNullableNumber(raw.price),
  state: raw.state,
  market: raw.market,
  createdAt: raw.created_at,
  volume: toNullableNumber(raw.volume),
  remainingVolume: toNullableNumber(raw.remaining_volume),
  reservedFee: toNullableNumber(raw.reserved_fee),
  remainingFee: toNullableNumber(raw.remaining_fee),
  paidFee: toNullableNumber(raw.paid_fee),
  locked: toNullableNumber(raw.locked),
  executedVolume: toNullableNumber(raw.executed_volume),
  tradeCount: raw.trade_count ?? 0,
  timeInForce: normalizeTimeInForce(raw.time_in_force),
  identifier: raw.identifier ?? undefined,
  smpType: normalizeSmpType(raw.smp_type),
  preventedVolume: toNumber(raw.prevented_volume ?? 0),
  preventedLocked: toNumber(raw.prevented_locked ?? 0),
});

const normalizeOrderbookLevel = (value?: number | string) =>
  value === undefined ? undefined : toNumber(value);

export const normalizeOrderbookUnit = (
  raw: UpbitRawOrderbookUnit,
): UpbitOrderbookUnit => ({
  askPrice: toNumber(raw.ask_price),
  bidPrice: toNumber(raw.bid_price),
  askSize: toNumber(raw.ask_size),
  bidSize: toNumber(raw.bid_size),
  level: normalizeOrderbookLevel(raw.level),
});

export const normalizeOrderbook = (raw: UpbitRawOrderbook): UpbitOrderbook => ({
  market: raw.market,
  timestamp: toNumber(raw.timestamp ?? Date.now()),
  totalAskSize: toNumber(raw.total_ask_size),
  totalBidSize: toNumber(raw.total_bid_size),
  orderbookUnits: raw.orderbook_units?.map(normalizeOrderbookUnit) ?? [],
  level: normalizeOrderbookLevel(raw.level),
});

export const isUpbitSide = (value: unknown): value is UpbitOrderSide =>
  value === "bid" || value === "ask";
