import type { User } from "#shared/types";
import { createId, db, hashPassword } from "~~/server/utils/db";
import { startSession, toPublicUser } from "~~/server/utils/session";
import { asString, EMAIL_PATTERN, fieldErrors } from "~~/server/utils/validation";

/** POST /api/auth/register { name, email, password } */
export default defineEventHandler(async (event): Promise<User> => {
  const body = await readBody<Record<string, unknown>>(event);
  const name = asString(body?.name);
  const email = asString(body?.email).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter your name";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (password.length < 8) errors.password = "Use at least 8 characters";
  if (db.users.some((user) => user.email === email)) errors.email = "This email is already registered";
  if (Object.keys(errors).length > 0) fieldErrors(errors);

  const user = {
    id: createId("u"),
    email,
    name,
    phone: null,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password),
  };
  db.users.push(user);
  startSession(event, user.id);

  return toPublicUser(user);
});
