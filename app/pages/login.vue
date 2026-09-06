<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { isValidEmail, safeRedirectPath } from "~/utils/validation";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "guest" });

const auth = useAuthStore();
const route = useRoute();

const form = reactive({ email: "", password: "" });
const errors = ref<Record<string, string>>({});
const formError = ref("");
const isSubmitting = ref(false);

const redirectTo = computed(() => safeRedirectPath(route.query.redirect, "/profile"));

async function submit(): Promise<void> {
  formError.value = "";
  errors.value = {};

  if (!isValidEmail(form.email)) errors.value.email = "Enter a valid email address";
  if (form.password.length < 8) errors.value.password = "Use at least 8 characters";
  if (Object.keys(errors.value).length > 0 || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    await auth.login({ email: form.email.trim(), password: form.password });
    await navigateTo(redirectTo.value);
  } catch (error) {
    const failure = toApiFailure(error, "We could not sign you in. Please try again.");
    errors.value = { ...errors.value, ...failure.fields };
    formError.value = failure.message;
  } finally {
    isSubmitting.value = false;
  }
}

useSeo({ title: "Sign in", description: "Sign in to your IZ account to track orders and manage your profile." });
</script>

<template>
  <div class="iz-wrap iz-page">
    <div class="mx-auto w-full max-w-md">
      <p class="iz-eyebrow">Account</p>
      <h1 class="iz-h1 mt-3">Sign in</h1>
      <p class="mt-3 text-sm text-[var(--iz-muted)]">
        Use the demo account <span class="text-zinc-300">demo@iz.example</span> /
        <span class="text-zinc-300">demo1234</span> to see orders and tracking.
      </p>

      <form class="iz-card mt-7 flex flex-col gap-4" novalidate @submit.prevent="submit">
        <UiFormField
          id="login-email"
          v-model="form.email"
          label="Email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :error="errors.email"
          required
        />
        <UiFormField
          id="login-password"
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="current-password"
          :error="errors.password"
          required
        />

        <p v-if="formError" class="iz-error" role="alert" data-testid="login-error">{{ formError }}</p>

        <button type="submit" class="iz-btn iz-btn--solid iz-btn--block mt-2" :disabled="isSubmitting">
          {{ isSubmitting ? "Signing in…" : "Sign in" }}
        </button>
      </form>

      <p class="mt-6 text-sm text-[var(--iz-muted)]">
        No account yet?
        <NuxtLink :to="{ path: '/register', query: route.query }" class="text-[var(--iz-accent)] hover:underline">
          Create one
        </NuxtLink>
      </p>
      <p class="mt-2 text-xs text-[var(--iz-muted)]">
        Password recovery arrives with the real backend — it needs transactional email.
      </p>
    </div>
  </div>
</template>
