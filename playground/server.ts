import { serve } from "@hono/node-server";
import {
  createUpbitClient,
  UpbitError,
  type UpbitOrderRequest,
} from "@jasset/upbit";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const app = new Hono().basePath("/api");

app.use("*", cors());

type OrderPayload = UpbitOrderRequest & {
  accessKey?: string;
  secretKey?: string;
};

app.get("/health", (c) => c.json({ ok: true }));

app.post("/orders", async (c) => {
  const body = (await c.req.json()) as OrderPayload;
  const accessKey = body.accessKey?.trim();
  const secretKey = body.secretKey?.trim();

  if (!accessKey || !secretKey) {
    return c.json({ error: "Access and secret keys are required." }, 400);
  }

  const { accessKey: _ignored, secretKey: _ignoredSecret, ...order } = body;

  const client = createUpbitClient({ accessKey, secretKey });
  try {
    const result = await client.createOrder(order);
    return c.json({ order: result });
  } catch (error) {
    const status =
      error instanceof UpbitError && error.status ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Failed to place order.";
    return c.json({ error: message }, status as ContentfulStatusCode);
  }
});

const port = Number(process.env.UPBIT_PLAYGROUND_PORT ?? 8787);

serve(
  {
    port,
    fetch: app.fetch,
  },
  () => {
    console.log(`Upbit playground API ready on http://localhost:${port}/api`);
  },
);
