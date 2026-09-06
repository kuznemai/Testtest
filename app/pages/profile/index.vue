<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { fetchOrders } from "~/api/orders";
import { formatPrice } from "~/utils/format";
import { isFilled, isValidEmail, isValidPhone, normalizePhone } from "~/utils/validation";
import { toApiFailure } from "~/utils/api-error";

definePageMeta({ middleware: "auth" });

const auth = useAuthStore();

const { data: orders } = await useAsyncData("profile-orders-summary", fetchOrders, { default: () => [] });

const totalSpentCents = computed(() =>
  orders.value.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.totalCents, 0),
);

const form = reactive({
  name: auth.user?.name ?? "",
  email: auth.user?.email ?? "",
  phone: auth.user?.phone ?? "",
});

const errors = ref<Record<string, string>>({});
const formError = ref("");
const savedAt = ref(0);
const isSaving = ref(false);

async function save(): Promise<void> {
  formError.value = "";
  errors.value = {};

  if (!isFilled(form.name, 2)) errors.value.name = "Enter your name";
  if (!isValidEmail(form.email)) errors.value.email = "Enter a valid email address";
  if (form.phone && !isValidPhone(form.phone)) errors.value.phone = "Enter a valid phone number";
  if (Object.keys(errors.value).length > 0 || isSaving.value) return;

  isSaving.value = true;
  try {
    await auth.updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone ? normalizePhone(form.phone) : "",
    });
    savedAt.value = Date.now();
  } catch (error) {
    const failure = toApiFailure(error, "We could not save your details. Please try again.");
    errors.value = { ...errors.value, ...failure.fields };
    formError.value = failure.message;
  } finally {
    isSaving.value = false;
  }
}

async function signOut(): Promise<void> {
  await auth.logout();
  await navigateTo("/");
}

useSeo({ title: "Profile", description: "Your IZ account details and order history." });
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="iz-eyebrow">Account</p>
        <h1 class="iz-h1 mt-3">{{ auth.user?.name }}</h1>
        <p class="mt-2 text-sm text-[var(--iz-muted)]">{{ auth.user?.email }}</p>
      </div>
      <button type="button" class="iz-btn iz-btn--ghost" @click="signOut">Log out</button>
    </header>

    <ProfileNav />

    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      <div class="iz-card">
        <p class="iz-label">Orders</p>
        <p class="mt-1 text-2xl font-semibold text-white tabular-nums">{{ orders.length }}</p>
      </div>
      <div class="iz-card">
        <p class="iz-label">Spent</p>
        <p class="mt-1 text-2xl font-semibold text-white tabular-nums">{{ formatPrice(totalSpentCents) }}</p>
      </div>
      <div class="iz-card">
        <p class="iz-label">Member since</p>
        <p class="mt-1 text-2xl font-semibold text-white">{{ new Date(auth.user?.createdAt ?? Date.now()).getFullYear() }}</p>
      </div>
    </div>

    <section class="mt-8 max-w-lg">
      <h2 class="iz-label">Your details</h2>
      <form class="iz-card mt-3 flex flex-col gap-4" novalidate @submit.prevent="save">
        <UiFormField id="profile-name" v-model="form.name" label="Name" autocomplete="name" :error="errors.name" required />
        <UiFormField
          id="profile-email"
          v-model="form.email"
          label="Email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :error="errors.email"
          required
        />
        <UiFormField
          id="profile-phone"
          v-model="form.phone"
          label="Phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          :error="errors.phone"
        />

        <p v-if="formError" class="iz-error" role="alert">{{ formError }}</p>

        <div class="mt-2 flex items-center gap-4">
          <button type="submit" class="iz-btn iz-btn--solid" :disabled="isSaving">
            {{ isSaving ? "Saving…" : "Save changes" }}
          </button>
          <span v-if="savedAt" class="text-sm text-emerald-300" role="status">Saved</span>
        </div>
      </form>
    </section>
  </div>
</template>
