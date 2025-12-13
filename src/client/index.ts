import axios, { type AxiosInstance } from "axios";
import { fetchAccounts } from "../api/exchange/accounts";
import { fetchCandles } from "../api/quotation/candles";
import { fetchOrderbook } from "../api/quotation/orderbook";
import { placeOrder } from "../api/exchange/orders";
import { fetchTicker } from "../api/quotation/ticker";
import { ensureCredentials } from "../auth";
import { DEFAULT_BASE_URL } from "../config/constants";
import type {
  UpbitAccount,
  UpbitCandle,
  UpbitCandleQuery,
  UpbitClientOptions,
  UpbitCredentials,
  UpbitOrder,
  UpbitOrderbook,
  UpbitOrderbookQuery,
  UpbitOrderRequest,
  UpbitTicker,
  UpbitTickerQuery,
} from "../types";


export class UpbitExchange {
  constructor(
    private http: AxiosInstance,
    private getCredentials: () => UpbitCredentials
  ) { }

  async accounts(): Promise<UpbitAccount[]> {
    return fetchAccounts(this.http, this.getCredentials());
  }

  async orders(request: UpbitOrderRequest): Promise<UpbitOrder> {
    return placeOrder(this.http, request, this.getCredentials());
  }
}

export class UpbitQuotation {
  constructor(private http: AxiosInstance) { }

  async ticker(query: UpbitTickerQuery): Promise<UpbitTicker[]> {
    return fetchTicker(this.http, query);
  }

  async candles(query: UpbitCandleQuery): Promise<UpbitCandle[]> {
    return fetchCandles(this.http, query);
  }

  async orderbook(query: UpbitOrderbookQuery): Promise<UpbitOrderbook[]> {
    return fetchOrderbook(this.http, query);
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

    this.exchange = new UpbitExchange(this.http, () => this.requireCredentials());
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
