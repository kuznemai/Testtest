<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { isFilled, isValidEmail, safeRedirectPath } from "~/utils/validation";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "guest" });

const auth = useAuthStore();
const route = useRoute();

const form = reactive({ name: "", email: "", password: "" });
const errors = ref<Record<string, string>>({});
const formError = ref("");
const isSubmitting = ref(false);

const redirectTo = computed(() => safeRedirectPath(route.query.redirect, "/profile"));

async function submit(): Promise<void> {
  formError.value = "";
  errors.value = {};

  if (!isFilled(form.name, 2)) errors.value.name = "Enter your name";
  if (!isValidEmail(form.email)) errors.value.email = "Enter a valid email address";
  if (form.password.length < 8) errors.value.password = "Use at least 8 characters";
  if (Object.keys(errors.value).length > 0 || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    await auth.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    await navigateTo(redirectTo.value);
  } catch (error) {
    const failure = toApiFailure(error, "We could not create your account. Please try again.");
    errors.value = { ...errors.value, ...failure.fields };
    formError.value = failure.message;
  } finally {
    isSubmitting.value = false;
  }
}

useSeo({ title: "Create an account", description: "Create an IZ account to place orders and follow their delivery." });
</script>

<template>
  <div class="iz-wrap iz-page">
    <div class="mx-auto w-full max-w-md">
      <p class="iz-eyebrow">Account</p>
      <h1 class="iz-h1 mt-3">Create an account</h1>
      <p class="mt-3 text-sm text-[var(--iz-muted)]">
        You need an account to place an order and follow its delivery.
      </p>

      <form class="iz-card mt-7 flex flex-col gap-4" novalidate @submit.prevent="submit">
        <UiFormField id="reg-name" v-model="form.name" label="Name" autocomplete="name" :error="errors.name" required />
        <UiFormField
          id="reg-email"
          v-model="form.email"
          label="Email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :error="errors.email"
          required
        />
        <UiFormField
          id="reg-password"
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="new-password"
          :error="errors.password"
          required
        />

        <p v-if="formError" class="iz-error" role="alert" data-testid="register-error">{{ formError }}</p>

        <button type="submit" class="iz-btn iz-btn--solid iz-btn--block mt-2" :disabled="isSubmitting">
          {{ isSubmitting ? "Creating account…" : "Create account" }}
        </button>
      </form>

      <p class="mt-6 text-sm text-[var(--iz-muted)]">
        Already have an account?
        <NuxtLink :to="{ path: '/login', query: route.query }" class="text-[var(--iz-accent)] hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
