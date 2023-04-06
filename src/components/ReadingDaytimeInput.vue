<script setup lang="ts">
const props = defineProps<{ modelValue: string; frozen?: boolean }>()
const emits = defineEmits<{
  (e: 'update:modelValue', neVal: number): void
}>()
</script>

<template>
  <div class="mb-2 grid grid-cols-3 justify-items-center gap-2">
    <label
      for="inputDT"
      class="text-md justify-self-end p-2 font-medium text-gray-900"
    >{{ $t("daytime.daytime") }}</label>
    <select
      id="inputDT"
      :disabled="frozen"
      class="col-span-2 col-start-2 w-full justify-self-start rounded-lg border border-gray-300 bg-gray-50 p-1 lg:col-span-1"
      required
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
      <option disabled>
        {{ $t("messages.select_daytime") }}
      </option>
      <option value="morning">
        {{ $t("daytime.morning") }}
      </option>
      <option value="lunch">
        {{ $t("daytime.lunch") }}
      </option>
      <option value="evening">
        {{ $t("daytime.evening") }}
      </option>
      <option value="other">
        {{ $t("daytime.other") }}
      </option>
    </select>
  </div>
</template>
