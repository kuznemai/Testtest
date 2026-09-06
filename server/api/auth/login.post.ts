import type { User } from "#shared/types";
import { db, verifyPassword } from "~~/server/utils/db";
import { startSession, toPublicUser } from "~~/server/utils/session";
import { asString } from "~~/server/utils/validation";

/** POST /api/auth/login { email, password } */
export default defineEventHandler(async (event): Promise<User> => {
  const body = await readBody<Record<string, unknown>>(event);
  const email = asString(body?.email).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";

  const user = db.users.find((candidate) => candidate.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: "Wrong email or password" });
  }

  startSession(event, user.id);
  return toPublicUser(user);
});
