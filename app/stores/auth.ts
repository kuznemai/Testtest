import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { AuthCredentials, RegisterPayload, User } from "#shared/types";
import { apiCurrentUser, apiLogin, apiLogout, apiRegister, apiUpdateProfile } from "~/api/auth";

/**
 * Session state. The token itself never reaches JavaScript — the mock backend sets
 * an httpOnly cookie, exactly as the real backend is expected to.
 */
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => Boolean(user.value));

  async function fetchUser(): Promise<void> {
    try {
      user.value = (await apiCurrentUser()).user;
    } catch {
      // A failing session lookup means "not signed in"; nothing to surface here.
      user.value = null;
    }
  }

  async function login(credentials: AuthCredentials): Promise<void> {
    user.value = await apiLogin(credentials);
  }

  async function register(payload: RegisterPayload): Promise<void> {
    user.value = await apiRegister(payload);
  }

  async function logout(): Promise<void> {
    try {
      await apiLogout();
    } finally {
      user.value = null;
    }
  }

  async function updateProfile(payload: { name: string; email: string; phone: string }): Promise<void> {
    user.value = await apiUpdateProfile(payload);
  }

  return { user, isAuthenticated, fetchUser, login, register, logout, updateProfile };
});
