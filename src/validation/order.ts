import { ZodError, z } from "zod";
import { UpbitError } from "../errors";
import type { UpbitOrderRequest } from "../types";

const isPositiveNumber = (value: number | undefined) =>
  value !== undefined && Number.isFinite(value) && value > 0;

const orderSchema = z
  .object({
    market: z
      .string()
      .trim()
      .min(1, "Invalid order payload. Market is required."),
    side: z.enum(["bid", "ask"], {
      error: "Invalid order payload. Side must be bid or ask.",
    }),
    ordType: z.enum(["limit", "price", "market", "best"]).default("limit"),
    volume: z.number().positive().optional(),
    price: z.number().positive().optional(),
    identifier: z.string().trim().optional(),
    timeInForce: z.enum(["ioc", "fok", "post_only"]).optional(),
    smpType: z.enum(["cancel_maker", "cancel_taker", "reduce"]).optional(),
  })
  .superRefine((data, ctx) => {
    const ordType = data.ordType ?? "limit";
    const { side, price, volume, timeInForce, smpType } = data;

    if (ordType === "price") {
      if (side !== "bid") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market buy must use side=bid and ordType=price",
          path: ["side"],
        });
      }
      if (timeInForce) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market buy should not set timeInForce.",
          path: ["timeInForce"],
        });
      }
      if (!isPositiveNumber(price)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market buy requires price (KRW total).",
          path: ["price"],
        });
      }
      if (volume !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market buy should omit volume.",
          path: ["volume"],
        });
      }
    } else if (ordType === "market") {
      if (side !== "ask") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market sell must use side=ask and ordType=market",
          path: ["side"],
        });
      }
      if (timeInForce) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market sell should not set timeInForce.",
          path: ["timeInForce"],
        });
      }
      if (!isPositiveNumber(volume)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market sell requires volume.",
          path: ["volume"],
        });
      }
      if (price !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Market sell should omit price.",
          path: ["price"],
        });
      }
    } else if (ordType === "limit") {
      if (!isPositiveNumber(price) || !isPositiveNumber(volume)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Limit orders require both price and volume.",
          path: ["price"],
        });
      }
      if (timeInForce && timeInForce === "post_only" && smpType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "post_only cannot be combined with smpType.",
          path: ["smpType"],
        });
      }
    } else {
      if (!timeInForce || timeInForce === "post_only") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Best orders require timeInForce of ioc or fok.",
          path: ["timeInForce"],
        });
      }
      if (side === "bid") {
        if (!isPositiveNumber(price)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Best bid requires price (total).",
            path: ["price"],
          });
        }
        if (volume !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Best bid should omit volume.",
            path: ["volume"],
          });
        }
      } else {
        if (!isPositiveNumber(volume)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Best ask requires volume.",
            path: ["volume"],
          });
        }
        if (price !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Best ask should omit price.",
            path: ["price"],
          });
        }
      }
    }
  })
  .transform((data) => ({
    ...data,
    ordType: data.ordType ?? "limit",
    market: data.market.trim(),
    identifier: data.identifier?.trim() || undefined,
  }));

export const validateOrder = (
  request: UpbitOrderRequest,
): UpbitOrderRequest => {
  try {
    return orderSchema.parse(request) as UpbitOrderRequest;
  } catch (error) {
    if (error instanceof ZodError) {
      const message =
        error.issues[0]?.message ??
        "Invalid order payload. Side must be bid or ask.";
      throw new UpbitError(message);
    }
    throw error;
  }
};
