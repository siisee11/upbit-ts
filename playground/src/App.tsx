import type { UpbitOrderRequest, UpbitOrderResponse } from "@jasset/upbit";
import { useEffect, useState } from "react";

type OrderForm = {
  market: string;
  side: UpbitOrderRequest["side"];
  ordType: UpbitOrderRequest["ordType"];
  volume: string;
  price: string;
  identifier: string;
};

const STORAGE_KEY = "upbit-playground:credentials";
const API_BASE = import.meta.env.VITE_UPBIT_API_BASE ?? "/api";

const defaultOrder: OrderForm = {
  market: "KRW-BTC",
  side: "bid",
  ordType: "market",
  volume: "",
  price: "",
  identifier: "",
};

const mask = (value: string) =>
  value.length > 8 ? `${value.slice(0, 3)}••••${value.slice(-3)}` : value;

const toNumber = (value: string) => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function App() {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [order, setOrder] = useState<OrderForm>(defaultOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<UpbitOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] =
    useState<Partial<UpbitOrderRequest> | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        accessKey?: string;
        secretKey?: string;
      };
      setAccessKey(parsed.accessKey ?? "");
      setSecretKey(parsed.secretKey ?? "");
      setToast("Credentials restored from local storage.");
    } catch {
      // ignore parse failure
    }
  }, []);

  const rememberLocally = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessKey, secretKey }),
    );
    setToast("Saved in this browser. They never leave this page.");
  };

  const clearStored = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAccessKey("");
    setSecretKey("");
    setToast("Cleared stored credentials.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResponse(null);
    setLastRequest(null);

    if (!accessKey.trim() || !secretKey.trim()) {
      setError("Provide both UPBIT keys before sending an order.");
      return;
    }

    if (!order.market.trim()) {
      setError("Market is required, e.g. KRW-BTC.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpbitOrderRequest = {
        market: order.market.trim(),
        side: order.side,
        ordType: order.ordType,
        volume: toNumber(order.volume),
        price: toNumber(order.price),
        identifier: order.identifier.trim() || undefined,
      };

      setLastRequest(payload);
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          accessKey: accessKey.trim(),
          secretKey: secretKey.trim(),
        }),
      });

      const data = (await response.json()) as
        | { order: UpbitOrderResponse["order"] }
        | { error?: string };

      if (!response.ok || !("order" in data)) {
        const message =
          "error" in data && data.error ? data.error : "Failed to place order.";
        throw new Error(message);
      }

      setResponse({ order: data.order });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to place order.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <div>
          <div className="badge">Vite playground</div>
          <h1>Upbit createOrder tester</h1>
          <p>
            Use @jasset/upbit directly in the browser. Keys stay local; requests
            go straight to Upbit.
          </p>
        </div>
        <div className="stack">
          <button className="subtle" type="button" onClick={rememberLocally}>
            Remember keys locally
          </button>
          <button className="subtle" type="button" onClick={clearStored}>
            Clear keys
          </button>
        </div>
      </div>

      {toast && <div className="alert info">{toast}</div>}

      <div className="grid">
        <div className="card">
          <h2>Credentials</h2>
          <p className="muted">
            Keys are only stored in your browser if you click “Remember”.
          </p>
          <div className="form-grid">
            <label>
              UPBIT_OPEN_API_ACCESS_KEY
              <input
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Access key"
                autoComplete="off"
              />
            </label>
            <label>
              UPBIT_OPEN_API_SECRET_KEY
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Secret key"
                autoComplete="off"
              />
            </label>
          </div>
        </div>

        <div className="card">
          <h2>Hints</h2>
          <ul className="muted" style={{ paddingLeft: 18, margin: "8px 0" }}>
            <li>Market buy: ordType = price, side = bid, set price (KRW).</li>
            <li>Limit buy/sell: ordType = limit with price + volume.</li>
            <li>Market sell: ordType = market, side = ask, set volume.</li>
          </ul>
          <p className="muted" style={{ marginTop: 2 }}>
            Full parameter list:{" "}
            <a
              href="https://docs.upbit.com/kr/reference/new-order"
              target="_blank"
              rel="noreferrer"
            >
              Upbit order API docs
            </a>
          </p>
          {lastRequest && (
            <div className="code-block">
              <pre>
                {JSON.stringify(
                  {
                    ...lastRequest,
                    accessKey: mask(accessKey),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>createOrder form</h2>
          <p className="muted">
            Fields map 1:1 to the SDK request. Leave unused fields empty.
          </p>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Market
              <input
                placeholder="KRW-BTC"
                value={order.market}
                onChange={(e) =>
                  setOrder((prev) => ({ ...prev, market: e.target.value }))
                }
              />
            </label>

            <label>
              Side
              <select
                value={order.side}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    side: e.target.value as UpbitOrderRequest["side"],
                  }))
                }
              >
                <option value="bid">bid (buy)</option>
                <option value="ask">ask (sell)</option>
              </select>
            </label>

            <label>
              Order type
              <select
                value={order.ordType}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    ordType: e.target.value as UpbitOrderRequest["ordType"],
                  }))
                }
              >
                <option value="market">market</option>
                <option value="limit">limit</option>
                <option value="price">price (KRW budget)</option>
                <option value="best">best</option>
              </select>
            </label>

            <label>
              Identifier (optional)
              <input
                placeholder="client-order-123"
                value={order.identifier}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
              />
            </label>

            <label>
              Volume
              <input
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="0.01"
                value={order.volume}
                onChange={(e) =>
                  setOrder((prev) => ({ ...prev, volume: e.target.value }))
                }
              />
            </label>

            <label>
              Price
              <input
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="500000"
                value={order.price}
                onChange={(e) =>
                  setOrder((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </label>

            <div className="row" style={{ marginTop: 6 }}>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Create order"}
              </button>
              <button
                className="subtle"
                type="button"
                disabled={isSubmitting}
                onClick={() => setOrder(defaultOrder)}
              >
                Reset form
              </button>
            </div>

            {error && <div className="alert error">{error}</div>}
          </form>
        </div>

        <div className="card">
          <h2>Response</h2>
          <p className="muted">Raw SDK response (Upbit order object).</p>
          {response ? (
            <div className="code-block">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          ) : (
            <div className="muted">Run a request to see the response here.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
