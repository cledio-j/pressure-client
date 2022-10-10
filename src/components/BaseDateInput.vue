<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emits = defineEmits<{
  (e: "interface", fn: () => void): void;
  (e: "update:modelValue", neVal: number): void;
}>();
</script>
<template>
  <div class="grid grid-cols-3 mb-2 gap-2 justify-items-center">
    <label
      class="text-md font-medium text-gray-900 p-2 justify-self-end"
      for="dateInput"
      >{{ $t("header.timestamp") }}</label
    >
    <input
      id="dateInput"
      type="datetime-local"
      class="p-1 border border-gray-300 rounded-lg bg-gray-50 w-30 col-span-2 justify-self-start col-start-2"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
