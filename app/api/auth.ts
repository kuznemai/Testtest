import type { AuthCredentials, RegisterPayload, User } from "#shared/types";

export function apiRegister(payload: RegisterPayload) {
  return useNuxtApp().$api<User>("/auth/register", { method: "POST", body: payload });
}

export function apiLogin(credentials: AuthCredentials) {
  return useNuxtApp().$api<User>("/auth/login", { method: "POST", body: credentials });
}

export function apiLogout() {
  return useNuxtApp().$api<{ ok: true }>("/auth/logout", { method: "POST" });
}

export function apiCurrentUser() {
  return useNuxtApp().$api<{ user: User | null }>("/auth/me");
}

export function apiUpdateProfile(payload: { name: string; email: string; phone: string }) {
  return useNuxtApp().$api<User>("/auth/me", { method: "PATCH", body: payload });
}
