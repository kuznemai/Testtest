<script setup lang="ts">
import type { TrackingEvent } from "#shared/types";
import { formatDateTime } from "~/utils/format";

const props = defineProps<{ events: TrackingEvent[] }>();

/** The furthest completed step is the "current" one for highlighting. */
const currentIndex = computed(() => {
  const done = props.events.map((event) => event.done);
  return done.lastIndexOf(true);
});
</script>

<template>
  <ol class="timeline">
    <li
      v-for="(event, index) in events"
      :key="event.status + index"
      class="timeline__item"
      :class="{
        'timeline__item--done': event.done && index !== currentIndex,
        'timeline__item--current': index === currentIndex,
      }"
    >
      <span class="timeline__marker" aria-hidden="true">
        <svg v-if="event.done" viewBox="0 0 24 24" fill="none">
          <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <div class="timeline__body">
        <p class="timeline__title">{{ event.title }}</p>
        <p class="timeline__description">{{ event.description }}</p>
        <p class="timeline__time">{{ event.at ? formatDateTime(event.at) : "Pending" }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline__item {
  position: relative;
  display: flex;
  gap: 1rem;
  padding-bottom: 1.6rem;
  color: #7e93a9;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

/* Connector between markers. */
.timeline__item:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 2rem;
  bottom: 0.25rem;
  left: 0.94rem;
  width: 1px;
  background: var(--iz-border);
}

.timeline__item--done::before,
.timeline__item--current::before {
  background: rgb(143 192 238 / 0.45);
}

.timeline__marker {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--iz-border);
  border-radius: 999px;
  background: var(--iz-bg);
  color: transparent;
}

.timeline__marker svg {
  width: 1rem;
  height: 1rem;
}

.timeline__item--done .timeline__marker {
  border-color: rgb(110 231 183 / 0.5);
  color: #6ee7b7;
}

.timeline__item--current .timeline__marker {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.15);
  color: var(--iz-accent);
}

.timeline__title {
  color: #e7eef6;
  font-size: 0.95rem;
  font-weight: 500;
}

.timeline__item--current .timeline__title {
  color: #fff;
}

.timeline__description {
  margin-top: 0.2rem;
  font-size: 0.85rem;
  font-weight: 300;
  line-height: 1.5;
}

.timeline__time {
  margin-top: 0.35rem;
  color: #5f7288;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}
</style>
