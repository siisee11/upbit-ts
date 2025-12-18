import axios from "axios";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { UpbitExchange } from "../../../src/client";
import { DEFAULT_BASE_URL } from "../../../src/config/constants";

describe("UpbitExchange Orders", () => {
  const http = axios.create({ baseURL: DEFAULT_BASE_URL });
  const credentials = { accessKey: "test-access", secretKey: "test-secret" };
  const getCredentials = () => credentials;
  const exchange = new UpbitExchange(http, getCredentials);

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("should place a bid limit order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "limit" &&
          body.side === "bid" &&
          body.market === "KRW-BTC" &&
          body.price === "50000000" &&
          body.volume === "1"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "bid",
        ord_type: "limit",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.bid.limit.post({
      market: "KRW-BTC",
      price: 50000000,
      volume: 1,
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });

  it("should place a bid price (market buy) order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "price" &&
          body.side === "bid" &&
          body.market === "KRW-BTC" &&
          body.price === "10000"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "bid",
        ord_type: "price",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.bid.price.post({
      market: "KRW-BTC",
      price: 10000,
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });

  it("should place a bid best order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "best" &&
          body.side === "bid" &&
          body.market === "KRW-BTC" &&
          body.price === "10000" &&
          body.time_in_force === "ioc"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "bid",
        ord_type: "best",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.bid.best.post({
      market: "KRW-BTC",
      price: 10000,
      timeInForce: "ioc",
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });

  it("should place an ask limit order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "limit" &&
          body.side === "ask" &&
          body.market === "KRW-BTC" &&
          body.price === "55000000" &&
          body.volume === "1"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "ask",
        ord_type: "limit",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.ask.limit.post({
      market: "KRW-BTC",
      price: 55000000,
      volume: 1,
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });

  it("should place an ask market (market sell) order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "market" &&
          body.side === "ask" &&
          body.market === "KRW-BTC" &&
          body.volume === "1"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "ask",
        ord_type: "market",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.ask.market.post({
      market: "KRW-BTC",
      volume: 1,
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });

  it("should place an ask best order", async () => {
    const scope = nock(DEFAULT_BASE_URL)
      .post("/v1/orders", (body) => {
        return (
          body.ord_type === "best" &&
          body.side === "ask" &&
          body.market === "KRW-BTC" &&
          body.volume === "1" &&
          body.time_in_force === "fok"
        );
      })
      .reply(200, {
        uuid: "order-uuid",
        side: "ask",
        ord_type: "best",
        state: "wait",
        market: "KRW-BTC",
      });

    const result = await exchange.orders.ask.best.post({
      market: "KRW-BTC",
      volume: 1,
      timeInForce: "fok",
    });

    expect(result).toBeDefined();
    expect(scope.isDone()).toBe(true);
  });
});
