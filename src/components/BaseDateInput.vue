<script setup lang="ts">
defineProps<{
  modelValue: string
  type: 'date' | 'datetime-local'
  label: string
  frozen?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', neVal: number): void
}>()
</script>

<template>
  <div class="mb-2 flex flex-row gap-2">
    <label
      v-if="label"
      class="text-md justify-start p-2 font-medium text-gray-900"
      for="dateInput"
    >{{ label }}</label>
    <input
      id="dateInput"
      :disabled="frozen"
      :type="type"
      class="justify-self-start border border-gray-300 rounded-lg bg-gray-50 p-1"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
