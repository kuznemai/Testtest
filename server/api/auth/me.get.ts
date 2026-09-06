import type { User } from "#shared/types";
import { findSessionUser, toPublicUser } from "~~/server/utils/session";

/**
 * GET /api/auth/me
 * Wrapped in an object so an anonymous visitor gets a real JSON body (`{ user: null }`)
 * rather than an empty 204 response.
 */
export default defineEventHandler((event): { user: User | null } => {
  const user = findSessionUser(event);
  return { user: user ? toPublicUser(user) : null };
});
