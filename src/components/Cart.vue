<script setup>
import { useProductStore } from "../store.js";

const cartStore = useProductStore();
</script>

<template>
  <li
      class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-slate-200 transition"
  >
    <img src="/cart.svg" alt="Cart" />
    <span>{{ cartStore.getTheTotalPrice() }} $</span>
  </li>
</template>

<style scoped></style>