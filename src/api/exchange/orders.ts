import { createHash, randomUUID } from "node:crypto";
import type { AxiosInstance } from "axios";
import { buildAuthHeaders } from "../../auth";
import { ORDER_PATH } from "../../config/constants";
import { toUpbitError } from "../../errors";
import { normalizeOrder, type UpbitRawOrder } from "../../normalizers";
import type { UpbitCredentials, UpbitOrder, UpbitOrderRequest } from "../../types";
import { validateOrder } from "../../validation/order";

const buildOrderPayload = (
  request: UpbitOrderRequest & { ordType: string },
) => {
  const params = new URLSearchParams();
  params.append("ord_type", request.ordType);
  params.append("market", request.market);
  params.append("side", request.side);
  if (request.volume !== undefined)
    params.append("volume", String(request.volume));
  if (request.price !== undefined)
    params.append("price", String(request.price));
  if (request.identifier) params.append("identifier", request.identifier);
  if (request.timeInForce) params.append("time_in_force", request.timeInForce);
  if (request.smpType) params.append("smp_type", request.smpType);

  const queryString = params.toString();
  const queryHash = createHash("sha512")
    .update(queryString, "utf-8")
    .digest("hex");

  const body = Object.fromEntries(params.entries());

  return { queryString, queryHash, body };
};

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
