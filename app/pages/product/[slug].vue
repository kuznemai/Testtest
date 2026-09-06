<script setup lang="ts">
import { fetchProduct } from "~/api/products";
import { formatPrice } from "~/utils/format";
import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";

const route = useRoute();
const cart = useCartStore();
const favorites = useFavoritesStore();

const slug = computed(() => String(route.params.slug));

const { data: product } = await useAsyncData(`product-${slug.value}`, () => fetchProduct(slug.value), {
  watch: [slug],
});

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: "Product not found", fatal: true });
}

const selectedVariantId = ref(
  product.value.variants.find((variant) => variant.stock > 0)?.id ?? product.value.variants[0]!.id,
);

// A different product arrives when navigating between cards.
watch(product, (next) => {
  if (!next) return;
  selectedVariantId.value = next.variants.find((variant) => variant.stock > 0)?.id ?? next.variants[0]!.id;
});

const selectedVariant = computed(() =>
  product.value?.variants.find((variant) => variant.id === selectedVariantId.value),
);

const canAddToCart = computed(() => (selectedVariant.value?.stock ?? 0) > 0);
const inCartQuantity = computed(() =>
  product.value ? cart.quantityOf(product.value.id, selectedVariantId.value) : 0,
);
const isSaved = computed(() => (product.value ? favorites.has(product.value.id) : false));

const justAdded = ref(false);
let addedTimer: ReturnType<typeof setTimeout> | undefined;

function addToCart(): void {
  if (!product.value || !canAddToCart.value) return;
  cart.add(product.value.id, selectedVariantId.value);
  justAdded.value = true;
  clearTimeout(addedTimer);
  addedTimer = setTimeout(() => {
    justAdded.value = false;
  }, 2500);
}

onBeforeUnmount(() => clearTimeout(addedTimer));

useSeo({
  title: `${product.value.title} — ${product.value.tagline}`,
  description: product.value.description,
  image: product.value.images[0],
});
</script>

<template>
  <div v-if="product" class="iz-wrap iz-page">
    <NuxtLink to="/shop" class="mb-8 inline-flex items-center gap-2 text-sm text-[var(--iz-muted)] hover:text-white">
      <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
        <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      All devices
    </NuxtLink>

    <div class="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery :images="product.images" :title="product.title" />

      <div class="flex flex-col gap-7">
        <div>
          <p class="iz-eyebrow">{{ product.tagline }}</p>
          <h1 class="iz-h1 mt-3">{{ product.title }}</h1>
          <p class="mt-4 max-w-prose leading-relaxed text-[var(--iz-muted)]">{{ product.description }}</p>
        </div>

        <ul class="flex flex-col gap-2">
          <li
            v-for="highlight in product.highlights"
            :key="highlight"
            class="flex items-start gap-2.5 text-sm text-zinc-300"
          >
            <svg viewBox="0 0 24 24" fill="none" class="mt-0.5 h-4 w-4 shrink-0 text-[var(--iz-accent)]" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ highlight }}
          </li>
        </ul>

        <ProductConfigurator v-model="selectedVariantId" :variants="product.variants" />

        <div class="flex flex-col gap-4 border-t border-[var(--iz-border-soft)] pt-6">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span class="iz-label">Price</span>
              <p class="text-3xl font-semibold text-white tabular-nums" data-testid="product-price">
                {{ formatPrice(selectedVariant?.priceCents) }}
              </p>
            </div>

            <ClientOnly>
              <button
                type="button"
                class="iz-btn iz-btn--ghost"
                :aria-pressed="isSaved"
                @click="favorites.toggle(product.id)"
              >
                <svg viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" aria-hidden="true">
                  <path
                    d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ isSaved ? "Saved" : "Save" }}
              </button>
            </ClientOnly>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="iz-btn iz-btn--solid sm:flex-1"
              :disabled="!canAddToCart"
              data-testid="add-to-cart"
              @click="addToCart"
            >
              {{ canAddToCart ? "Add to cart" : "Out of stock" }}
            </button>
            <NuxtLink v-if="inCartQuantity > 0" to="/cart" class="iz-btn iz-btn--ghost sm:flex-1">
              Go to cart ({{ inCartQuantity }})
            </NuxtLink>
          </div>

          <p v-if="justAdded" class="text-sm text-emerald-300" role="status">Added to your cart.</p>
        </div>

        <section>
          <h2 class="iz-label">Specifications</h2>
          <dl class="mt-2 divide-y divide-[var(--iz-border-soft)] border-y border-[var(--iz-border-soft)]">
            <div v-for="spec in product.specs" :key="spec.label" class="flex gap-4 py-3 text-sm">
              <dt class="w-36 shrink-0 text-[var(--iz-muted)]">{{ spec.label }}</dt>
              <dd class="min-w-0 text-zinc-200">{{ spec.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  </div>
</template>
