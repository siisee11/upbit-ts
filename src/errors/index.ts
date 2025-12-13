import { isAxiosError } from "axios";
import type { UpbitOrderErrorCode } from "../types";

export class UpbitError extends Error {
  status?: number;
  cause?: unknown;
  code?: string;

  constructor(
    message: string,
    options?: { status?: number; cause?: unknown; code?: string },
  ) {
    super(message);
    this.name = "UpbitError";
    this.status = options?.status;
    if (options?.code) this.code = options.code;
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}

const extractMessage = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const casted = value as {
      message?: unknown;
      error?: unknown;
      name?: unknown;
    };
    const message =
      typeof casted.message === "string"
        ? casted.message
        : casted.message && typeof casted.message === "object"
          ? extractMessage(casted.message)
          : null;
    const error =
      typeof casted.error === "string"
        ? casted.error
        : casted.error && typeof casted.error === "object"
          ? extractMessage(casted.error)
          : null;
    const name = typeof casted.name === "string" ? casted.name : null;
    return message ?? error ?? name ?? null;
  }
  return null;
};

const extractErrorCode = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const casted = value as { name?: unknown; error?: unknown };
    const name = typeof casted.name === "string" ? casted.name : null;
    if (name) return name;
    const nested =
      casted.error && typeof casted.error === "object"
        ? extractErrorCode(casted.error)
        : null;
    if (nested) return nested;
  }
  return null;
};

export const buildUpbitErrorMessage = (
  error: unknown,
  fallbackMessage = "Failed to fetch Upbit data.",
) => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    const extracted = extractMessage(data);
    if (extracted) return extracted;
    return error.message ?? fallbackMessage;
  }

  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

export const toUpbitError = (
  error: unknown,
  fallbackMessage = "Failed to fetch Upbit data.",
): UpbitError => {
  if (error instanceof UpbitError) return error;
  const status = isAxiosError(error) ? error.response?.status : undefined;
  const code = isAxiosError(error)
    ? extractErrorCode(error.response?.data)
    : undefined;
  const message = buildUpbitErrorMessage(error, fallbackMessage);
  return new UpbitError(message, {
    status,
    cause: error,
    code: code ?? undefined,
  });
};

export const isUpbitError = (error: unknown): error is UpbitError =>
  error instanceof UpbitError;

export const isUpbitOrderError = (
  error: unknown,
  code?: UpbitOrderErrorCode,
): error is UpbitError & { code: UpbitOrderErrorCode } => {
  if (!isUpbitError(error)) return false;
  if (!code) return Boolean(error.code);
  return error.code === code;
};
