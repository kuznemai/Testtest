<script setup lang="ts">
const points = [
  { title: "Trusted Hardware", text: "Security built in, from the ground up.", icon: "chip" },
  { title: "Optimized OS", text: "Minimal attack surface, maximum efficiency.", icon: "layers" },
  { title: "Open Future", text: "Freedom to choose. Built to last.", icon: "infinity" },
] as const;
</script>

<template>
  <section id="hardware" class="iz-section iz-section--tint">
    <div class="iz-wrap hardware__grid">
      <div class="hardware__intro">
        <p class="iz-eyebrow">Hardware + Software</p>
        <h2 class="iz-h2">Stronger<br >Together</h2>
        <p class="iz-lead">
          Custom hardware and a hardened operating system work as one to deliver end-to-end protection, from
          silicon to software.
        </p>
        <NuxtLink to="/offer" class="iz-btn iz-btn--ghost">
          <span>Learn More</span>
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

      <div class="hardware__visual">
        <img src="/iz-chip.png" alt="IZ secure element surrounded by circuitry" >
      </div>

      <ul class="hardware__points">
        <li v-for="point in points" :key="point.title" class="hardware__point">
          <span class="hardware__icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <template v-if="point.icon === 'chip'">
                <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M10 7V4m4 3V4m-4 16v-3m4 3v-3M7 10H4m3 4H4m16-4h-3m3 4h-3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </template>
              <template v-else-if="point.icon === 'layers'">
                <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              </template>
              <template v-else>
                <path
                  d="M7.5 9.5c1.9 0 2.6 2.5 4.5 2.5s2.6-2.5 4.5-2.5a2.5 2.5 0 0 1 0 5c-1.9 0-2.6-2.5-4.5-2.5S13.9 14.5 12 14.5 9.4 12 7.5 12a2.5 2.5 0 0 0 0 5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </template>
            </svg>
          </span>
          <div>
            <h3 class="hardware__title">{{ point.title }}</h3>
            <p class="hardware__text">{{ point.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hardware__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3.5rem);
}

.hardware__visual img {
  display: block;
  width: 100%;
  height: auto;
}

.hardware__points {
  display: flex;
  flex-direction: column;
  gap: clamp(1.1rem, 2vw, 1.8rem);
}

.hardware__point {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.hardware__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--iz-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.035);
  color: #8fc0ee;
}

.hardware__icon svg {
  width: 1.4rem;
  height: 1.4rem;
}

.hardware__title {
  color: #fff;
  font-size: clamp(0.92rem, 1.1vw, 1.02rem);
  font-weight: 600;
  line-height: 1.35;
}

.hardware__text {
  margin-top: 0.35rem;
  color: #8ea0b5;
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: 300;
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .hardware__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .hardware__visual {
    grid-row: span 2;
    order: 2;
  }

  .hardware__points {
    order: 3;
  }
}

@media (max-width: 760px) {
  .hardware__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.25rem;
  }

  .hardware__visual {
    grid-row: auto;
    max-width: 24rem;
    margin-inline: auto;
  }
}
</style>
