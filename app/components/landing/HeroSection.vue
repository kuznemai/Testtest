<script setup lang="ts"></script>

<template>
  <section class="hero">
    <div class="hero__bg" aria-hidden="true"/>

    <div class="hero__stage">
      <div class="hero__visual">
        <img src="/hero-phone.png" alt="IZ secure smartphone on a glowing shield podium" >
      </div>

      <div class="hero__copy">
        <p class="hero__eyebrow">Built to protect<br >what matters</p>
        <h1 class="hero__title">Next-Gen<br >Security<br >in Your Hands</h1>
        <p class="hero__sub">A secure operating system.<br >A more open future.</p>
        <div class="hero__actions">
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
      </div>

      <p class="hero__aside">Privacy<br >goes<br >further.</p>
    </div>

    <ul class="hero__features">
      <li class="hero__feature">
        <svg class="hero__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="9" y="21" width="30" height="21" rx="4" stroke="currentColor" stroke-width="3" />
          <path d="M16 21v-6a8 8 0 0 1 16 0v6" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          <circle cx="24" cy="29.5" r="2.6" fill="currentColor" />
          <path d="M24 31.5v4" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <div>
          <h3>Unbreakable Privacy</h3>
          <p>Your data stays yours.</p>
        </div>
      </li>

      <li class="hero__feature">
        <svg class="hero__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="13" y="13" width="22" height="22" rx="3" stroke="currentColor" stroke-width="3" />
          <rect x="20" y="20" width="8" height="8" rx="1.5" fill="currentColor" />
          <path
            d="M19 13V8m10 5V8M19 40v-5m10 5v-5M13 19H8m5 10H8m32-10h-5m5 10h-5"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div>
          <h3>Secure by Design</h3>
          <p>Hardware meets software.</p>
        </div>
      </li>

      <li class="hero__feature">
        <svg class="hero__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="14" y="10" width="20" height="32" rx="4" stroke="currentColor" stroke-width="3" />
          <path
            d="M20 10V7.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 28 7.5V10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path d="m25.5 17-6 10h5l-2 8 9-11h-5.5l2-7z" fill="currentColor" />
        </svg>
        <div>
          <h3>All-Day Power</h3>
          <p>Security that lasts.</p>
        </div>
      </li>

      <li class="hero__feature">
        <svg class="hero__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M24 6 40 14.5v19L24 42 8 33.5v-19L24 6Z"
            stroke="currentColor"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <path d="M8 14.5 24 23l16-8.5M24 23v19" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />
        </svg>
        <div>
          <h3>Open Ecosystem</h3>
          <p>More control, fewer chains.</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: clamp(6.5rem, 11vw, 9rem) 0 clamp(1.75rem, 3vw, 2.75rem);
  font-family: "Poppins", "Roboto", sans-serif;
  isolation: isolate;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(58% 52% at 64% 42%, rgba(30, 104, 200, 0.3) 0%, rgba(12, 42, 92, 0.14) 42%, rgba(3, 7, 16, 0) 72%),
    radial-gradient(90% 70% at 50% 110%, rgba(9, 34, 76, 0.55) 0%, rgba(3, 7, 16, 0) 70%),
    linear-gradient(155deg, #05080f 0%, #050a15 45%, #03060d 100%);
}

/* ---------- stage ---------- */
.hero__stage {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 4.5rem);
}

.hero__visual {
  position: absolute;
  top: 50%;
  left: 66%;
  z-index: 0;
  width: min(45rem, 53vw);
  transform: translate(-50%, -54%);
  pointer-events: none;
}

.hero__visual img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 90px rgba(28, 120, 235, 0.35));
  animation: hero-float 9s ease-in-out infinite;
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

.hero__copy {
  position: relative;
  z-index: 2;
  max-width: 34rem;
}

.hero__eyebrow {
  margin-bottom: clamp(1.1rem, 2vw, 1.9rem);
  color: #8fc0ee;
  font-size: clamp(0.78rem, 1.28vw, 1.05rem);
  font-weight: 400;
  line-height: 1.9;
  letter-spacing: 0.34em;
  text-transform: uppercase;
}

.hero__title {
  color: #fff;
  font-size: clamp(2.4rem, 4.9vw, 4.5rem);
  font-weight: 700;
  line-height: 1.07;
  letter-spacing: -0.015em;
}

.hero__sub {
  margin-top: clamp(1.1rem, 2vw, 1.75rem);
  color: #cbd7e4;
  font-size: clamp(1.02rem, 1.55vw, 1.4rem);
  font-weight: 300;
  line-height: 1.55;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
}

.hero__aside {
  position: absolute;
  top: 50%;
  right: clamp(1.25rem, 4vw, 4.5rem);
  z-index: 2;
  transform: translateY(-50%);
  color: #8fc0ee;
  font-size: clamp(0.78rem, 1.28vw, 1.05rem);
  font-weight: 400;
  line-height: 2.4;
  letter-spacing: 0.34em;
  text-align: right;
  text-transform: uppercase;
}

/* ---------- feature strip ---------- */
.hero__features {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  max-width: 1520px;
  margin: clamp(2rem, 4vw, 3.5rem) auto 0;
  padding: 0 clamp(1.25rem, 4vw, 4.5rem);
}

.hero__feature {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.2vw, 1.2rem);
  padding: 0 clamp(0.85rem, 2vw, 2rem);
}

.hero__feature:first-child {
  padding-left: 0;
}

.hero__feature + .hero__feature {
  border-left: 1px solid rgba(255, 255, 255, 0.14);
}

.hero__icon {
  width: clamp(2rem, 2.9vw, 2.7rem);
  height: clamp(2rem, 2.9vw, 2.7rem);
  flex-shrink: 0;
  color: #fff;
}

.hero__feature h3 {
  color: #fff;
  font-size: clamp(0.88rem, 1.2vw, 1.1rem);
  font-weight: 600;
  line-height: 1.3;
}

.hero__feature p {
  margin-top: 0.3rem;
  color: #93a6bb;
  font-size: clamp(0.76rem, 0.98vw, 0.9rem);
  font-weight: 300;
  line-height: 1.4;
}

/* ---------- responsive ---------- */
@media (max-width: 1280px) {
  .hero__visual {
    left: 70%;
    width: min(40rem, 56vw);
  }

  .hero__aside {
    display: none;
  }
}

@media (max-width: 1024px) {
  .hero {
    min-height: 0;
    padding-top: clamp(5.5rem, 14vw, 7.5rem);
  }

  .hero__stage {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    text-align: center;
  }

  .hero__visual {
    position: relative;
    top: auto;
    left: auto;
    order: 2;
    width: min(32rem, 88vw);
    transform: none;
  }

  .hero__copy {
    order: 1;
    max-width: 38rem;
  }

  .hero__actions {
    justify-content: center;
  }

  .hero__features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.75rem 0;
  }

  .hero__feature {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 0.75rem;
    text-align: center;
  }

  .hero__feature:first-child {
    padding-left: 0.75rem;
  }

  .hero__feature + .hero__feature {
    border-left: 0;
  }

  .hero__feature:nth-child(2n) {
    border-left: 1px solid rgba(255, 255, 255, 0.14);
  }
}

@media (max-width: 680px) {
  .hero__features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .hero__feature {
    flex-direction: row;
    padding: 0;
    text-align: left;
  }

  .hero__feature:first-child {
    padding-left: 0;
  }

  .hero__feature:nth-child(2n) {
    border-left: 0;
  }

  .hero__feature + .hero__feature {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 1.5rem;
  }

  .hero__actions .iz-btn {
    flex: 1 1 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__visual img {
    animation: none;
  }
}
</style>
