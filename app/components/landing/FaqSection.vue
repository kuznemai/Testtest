<script setup lang="ts">
import { ref } from "vue";

const faqs = [
  {
    q: "Is my data private with IZ?",
    a: "Yes. IZ OS collects no telemetry and no usage profiles. What stays on your device stays on your device, and anything that leaves it does so only because you asked it to.",
  },
  {
    q: "Can I install my favourite apps?",
    a: "You can. IZ runs standard Android apps, and every app is sandboxed with granular permissions you approve — including network access.",
  },
  {
    q: "How long do you provide security updates?",
    a: "Every IZ device receives security patches for at least five years from launch, delivered over the air and verified against a signed boot chain.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship worldwide with tracked delivery. Duties and taxes are calculated at checkout so there are no surprises on arrival.",
  },
  {
    q: "What makes IZ different from other Android phones?",
    a: "Custom hardware, a hardened operating system and a privacy-first default configuration — designed together rather than bolted on afterwards.",
  },
];

const open = ref<number | null>(null);

const toggle = (index: number): void => {
  open.value = open.value === index ? null : index;
};
</script>

<template>
  <section id="faq" class="iz-section">
    <div class="iz-wrap iz-split">
      <div>
        <p class="iz-eyebrow">Frequently asked questions</p>
        <h2 class="iz-h2">Your Questions,<br >Answered</h2>
        <p class="iz-lead">Everything you might want to know before making the switch.</p>
      </div>

      <ul class="faq__list">
        <li v-for="(item, index) in faqs" :key="item.q" class="faq__item">
          <button
            type="button"
            class="faq__question"
            :aria-expanded="open === index"
            :aria-controls="`faq-answer-${index}`"
            @click="toggle(index)"
          >
            <span>{{ item.q }}</span>
            <svg :class="{ 'faq__chevron--open': open === index }" class="faq__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9.5 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <p v-show="open === index" :id="`faq-answer-${index}`" class="faq__answer">{{ item.a }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq__list {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.faq__item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.faq__question {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(0.95rem, 1.6vw, 1.3rem) 0;
  color: #dfe8f2;
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  font-weight: 400;
  text-align: left;
  transition: color 0.2s ease;
}

.faq__question:hover {
  color: #fff;
}

.faq__chevron {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  color: #7e93a9;
  transition: transform 0.25s ease, color 0.2s ease;
}

.faq__chevron--open {
  transform: rotate(180deg);
  color: #8fc0ee;
}

.faq__answer {
  max-width: 62ch;
  padding-bottom: clamp(1rem, 1.6vw, 1.35rem);
  color: #8ea0b5;
  font-size: clamp(0.82rem, 0.98vw, 0.92rem);
  font-weight: 300;
  line-height: 1.7;
}
</style>
