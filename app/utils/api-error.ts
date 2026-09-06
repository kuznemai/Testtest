import type { ApiErrorData } from "#shared/types";

export interface ApiFailure {
  statusCode: number;
  message: string;
  /** Per-field messages for form validation errors (HTTP 422). */
  fields: Record<string, string>;
}

interface FetchLikeError {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?: { statusCode?: number; statusMessage?: string; message?: string; data?: ApiErrorData };
}

/** Normalises anything `$fetch` throws into something a form or banner can render. */
export function toApiFailure(error: unknown, fallback = "Something went wrong. Please try again."): ApiFailure {
  const err = (error ?? {}) as FetchLikeError;
  const body = err.data;
  const statusCode = body?.statusCode ?? err.statusCode ?? 0;
  const message = body?.statusMessage || body?.message || err.statusMessage || fallback;

  return { statusCode, message, fields: body?.data?.fields ?? {} };
}
