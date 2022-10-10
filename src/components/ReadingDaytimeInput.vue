<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{
  (e: "update:modelValue", neVal: number): void;
}>();
</script>
<template>
  <div class="grid grid-cols-3 mb-2 gap-2 justify-items-center">
    <label
      for="inputDT"
      class="text-md font-medium text-gray-900 p-2 justify-self-end"
      >{{ $t("daytime.daytime") }}</label
    >
    <select
      id="inputDT"
      class="p-1 border border-gray-300 rounded-lg bg-gray-50 w-full justify-self-start col-start-2 col-span-2 lg:col-span-1"
      required
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
      <option disabled>
        {{ $t("messages.select_daytime") }}
      </option>
      <option value="morning">{{ $t("daytime.morning") }}</option>
      <option value="lunch">{{ $t("daytime.lunch") }}</option>
      <option value="evening">{{ $t("daytime.evening") }}</option>
      <option value="other">{{ $t("daytime.other") }}</option>
    </select>
  </div>
</template>
