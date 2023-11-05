<script setup lang="ts">
defineProps<{
  modelValue: string
  type: 'date' | 'datetime-local'
  label?: string
  frozen?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', neVal: number): void
}>()
</script>

<template>
  <div class="flex flex-row gap-2">
    <label
      v-if="label"
      class="justify-start p-2 text-sm text-tx"
      for="dateInput"
    >{{ label }}</label>
    <input
      id="dateInput"
      :disabled="frozen"
      :type="type"
      class="col-span-3 justify-self-start border border-gray-300 rounded-lg bg-gray-50 p-1"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
