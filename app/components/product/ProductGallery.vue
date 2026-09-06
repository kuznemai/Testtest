<script setup lang="ts">
const props = defineProps<{ images: string[]; title: string }>();

const activeIndex = ref(0);
const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0] ?? "");

// A different product may have fewer images than the one before it.
watch(
  () => props.images,
  () => {
    activeIndex.value = 0;
  },
);
</script>

<template>
  <div class="gallery">
    <div class="gallery__stage">
      <img
        :src="activeImage"
        :alt="title"
        width="520"
        height="390"
        fetchpriority="high"
        decoding="async"
      >
    </div>

    <div v-if="images.length > 1" class="gallery__thumbs" role="tablist" :aria-label="`${title} images`">
      <button
        v-for="(image, index) in images"
        :key="image"
        type="button"
        role="tab"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': index === activeIndex }"
        :aria-selected="index === activeIndex"
        :aria-label="`Image ${index + 1} of ${images.length}`"
        @click="activeIndex = index"
      >
        <img :src="image" alt="" width="72" height="72" loading="lazy" >
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.gallery__stage {
  display: flex;
  aspect-ratio: 4 / 3;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.25rem;
  background: #000;
}

.gallery__stage img {
  max-height: 90%;
  max-width: 90%;
  width: auto;
  object-fit: contain;
}

.gallery__thumbs {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.gallery__thumb {
  display: flex;
  height: 4.5rem;
  width: 4.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 0.85rem;
  background: #000;
  transition: border-color 0.2s ease;
}

.gallery__thumb:hover {
  border-color: rgb(255 255 255 / 0.25);
}

.gallery__thumb--active {
  border-color: var(--iz-accent);
}

.gallery__thumb img {
  max-height: 80%;
  max-width: 80%;
  width: auto;
  object-fit: contain;
}
</style>
