<script setup lang="ts">
/**
 * Label + control + error wiring. Every form in the app has ~8 of these, so the
 * a11y plumbing (`for`, `aria-invalid`, `aria-describedby`) lives in one place.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    id: string;
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    inputmode?: "text" | "email" | "tel" | "numeric";
  }>(),
  { type: "text", autocomplete: undefined, placeholder: "", error: "", required: false, inputmode: undefined },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const errorId = computed(() => `${props.id}-error`);
</script>

<template>
  <div>
    <label class="iz-label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="iz-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" :id="errorId" class="iz-error">{{ error }}</p>
  </div>
</template>
