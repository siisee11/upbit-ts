import { sign } from "jsonwebtoken";
import { UpbitError } from "../errors";
import type { UpbitCredentials } from "../types";

export const ensureCredentials = (
  accessKey?: string,
  secretKey?: string,
): UpbitCredentials => {
  if (!accessKey || !secretKey) {
    throw new UpbitError("Upbit credentials are not configured.");
  }
  return { accessKey, secretKey };
};

export const buildAuthHeaders = (
  payload: Record<string, unknown>,
  credentials: UpbitCredentials,
) => {
  const token = sign(payload, credentials.secretKey);
  return { Authorization: `Bearer ${token}` };
};
