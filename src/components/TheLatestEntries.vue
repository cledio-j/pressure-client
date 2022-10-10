<script setup lang="ts">
import { Ref, ref } from "vue";
import { dataStore } from "../store";
import BaseIconButton from "./BaseIconButton.vue";

const compareTo: Ref<"dayBefore" | "last"> = ref("dayBefore");
// const comparison: Ref<number> = ref(0);
let comparison: number;

function getComparison(index: number, item: Reading, val: ReadingValStr) {
  let previous;
  if (compareTo.value == "dayBefore") {
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
    v-if="dataStore.data.length > 0"
    class="grid grid-cols-1"
  >
    <button
      class="absolute top-0 left-0 border-2 border-red-700"
      @click="compareTo == 'last' ? (compareTo = 'dayBefore') : (compareTo = 'last')"
    >
      {{ compareTo == "last" ? "Letztem" : "Gestern" }}
    </button>
    <template v-for="(item, index) in dataStore.data.slice(0, 6)">
      <div
        class="my-1 grid h-44 grid-cols-1 grid-rows-4 rounded-xl bg-gradient-to-b from-slate-200 via-pink-50 to-rose-100 shadow-md shadow-rose-200 md:grid-cols-3"
      >
        <h2
          class="col-span-3 mb-1 w-full place-self-center justify-self-center border-b border-dashed border-b-rose-400 text-center text-lg font-semibold text-rose-900"
        >
          {{ $d(item.timestamp, "long") + " - " + $t("daytime." + item.day_time) }}
        </h2>
        <div
          class="col-start-1 row-span-3 row-start-2 mb-2 ml-2 bg-slate-50 shadow-sm shadow-gray-300"
        >
          <h3 class="border-b border-dashed border-b-gray-400 font-semibold text-rose-900">
            {{ $t("messages.values") }}
          </h3>
          <table class="border-collapse">
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
                    class="mb-2 h-8 -translate-y-0.5 scale-[0.35]"
                    :class="{ 'rotate-180': comparison > 0 }"
                    :color="comparison >= 0 ? 'fill-red-500' : 'fill-green-500'"
                  ></BaseIconButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div></div
    ></template>
  </div>
</template>
