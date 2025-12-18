import axios, { type AxiosInstance } from "axios";
import { fetchAccounts } from "../api/exchange/accounts";
import { placeOrder } from "../api/exchange/orders";
import { fetchDayCandles, fetchMinuteCandles } from "../api/quotation/candles";
import { fetchSecondCandles } from "../api/quotation/candles/seconds";
import { fetchOrderbook } from "../api/quotation/orderbook";
import { fetchTicker } from "../api/quotation/ticker";
import { ensureCredentials } from "../auth";
import { DEFAULT_BASE_URL } from "../config/constants";
import type {
  UpbitAccount,
  UpbitBestBuyOrderRequest,
  UpbitBestSellOrderRequest,
  UpbitCandle,
  UpbitCandleQuery,
  UpbitClientOptions,
  UpbitCredentials,
  UpbitDayCandleQuery,
  UpbitLimitOrderRequest,
  UpbitMarketBuyOrderRequest,
  UpbitMarketSellOrderRequest,
  UpbitOrder,
  UpbitOrderbook,
  UpbitOrderbookQuery,
  UpbitOrderRequest,
  UpbitSecondCandleQuery,
  UpbitTicker,
  UpbitTickerQuery,
} from "../types";

export class UpbitExchange {
  public accounts: {
    get: () => Promise<UpbitAccount[]>;
  };

  public orders: {
    post: (request: UpbitOrderRequest) => Promise<UpbitOrder>;
    bid: {
      limit: {
        post: (
          request: Omit<UpbitLimitOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
      price: {
        post: (
          request: Omit<UpbitMarketBuyOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
      best: {
        post: (
          request: Omit<UpbitBestBuyOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
    };
    ask: {
      limit: {
        post: (
          request: Omit<UpbitLimitOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
      market: {
        post: (
          request: Omit<UpbitMarketSellOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
      best: {
        post: (
          request: Omit<UpbitBestSellOrderRequest, "ordType" | "side">,
        ) => Promise<UpbitOrder>;
      };
    };
  };

  constructor(
    private http: AxiosInstance,
    private getCredentials: () => UpbitCredentials,
  ) {
    this.accounts = {
      get: async () => fetchAccounts(this.http, this.getCredentials()),
    };
    this.orders = {
      post: async (request) =>
        placeOrder(this.http, request, this.getCredentials()),
      bid: {
        limit: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "limit", side: "bid" },
              this.getCredentials(),
            ),
        },
        price: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "price", side: "bid" },
              this.getCredentials(),
            ),
        },
        best: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "best", side: "bid" },
              this.getCredentials(),
            ),
        },
      },
      ask: {
        limit: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "limit", side: "ask" },
              this.getCredentials(),
            ),
        },
        market: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "market", side: "ask" },
              this.getCredentials(),
            ),
        },
        best: {
          post: async (request) =>
            placeOrder(
              this.http,
              { ...request, ordType: "best", side: "ask" },
              this.getCredentials(),
            ),
        },
      },
    };
  }
}

export class UpbitQuotation {
  public ticker: {
    get: (query: UpbitTickerQuery) => Promise<UpbitTicker[]>;
  };

  public candles: {
    minutes: {
      get: (query: UpbitCandleQuery) => Promise<UpbitCandle[]>;
    };
    seconds: {
      get: (query: UpbitSecondCandleQuery) => Promise<UpbitCandle[]>;
    };
    days: {
      get: (query: UpbitDayCandleQuery) => Promise<UpbitCandle[]>;
    };
  };

  public orderbook: {
    get: (query: UpbitOrderbookQuery) => Promise<UpbitOrderbook[]>;
  };

  constructor(private http: AxiosInstance) {
    this.ticker = {
      get: async (query) => fetchTicker(this.http, query),
    };
    this.candles = {
      minutes: {
        get: async (query) => fetchMinuteCandles(this.http, query),
      },
      seconds: {
        get: async (query) => fetchSecondCandles(this.http, query),
      },
      days: {
        get: async (query) => fetchDayCandles(this.http, query),
      },
    };
    this.orderbook = {
      get: async (query) => fetchOrderbook(this.http, query),
    };
  }
}

export class UpbitClient {
  private accessKey?: string;
  private secretKey?: string;
  private http: AxiosInstance;

  public readonly exchange: UpbitExchange;
  public readonly quotation: UpbitQuotation;

  constructor(options: UpbitClientOptions = {}) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    this.http = axios.create({
      baseURL: options.baseURL ?? DEFAULT_BASE_URL,
      headers: { Accept: "application/json" },
    });

    this.exchange = new UpbitExchange(this.http, () =>
      this.requireCredentials(),
    );
    this.quotation = new UpbitQuotation(this.http);
  }

  setCredentials(credentials: UpbitCredentials) {
    this.accessKey = credentials.accessKey;
    this.secretKey = credentials.secretKey;
  }

  private requireCredentials(): UpbitCredentials {
    return ensureCredentials(this.accessKey, this.secretKey);
  }
}

export const createUpbitClient = (options: UpbitClientOptions = {}) =>
  new UpbitClient(options);
