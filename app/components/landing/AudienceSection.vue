<script setup lang="ts">
const groups = [
  { title: "Professionals", text: "Keep your work and clients private.", icon: "briefcase" },
  { title: "Families", text: "Build a safer digital environment at home.", icon: "home" },
  { title: "Students", text: "Learn and explore with greater peace of mind.", icon: "cap" },
  { title: "Privacy Advocates", text: "Support a more open and secure internet.", icon: "globe" },
] as const;
</script>

<template>
  <section id="audience" class="iz-section iz-section--tint">
    <div class="iz-wrap iz-split">
      <div>
        <p class="iz-eyebrow">For a more secure tomorrow</p>
        <h2 class="iz-h2">Built for People<br >Who Care</h2>
        <p class="iz-lead">
          Whether you're a professional, a creator, a family or simply value your privacy — IZ is built for you.
        </p>
      </div>

      <ul class="audience__grid">
        <li v-for="group in groups" :key="group.title" class="audience__item">
          <span class="audience__icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <template v-if="group.icon === 'briefcase'">
                <rect x="3" y="7.5" width="18" height="12" rx="2.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </template>
              <template v-else-if="group.icon === 'home'">
                <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="M9.5 20.5v-6h5v6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              </template>
              <template v-else-if="group.icon === 'cap'">
                <path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5-9.5-4.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="M6.5 11.5V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </template>
              <template v-else>
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6" />
                <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" stroke="currentColor" stroke-width="1.6" />
              </template>
            </svg>
          </span>
          <h3 class="audience__title">{{ group.title }}</h3>
          <p class="audience__text">{{ group.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.audience__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}

.audience__item {
  padding-inline: clamp(0.5rem, 1.2vw, 1.2rem);
}

.audience__item:first-child {
  padding-left: 0;
}

.audience__item + .audience__item {
  border-left: 1px solid rgba(255, 255, 255, 0.09);
}

.audience__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #8fc0ee;
}

.audience__icon svg {
  width: 1.4rem;
  height: 1.4rem;
}

.audience__title {
  margin-top: 1rem;
  color: #fff;
  font-size: clamp(0.9rem, 1.05vw, 1rem);
  font-weight: 600;
  line-height: 1.35;
}

.audience__text {
  margin-top: 0.4rem;
  color: #8ea0b5;
  font-size: clamp(0.78rem, 0.93vw, 0.88rem);
  font-weight: 300;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .audience__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.75rem 1.25rem;
  }

  .audience__item,
  .audience__item:first-child {
    padding-left: 0;
  }

  .audience__item + .audience__item {
    border-left: 0;
  }
}

@media (max-width: 520px) {
  .audience__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
