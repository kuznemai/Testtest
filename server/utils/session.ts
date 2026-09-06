import { randomBytes } from "node:crypto";
import type { User } from "#shared/types";
import { db, type StoredUser } from "./db";

// Nitro auto-imports H3Event as a value; derive the type from it so the version
// bundled with Nitro is always the one we annotate against.
type ServerEvent = InstanceType<typeof H3Event>;

const COOKIE_NAME = "iz_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * Session lives in an httpOnly cookie, never in browser storage — the same shape a
 * real backend would use, so the frontend needs no changes when it arrives.
 */
export function startSession(event: ServerEvent, userId: string): void {
  const token = randomBytes(32).toString("hex");
  db.sessions.set(token, userId);
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: !import.meta.dev,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function endSession(event: ServerEvent): void {
  const token = getCookie(event, COOKIE_NAME);
  if (token) db.sessions.delete(token);
  deleteCookie(event, COOKIE_NAME, { path: "/" });
}

export function findSessionUser(event: ServerEvent): StoredUser | null {
  const token = getCookie(event, COOKIE_NAME);
  if (!token) return null;
  const userId = db.sessions.get(token);
  if (!userId) return null;
  return db.users.find((user) => user.id === userId) ?? null;
}

/** Throws 401 when there is no valid session. */
export function requireUser(event: ServerEvent): StoredUser {
  const user = findSessionUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Authentication required" });
  }
  return user;
}

export function toPublicUser(user: StoredUser): User {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}
