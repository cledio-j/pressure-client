<script setup lang="ts">
import { computed } from "vue";
import { dataStore } from "../store";
import BaseIconButton from "./BaseIconButton.vue";

const props = defineProps<{ index: number; item: Reading; compareTo: "dayBefore" | "last" }>();
let comparison: number;

function getComparison(index: number, item: Reading, val: ReadingValStr) {
  let previous;
  if (props.compareTo == "dayBefore") {
    for (let i = index + 1; i >= 0; i++) {
      if (dataStore.data[i].day_time == item.day_time) {
        previous = dataStore.data[i];
        break;
      }
    }
  } else {
    previous = dataStore.data[index + 1];
  }
  if (!previous) return 0;
  return item[val] - previous[val];
}
</script>
<template>
  <div
    class="mb-2 ml-2 bg-gradient-to-br from-white to-rose-50 px-12 shadow-md shadow-gray-400 md:row-span-1 md:row-start-2 md:px-0"
  >
    <h3 class="ml-1 border-b border-dashed border-b-gray-400 font-semibold text-rose-900">
      {{ $t("messages.values") }}
    </h3>
    <table class="z-50 ml-2 border-collapse">
      <tbody>
        <tr
          v-for="val in (['systolic_bp', 'diastolic_bp', 'heart_rate'] as ReadingValStr[])"
          class="h-8 w-full p-0"
          :class="{ 'border-b border-gray-400': val != 'heart_rate' }"
          :set="(comparison = getComparison(index, item, val))"
        >
          <td class="w-24">{{ $t("header." + val) + ": " }}</td>
          <td class="w-24">{{ item[val] }}</td>
          <td class="grid h-8 w-16 grid-cols-2 place-items-center">
            <span class="p-0 pb-3">{{ comparison > 0 ? "+" + comparison : comparison }}</span
            ><BaseIconButton
              icon="south"
              class="mb-2 h-8 -translate-y-0.5 scale-[0.35] cursor-default"
              :class="{ 'rotate-180': comparison > 0 }"
              :color="comparison >= 0 ? 'fill-red-500' : 'fill-green-500'"
              label="disabled"
            ></BaseIconButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
