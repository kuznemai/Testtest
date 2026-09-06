<script setup lang="ts"></script>

<template>
  <section id="experience" class="iz-section experience">
    <div class="iz-wrap experience__grid">
      <div class="experience__intro">
        <p class="iz-eyebrow">A Secure Experience</p>
        <h2 class="iz-h2">Designed for<br >a safer digital life</h2>
        <p class="iz-lead">
          A clean, intuitive interface. Powerful privacy controls. Everything you need, nothing you don't.
        </p>
        <NuxtLink to="/offer" class="iz-btn iz-btn--ghost">
          <span>See IZ OS in Action</span>
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

      <div class="experience__visual">
        <img src="/iz-ui-phones.png" alt="IZ OS lock screen and Privacy Center" >
      </div>

      <p class="iz-vertical experience__aside">Simple.<br >Secure.<br >Yours.</p>
    </div>
  </section>
</template>

<style scoped>
.experience__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) auto;
  align-items: center;
  gap: clamp(1.75rem, 3.5vw, 4rem);
}

.experience__visual img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 24px 70px rgba(20, 90, 190, 0.35));
}

@media (max-width: 1280px) {
  .experience__grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  }

  .experience__aside {
    display: none;
  }
}

@media (max-width: 1024px) {
  .experience__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.25rem;
  }

  .experience__visual {
    max-width: 34rem;
    margin-inline: auto;
  }
}
</style>
