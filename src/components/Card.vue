<script setup>
import { defineProps } from "vue";

import Buttons from "./Buttons.vue";
import { useProductStore } from "../store.js";

const props = defineProps({
  item: Object,
  isFavorite: Boolean,
});
console.log(props.item);

// const emit = defineEmits(["addToFavorite"]);

const productStore = useProductStore();
</script>

<template>
  <div
      class="flex flex-col justify-between max-w-[260px] relative bg-black border border-slate-100 rounded-3xl p-4 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition text-gray-200"
  >
    <!-- Иконка лайка -->
    <svg
        @click="productStore.addToFavorite(item)"
        class="absolute top-4 left-4 w-10 cursor-pointer transition transform hover:scale-110"
        viewBox="0 0 34 34"
        xmlns="http://www.w3.org/2000/svg"
        :fill="isFavorite ? 'white' : 'none'"
        :stroke="'white'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"
      />
    </svg>

    <img :src="item.imageUrl" class="w-20 mx-auto my-5 py-2" alt="Product" />
    <p class="mt-2">{{ item.title }}</p>

    <div class="flex flex-row justify-between">
      <div class="flex flex-col mt-2">
        <span class="text-slate-400">Price:</span>
        <b class="price">{{ item.price }} $</b>
      </div>

      <div>
        <div v-if="productStore.getCount(item.id) > 0">
          <div
              class="flex items-center space-x-3 border-solid border-2 border-gray-200 rounded-lg mr-8"
          >
            <Buttons :id="item.id" />
          </div>
        </div>
        <button
            v-else
            type="button"
            @click="productStore.addProductToCart(item.id)"
            class="button_addtocart"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>