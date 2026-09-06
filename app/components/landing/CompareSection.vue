<script setup lang="ts">
const rows = [
  { feature: "Data Ownership", iz: "You control your data", other: "Data shared by default" },
  { feature: "Tracking", iz: "Blocked by design", other: "Extensive tracking" },
  { feature: "Default Encryption", iz: "On, always", other: "Limited or optional" },
  { feature: "Open Ecosystem", iz: "Supports your choice", other: "Restrictive ecosystem" },
  { feature: "Security Updates", iz: "Long-term support", other: "Short-term support" },
] as const;
</script>

<template>
  <section id="compare" class="iz-section">
    <div class="iz-wrap iz-split">
      <div>
        <p class="iz-eyebrow">How we compare</p>
        <h2 class="iz-h2">A Higher Standard<br >for Your Security</h2>
        <p class="iz-lead">
          The same everyday phone experience — without the trade-offs you were never asked about.
        </p>
      </div>

      <div class="compare__panel">
        <div class="compare__row compare__row--head">
          <span>Feature</span>
          <span>IZ Secure Phone</span>
          <span>Standard Smartphone</span>
        </div>
        <div v-for="row in rows" :key="row.feature" class="compare__row">
          <span class="compare__feature">{{ row.feature }}</span>
          <span class="compare__yes">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m5 12.5 4.5 4.5L19 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ row.iz }}
          </span>
          <span class="compare__no">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            {{ row.other }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.compare__panel {
  overflow: hidden;
  border: 1px solid var(--iz-border, rgba(255, 255, 255, 0.08));
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01));
}

.compare__row {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.05fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 1rem;
  padding: clamp(0.8rem, 1.35vw, 1.1rem) clamp(1rem, 1.8vw, 1.6rem);
}

.compare__row + .compare__row {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.compare__row--head {
  background: rgba(255, 255, 255, 0.03);
  color: #dfe8f2;
  font-size: clamp(0.72rem, 0.88vw, 0.84rem);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.compare__feature {
  color: #dfe8f2;
  font-size: clamp(0.82rem, 0.98vw, 0.94rem);
  font-weight: 500;
}

.compare__yes,
.compare__no {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: clamp(0.78rem, 0.95vw, 0.9rem);
  font-weight: 300;
  line-height: 1.4;
}

.compare__yes {
  color: #cfe0f2;
}

.compare__no {
  color: #7a889a;
}

.compare__yes svg,
.compare__no svg {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.compare__yes svg {
  color: #6fb2f5;
}

.compare__no svg {
  color: #5a6674;
}

@media (max-width: 640px) {
  .compare__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }

  .compare__row--head {
    display: none;
  }
}
</style>
