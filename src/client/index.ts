import axios, { type AxiosInstance } from "axios";
import { fetchAccounts } from "../api/accounts";
import { fetchCandles } from "../api/candles";
import { fetchOrderbook } from "../api/orderbook";
import { placeOrder } from "../api/orders";
import { fetchTicker } from "../api/ticker";
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

export class UpbitClient {
  private accessKey?: string;
  private secretKey?: string;
  private http: AxiosInstance;

  constructor(options: UpbitClientOptions = {}) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    this.http = axios.create({
      baseURL: options.baseURL ?? DEFAULT_BASE_URL,
      headers: { Accept: "application/json" },
    });
  }

  setCredentials(credentials: UpbitCredentials) {
    this.accessKey = credentials.accessKey;
    this.secretKey = credentials.secretKey;
  }

  private requireCredentials(): UpbitCredentials {
    return ensureCredentials(this.accessKey, this.secretKey);
  }

  async getAccounts(): Promise<UpbitAccount[]> {
    return fetchAccounts(this.http, this.requireCredentials());
  }

  async getTicker(query: UpbitTickerQuery): Promise<UpbitTicker[]> {
    return fetchTicker(this.http, query);
  }

  async getCandles(query: UpbitCandleQuery): Promise<UpbitCandle[]> {
    return fetchCandles(this.http, query);
  }

  async getOrderbook(query: UpbitOrderbookQuery): Promise<UpbitOrderbook[]> {
    return fetchOrderbook(this.http, query);
  }

  async createOrder(request: UpbitOrderRequest): Promise<UpbitOrder> {
    return placeOrder(this.http, request, this.requireCredentials());
  }
}

export const createUpbitClient = (options: UpbitClientOptions = {}) =>
  new UpbitClient(options);
