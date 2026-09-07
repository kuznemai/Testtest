import { randomBytes } from "node:crypto";
import { handleMockRequest } from "#shared/mock/handlers";
import { mockSessions, mockState } from "~~/server/utils/mock-backend";

const COOKIE_NAME = "iz_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * Nitro adapter for the mock backend in `shared/mock`.
 *
 * It only translates HTTP into a `MockRequest` and back: sessions live in an httpOnly
 * cookie, exactly as the real backend is expected to issue them. Delete this file and
 * `shared/mock` once the real API exists.
 */
export default defineEventHandler(async (event) => {
  const path = (getRouterParam(event, "path") ?? "").replace(/^\/+/, "");
  const method = event.method;
  const token = getCookie(event, COOKIE_NAME);

  const response = handleMockRequest(mockState, {
    method,
    path,
    body: method === "GET" || method === "HEAD" ? undefined : await readBody(event).catch(() => ({})),
    query: getQuery(event) as Record<string, string | undefined>,
    userId: token ? (mockSessions.get(token) ?? null) : null,
  });

  if (response.session) {
    if (token) mockSessions.delete(token);

    if (response.session.userId) {
      const next = randomBytes(32).toString("hex");
      mockSessions.set(next, response.session.userId);
      setCookie(event, COOKIE_NAME, next, {
        httpOnly: true,
        sameSite: "lax",
        secure: !import.meta.dev,
        path: "/",
        maxAge: MAX_AGE_SECONDS,
      });
    } else {
      deleteCookie(event, COOKIE_NAME, { path: "/" });
    }
  }

  if (response.status >= 400) {
    const body = response.body as { statusMessage: string; data?: unknown };
    throw createError({ statusCode: response.status, statusMessage: body.statusMessage, data: body.data });
  }

  return response.body;
});
