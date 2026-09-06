/** Tiny request validators for the mock API — enough to exercise real error UI. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function fieldErrors(errors: Record<string, string>): never {
  throw createError({
    statusCode: 422,
    statusMessage: "Please check the highlighted fields",
    data: { fields: errors },
  });
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
