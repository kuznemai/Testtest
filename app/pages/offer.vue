<script setup lang="ts">
type IconName = "chip" | "wallet" | "shield" | "network" | "contract" | "bolt" | "privacy";

const FEATURES: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Crypto-focused OS",
    description: "Hardened system with multi-layer encryption, verified boot, and storage you control.",
    icon: "chip",
  },
  {
    title: "Cold wallet integration",
    description: "Hardware-backed keys stay inside the secure enclave — never exposed to the rest of the stack.",
    icon: "wallet",
  },
  {
    title: "Multi-layer security",
    description: "Biometrics, air-gapped signing flows, and trusted execution where it matters.",
    icon: "shield",
  },
  {
    title: "Decentralised communication",
    description: "Encrypted messaging and calls designed around identity you own, not a vendor account.",
    icon: "network",
  },
  {
    title: "Smart contract ready",
    description: "Pre-installed dApp environment to review, sign, and interact with contracts safely.",
    icon: "contract",
  },
  {
    title: "Lightning-fast settlements",
    description: "Tuned for Lightning, L2s, and instant payment rails without sacrificing custody discipline.",
    icon: "bolt",
  },
  {
    title: "Privacy by design",
    description: "No tracking stack, no bloatware — granular permissions and real opt-out defaults.",
    icon: "privacy",
  },
];

useSeo({
  title: "Technology",
  description:
    "How IZ OS works: verified boot, a secure enclave for keys, per-app permissions and an update channel that lasts five years.",
});
</script>

<template>
  <div class="iz-wrap iz-page">
    <header class="mx-auto mb-12 max-w-3xl text-center">
      <p class="iz-eyebrow">Technology</p>
      <h1 class="iz-h1 mt-3">Crypto secure phone</h1>
      <p class="mt-4 text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        One device for people who treat keys like cash: traders, builders, and anyone who refuses to trust a
        glossy OS with their future.
      </p>
    </header>

    <section class="iz-card mx-auto mb-10 max-w-4xl text-center">
      <h2 class="text-xl font-medium text-white md:text-2xl">Built for digital asset protection</h2>
      <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        A smartphone centred on a custom, blockchain-aware operating environment — so custody, signing, and
        day-to-day use stay in lanes that auditors and attackers would both respect.
      </p>
    </section>

    <ul class="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="feature in FEATURES" :key="feature.title" class="iz-card flex gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--iz-border)] bg-white/3">
          <OfferFeatureIcon :name="feature.icon" />
        </div>
        <div class="min-w-0">
          <h3 class="text-base font-medium text-zinc-100">{{ feature.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-[var(--iz-muted)]">{{ feature.description }}</p>
        </div>
      </li>
    </ul>

    <section class="iz-card mx-auto mt-12 max-w-3xl text-center">
      <p class="text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        Ideal for crypto traders, protocol teams, and security-minded individuals who want hardware that
        matches their threat model — without living in a CLI.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">View devices</NuxtLink>
        <NuxtLink to="/contact" class="iz-btn iz-btn--ghost">Contact us</NuxtLink>
      </div>
    </section>
  </div>
</template>
