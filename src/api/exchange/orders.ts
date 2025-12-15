import { createHash, randomUUID } from "node:crypto";
import type { AxiosInstance } from "axios";
import { buildAuthHeaders } from "../../auth";
import type { UpbitCredentials } from "../../client/types";
import { ORDER_PATH } from "../../config/constants";
import { toUpbitError } from "../../errors";
import { normalizeOrder, type UpbitRawOrder } from "../../normalizers";
import { validateOrder } from "../../validation/order";

/**
 * 주문 방향 (bid: 매수, ask: 매도)
 */
export type UpbitOrderSide = "bid" | "ask";

/**
 * 주문 유형
 * - limit: 지정가 주문 (price, volume 필수)
 * - price: 시장가 매수 주문 (price 필수)
 * - market: 시장가 매도 주문 (volume 필수)
 * - best: 최유리 지정가 주문 (time_in_force 필수)
 */
export type UpbitOrderType = "limit" | "price" | "market" | "best";

/**
 * 주문 체결 조건 (time_in_force)
 * - ioc: Immediate or Cancel (지정가 조건으로 즉시 체결 가능한 수량만 부분 체결하고, 잔여 수량은 취소)
 * - fok: Fill or Kill (지정가 조건으로 주문량 전량 체결 가능할 때만 주문을 실행하고, 아닌 경우 전량 주문 취소)
 * - post_only: Post Only (메이커 주문으로 생성될 수 있는 상황에서만 주문이 생성되며 테이커 주문으로 체결되는 것을 방지, limit 주문만 가능)
 */
export type UpbitTimeInForce = "ioc" | "fok" | "post_only";

/**
 * 자전거래 체결 방지 (SMP) 옵션
 * - cancel_maker: 메이커 주문(이전 주문)을 취소
 * - cancel_taker: 테이커 주문(신규 주문)을 취소
 * - reduce: 기존 주문과 신규 주문의 주문 수량을 줄여 체결을 방지
 */
export type UpbitSmpType = "cancel_maker" | "cancel_taker" | "reduce";

/**
 * 모든 주문 요청의 공통 필드
 */
type BaseOrderRequest = {
  /**
   * 마켓 ID (예: KRW-BTC)
   */
  market: string;
  /**
   * 조회, 삭제시 사용할 수 있는 사용자 지정 주문 ID (중복 불가)
   */
  identifier?: string;
  /**
   * 자전거래 체결 방지 옵션
   */
  smpType?: UpbitSmpType;
};

/**
 * 지정가 주문 요청
 * 사용자가 매수/매도 단가와 수량을 직접 설정합니다.
 */
export type UpbitLimitOrderRequest = BaseOrderRequest & {
  ordType: "limit";
  side: UpbitOrderSide;
  /**
   * 주문 가격. (지정가, 최유리 지정가 매수 시 필수)
   */
  price: number;
  /**
   * 주문 수량. (지정가, 시장가 매도, 최유리 지정가 매도 시 필수)
   */
  volume: number;
  /**
   * 주문 체결 조건
   */
  timeInForce?: UpbitTimeInForce;
};

/**
 * 시장가 매수 주문 요청
 * 현재 시장에서 가장 유리한 가격으로 즉시 체결됩니다.
 * 매수 총액(price)을 설정해야 합니다.
 */
export type UpbitMarketBuyOrderRequest = BaseOrderRequest & {
  ordType: "price";
  side: "bid";
  /**
   * 주문 가격 (매수 총액).
   * 예를 들어, 10,000원을 입력하면 시장가로 1만원 어치를 매수합니다.
   */
  price: number;
  volume?: never; // 시장가 매수는 수량을 입력하지 않습니다.
  timeInForce?: never; // 시장가 주문은 timeInForce를 지원하지 않습니다.
};

/**
 * 시장가 매도 주문 요청
 * 현재 시장에서 가장 유리한 가격으로 즉시 체결됩니다.
 * 매도 수량(volume)을 설정해야 합니다.
 */
export type UpbitMarketSellOrderRequest = BaseOrderRequest & {
  ordType: "market";
  side: "ask";
  /**
   * 주문 수량 (매도 수량).
   * 예를 들어, 0.1 BTC를 입력하면 시장가로 0.1 BTC를 매도합니다.
   */
  volume: number;
  price?: never; // 시장가 매도는 가격을 입력하지 않습니다.
  timeInForce?: never; // 시장가 주문은 timeInForce를 지원하지 않습니다.
};

/**
 * 최유리 지정가 매수 주문 요청
 * 현재 시장에서 가장 유리한 상대 호가를 가격으로 주문합니다.
 */
export type UpbitBestBuyOrderRequest = BaseOrderRequest & {
  ordType: "best";
  side: "bid";
  /**
   * 주문 가격 (매수 총액).
   * 최유리 호가로 주문 총액에 해당하는 수량을 매수합니다.
   */
  price: number;
  volume?: never;
  /**
   * 최유리 지정가 주문은 ioc 또는 fok만 가능합니다.
   */
  timeInForce: "ioc" | "fok";
};

/**
 * 최유리 지정가 매도 주문 요청
 * 현재 시장에서 가장 유리한 상대 호가를 가격으로 주문합니다.
 */
export type UpbitBestSellOrderRequest = BaseOrderRequest & {
  ordType: "best";
  side: "ask";
  /**
   * 주문 수량 (매도 수량).
   * 최유리 호가로 해당 수량을 매도합니다.
   */
  volume: number;
  price?: never;
  /**
   * 최유리 지정가 주문은 ioc 또는 fok만 가능합니다.
   */
  timeInForce: "ioc" | "fok";
};

/**
 * 주문 요청 타입 Union
 */
export type UpbitOrderRequest =
  | UpbitLimitOrderRequest
  | UpbitMarketBuyOrderRequest
  | UpbitMarketSellOrderRequest
  | UpbitBestBuyOrderRequest
  | UpbitBestSellOrderRequest;

export type UpbitOrder = {
  /**
   * 주문의 고유 아이디
   */
  uuid: string;
  /**
   * 주문 종류
   */
  side: UpbitOrderSide;
  /**
   * 주문 방식
   */
  ordType: UpbitOrderType;
  /**
   * 주문 당시 화폐 가격
   */
  price: number | null;
  /**
   * 주문 상태
   */
  state: string;
  /**
   * 마켓의 유일키
   */
  market: string;
  /**
   * 주문 생성 시간
   */
  createdAt: string;
  /**
   * 사용자가 입력한 주문 양
   */
  volume: number | null;
  /**
   * 체결 후 남은 주문 양
   */
  remainingVolume: number | null;
  /**
   * 수수료로 예약된 비용
   */
  reservedFee: number | null;
  /**
   * 남은 수수료
   */
  remainingFee: number | null;
  /**
   * 사용된 수수료
   */
  paidFee: number | null;
  /**
   * 거래에 사용 중인 비용
   */
  locked: number | null;
  /**
   * 체결된 양
   */
  executedVolume: number | null;
  /**
   * 해당 주문에 대한 체결 건수
   */
  tradeCount: number;
  /**
   * 주문 체결 조건
   */
  timeInForce?: UpbitTimeInForce;
  /**
   * 조회, 삭제시 사용할 수 있는 사용자 지정 주문 ID
   */
  identifier?: string;
  /**
   * 자전거래 체결 방지 옵션
   */
  smpType?: UpbitSmpType;
  /**
   * 자전거래 방지로 인해 취소된 수량
   */
  preventedVolume: number;
  /**
   * 자전거래 방지로 인해 해제된 자산
   */
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

const buildOrderPayload = (request: UpbitOrderRequest) => {
  const params = new URLSearchParams();
  params.append("ord_type", request.ordType);
  params.append("market", request.market);
  params.append("side", request.side);

  if (request.identifier) params.append("identifier", request.identifier);
  if (request.smpType) params.append("smp_type", request.smpType);

  // Discriminator-based handling
  switch (request.ordType) {
    case "limit":
      params.append("price", String(request.price));
      params.append("volume", String(request.volume));
      if (request.timeInForce)
        params.append("time_in_force", request.timeInForce);
      break;
    case "price":
      // Market Buy
      params.append("price", String(request.price));
      break;
    case "market":
      // Market Sell
      params.append("volume", String(request.volume));
      break;
    case "best":
      // Best Limit
      params.append("time_in_force", request.timeInForce);
      if (request.side === "bid") {
        params.append("price", String(request.price));
      } else {
        params.append("volume", String(request.volume));
      }
      break;
  }

  const queryString = params.toString();
  const queryHash = createHash("sha512")
    .update(queryString, "utf-8")
    .digest("hex");

  const body = Object.fromEntries(params.entries());

  return { queryString, queryHash, body };
};

/**
 * 주문 생성
 *
 * 지정가, 시장가, 최유리 지정가 주문을 생성합니다.
 *
 * @param http Axios 인스턴스
 * @param request 주문 요청 파라미터
 * @param credentials API 인증 정보
 * @returns 생성된 주문 정보
 *
 * @see https://docs.upbit.com/reference/주문하기
 */
export const placeOrder = async (
  http: AxiosInstance,
  request: UpbitOrderRequest,
  credentials: UpbitCredentials,
): Promise<UpbitOrder> => {
  const validated = validateOrder(request);
  const { body, queryHash } = buildOrderPayload(validated);

  const payload = {
    access_key: credentials.accessKey,
    nonce: randomUUID(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  try {
    const response = await http.post<UpbitRawOrder>(ORDER_PATH, body, {
      headers: buildAuthHeaders(payload, credentials),
    });

    return normalizeOrder(response.data);
  } catch (error) {
    throw toUpbitError(error, "Failed to place Upbit order.");
  }
};
