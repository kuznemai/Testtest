<script setup lang="ts"></script>

<template>
  <section class="iz-section cta">
    <div class="iz-wrap">
      <div class="cta__panel">
        <img class="cta__bg" src="/cta-mountains.jpg" alt="" aria-hidden="true" >
        <div class="cta__scrim" aria-hidden="true"/>

        <div class="cta__content">
          <div>
            <p class="iz-eyebrow">Secure today. A brighter tomorrow.</p>
            <h2 class="iz-h2">Privacy is a choice.<br >Make it yours.</h2>
            <p class="iz-lead">Experience a more open, secure and independent future.</p>
            <NuxtLink to="/shop" class="iz-btn iz-btn--solid">
              <span>Shop Now</span>
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

          <p class="iz-vertical cta__aside">Same world.<br >Safer phone.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  border-top: 0;
}

.cta__panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: clamp(1rem, 1.6vw, 1.5rem);
  isolation: isolate;
}

.cta__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta__scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(100deg, rgba(3, 7, 16, 0.92) 0%, rgba(4, 10, 24, 0.7) 45%, rgba(4, 12, 30, 0.35) 100%);
}

.cta__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: clamp(2.25rem, 4.5vw, 4.5rem) clamp(1.5rem, 3.5vw, 4rem);
}

@media (max-width: 1024px) {
  .cta__aside {
    display: none;
  }
}
</style>
