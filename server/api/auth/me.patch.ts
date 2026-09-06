import type { User } from "#shared/types";
import { requireUser, toPublicUser } from "~~/server/utils/session";
import { asString, EMAIL_PATTERN, fieldErrors } from "~~/server/utils/validation";

/** PATCH /api/auth/me { name, email, phone } */
export default defineEventHandler(async (event): Promise<User> => {
  const user = requireUser(event);
  const body = await readBody<Record<string, unknown>>(event);

  const name = asString(body?.name);
  const email = asString(body?.email).toLowerCase();
  const phone = asString(body?.phone);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter your name";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (Object.keys(errors).length > 0) fieldErrors(errors);

  user.name = name;
  user.email = email;
  user.phone = phone || null;

  return toPublicUser(user);
});
