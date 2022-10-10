<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import BetterInputField from "./BetterInputField.vue";
import BaseDateInput from "./BaseDateInput.vue";
import ReadingDaytimeInput from "./ReadingDaytimeInput.vue";

const props = defineProps<{
  data: Reading | ReadingInput;
  modified: boolean;
}>();

const emits = defineEmits<{
  (e: "reset", data: Reading): void;
  (e: "interface:reset", fn: () => void): void;
}>();

const inputFieldResetFns: (() => void)[] = [];

function reset() {
  inputFieldResetFns.forEach((reset) => reset());
}

onMounted(() => {
  emits("interface:reset", reset);
});
</script>
<template>
  <div
    class="ml-2 grid grid-rows-3"
    :class="{ 'border-gray-600 bg-gray-200': modified }"
  >
    <BaseDateInput v-model="data.timestamp"></BaseDateInput>
    <template v-for="str in ['systolic_bp', 'diastolic_bp', 'heart_rate']">
      <BetterInputField
        :name="$t('header.' + str)"
        v-model="data[str as ReadingValStr]"
        @interface="(fn) => inputFieldResetFns.push(fn)"
      ></BetterInputField>
    </template>
    <ReadingDaytimeInput v-model="data.day_time"></ReadingDaytimeInput>
  </div>
</template>
