<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  frozen?: boolean
}>()

const emits = defineEmits<{
  (e: 'interface', fn: () => void): void
  (e: 'update:modelValue', neVal: number): void
}>()
</script>

<template>
  <div class="mb-2 grid grid-cols-3 justify-items-center gap-2">
    <label
      class="text-md justify-self-end p-2 font-medium text-gray-900"
      for="dateInput"
    >{{ $t("header.timestamp") }}</label>
    <input
      id="dateInput"
      :disabled="frozen"
      type="datetime-local"
      class="w-30 col-span-2 col-start-2 justify-self-start rounded-lg border border-gray-300 bg-gray-50 p-1"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
