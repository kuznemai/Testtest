import { endSession } from "~~/server/utils/session";

/** POST /api/auth/logout */
export default defineEventHandler((event): { ok: true } => {
  endSession(event);
  return { ok: true };
});
