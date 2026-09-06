<script setup lang="ts">
const cards = [
  {
    title: "Your Privacy First",
    text: "No tracking, no profiling, no hidden data collection.",
    icon: "shield",
  },
  {
    title: "You're in Control",
    text: "Choose what you share. Everything else stays with you.",
    icon: "sliders",
  },
  {
    title: "Designed to Defend",
    text: "Built with hardened layers of hardware and software security.",
    icon: "lock",
  },
  {
    title: "Always Evolving",
    text: "Regular updates keep you a step ahead.",
    icon: "refresh",
  },
] as const;
</script>

<template>
  <section id="why" class="iz-section iz-section--tint">
    <div class="iz-wrap iz-split">
      <div>
        <p class="iz-eyebrow">Why IZ OS</p>
        <h2 class="iz-h2">Security without<br >compromise</h2>
        <p class="iz-lead">
          IZ OS is a next-generation, privacy-first operating system designed for a more open, secure and
          independent digital life.
        </p>
        <NuxtLink to="/offer" class="iz-btn iz-btn--ghost">
          <span>Explore Technology</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NuxtLink>
      </div>

      <ul class="why__cards">
        <li v-for="card in cards" :key="card.title" class="iz-card">
          <svg class="iz-card__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <template v-if="card.icon === 'shield'">
              <path
                d="M12 3 20 6v6c0 4.6-3.3 7.9-8 9-4.7-1.1-8-4.4-8-9V6l8-3Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path d="m9 12 2.2 2.2L15.4 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </template>
            <template v-else-if="card.icon === 'sliders'">
              <path d="M4 7h9m3 0h4M4 17h4m3 0h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              <circle cx="14.5" cy="7" r="2.3" stroke="currentColor" stroke-width="1.6" />
              <circle cx="9.5" cy="17" r="2.3" stroke="currentColor" stroke-width="1.6" />
            </template>
            <template v-else-if="card.icon === 'lock'">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" stroke-width="1.6" />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              <circle cx="12" cy="15" r="1.4" fill="currentColor" />
            </template>
            <template v-else>
              <path
                d="M20 12a8 8 0 1 1-2.4-5.7"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <path d="M20 3.5V8h-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </template>
          </svg>
          <h3 class="iz-card__title">{{ card.title }}</h3>
          <p class="iz-card__text">{{ card.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.why__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.85rem, 1.4vw, 1.25rem);
}

@media (max-width: 560px) {
  .why__cards {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
