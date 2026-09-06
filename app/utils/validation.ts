export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Normalises user input to a `+<digits>` form; returns "" when it cannot. */
export function normalizePhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "";
  if (cleaned.startsWith("+")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  return `+${digits}`;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return normalizePhone(value) !== "";
}

export function isFilled(value: string, minLength = 1): boolean {
  return value.trim().length >= minLength;
}

/** Allows only in-app absolute paths, so `?redirect=` cannot become an open redirect. */
export function safeRedirectPath(raw: unknown, fallback = "/"): string {
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return fallback;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
  if (decoded.includes("://")) return fallback;
  return decoded;
}
