<script setup lang="ts">
import { isFilled, isValidEmail } from "~/utils/validation";

const SUPPORT_EMAIL = "support@iz.example";

const form = reactive({ name: "", email: "", message: "" });
const errors = ref<Record<string, string>>({});
const opened = ref(false);

/**
 * No contact endpoint exists yet, so the form hands the message to the visitor's
 * mail client. It becomes a `POST /support/messages` call once the backend is up.
 */
function submit(): void {
  errors.value = {};

  if (!isFilled(form.name, 2)) errors.value.name = "Enter your name";
  if (!isValidEmail(form.email)) errors.value.email = "Enter a valid email address";
  if (!isFilled(form.message, 10)) errors.value.message = "Tell us a little more (at least 10 characters)";
  if (Object.keys(errors.value).length > 0) return;

  const subject = encodeURIComponent(`IZ — message from ${form.name}`);
  const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  opened.value = true;
}

useSeo({
  title: "Support",
  description: "Questions about devices, orders or partnerships — talk to the IZ team.",
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <header class="mb-10 max-w-2xl">
      <p class="iz-eyebrow">Get in touch</p>
      <h1 class="iz-h1 mt-3">Support</h1>
      <p class="mt-4 text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        Questions about devices, orders, or partnerships — send us a message and we will get back to you
        within one business day.
      </p>
    </header>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <form class="iz-card flex flex-col gap-4" novalidate @submit.prevent="submit">
        <UiFormField id="contact-name" v-model="form.name" label="Name" autocomplete="name" :error="errors.name" required />
        <UiFormField
          id="contact-email"
          v-model="form.email"
          label="Email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :error="errors.email"
          required
        />

        <div>
          <label class="iz-label" for="contact-message">Message</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            class="iz-input min-h-32"
            rows="5"
            :aria-invalid="errors.message ? 'true' : undefined"
            :aria-describedby="errors.message ? 'contact-message-error' : undefined"
            placeholder="How can we help?"
          />
          <p v-if="errors.message" id="contact-message-error" class="iz-error">{{ errors.message }}</p>
        </div>

        <button type="submit" class="iz-btn iz-btn--solid mt-2 self-start">Send message</button>

        <p v-if="opened" class="text-sm text-emerald-300" role="status">
          We opened your mail app with the message ready to send.
        </p>
      </form>

      <aside class="iz-card">
        <h2 class="iz-label">Direct</h2>
        <a :href="`mailto:${SUPPORT_EMAIL}`" class="mt-2 block text-sm text-[var(--iz-accent)] hover:underline">
          {{ SUPPORT_EMAIL }}
        </a>
        <p class="mt-6 text-xs leading-relaxed text-[var(--iz-muted)]">
          Order questions are answered fastest with the order number from
          <NuxtLink to="/profile/orders" class="text-[var(--iz-accent)] hover:underline">My orders</NuxtLink>.
        </p>
      </aside>
    </div>
  </div>
</template>
