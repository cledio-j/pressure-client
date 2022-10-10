<script setup lang="ts">
import { computed } from "vue";
import { findReading } from "../utils/tableFuncs";
import { decideColor } from "../utils/tableFuncs";
import TablePagination from "./TablePagination.vue";

import { dataStore } from "../store";

const props = defineProps<{
  tableData: TableDataObj;
}>();

const vals = ["systolic_bp", "diastolic_bp", "heart_rate"];

const dates = computed(() => {
  let arr: string[] = [];
  dataStore.data.forEach((e) => {
    let str = e.timestamp ? e.timestamp.substring(0, 10) : "void";
    if (!arr.includes(str)) arr.push(str);
  });
  return arr;
});

const rows = computed(() => {
  let rowsArr: { date: string; morning: number[]; lunch: number[]; evening: number[] }[] = [];
  dates.value.forEach((e) => {
    rowsArr.push({
      date: e,
      morning: dataStore.findReadingByDateDayTime(e, "morning"),
      lunch: dataStore.findReadingByDateDayTime(e, "lunch"),
      evening: dataStore.findReadingByDateDayTime(e, "evening"),
    });
  });
  return rowsArr;
});
</script>
<template>
  <table class="border-collapse">
    <thead>
      <tr>
        <th
          scope="col"
          class="border-2 border-t-0 border-l-0 border-b-2 border-gray-500"
        ></th>
        <th
          v-for="item in ['morning', 'lunch', 'evening']"
          colspan="3"
          class="border-2 border-t-0 border-gray-500"
          scope="col"
        >
          {{ $t("daytime." + item) }}
        </th>
      </tr>
      <tr>
        <th
          class="px-1 border-2 border-b-2 border-b-gray-500 border-gray-500 border-t-2"
          scope="col"
        >
          {{ $t("header.date") }}
        </th>
        <template v-for="i in 3">
          <th
            v-for="(item, index) in ['systolic_bp', 'diastolic_bp', 'heart_rate']"
            class="px-1 border border-b-2 border-b-gray-500 border-t-0 border-gray-400"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            scope="col"
          >
            {{ $t("header." + item) }}
          </th></template
        >
      </tr>
    </thead>
    <tbody>
      <template v-for="item in rows"
        ><tr class="hover:bg-gray-200">
          <td class="border border-l-0 border-r-2 border-r-gray-500 border-gray-400">
            {{ $d(new Date(item.date), "short") }}
          </td>
          <td
            v-for="(x, index) in item.morning"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: tableData.color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
          <td
            v-for="(x, index) in item.lunch"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: tableData.color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x }}
          </td>
          <td
            v-for="(x, index) in item.evening"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: tableData.color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
        </tr></template
      >
    </tbody>
  </table>
  <TablePagination
    :current-page="tableData.currentPage"
    :total-pages="tableData.totalPages"
    :getter="tableData.getter"
  ></TablePagination>
</template>
<style scoped>
td {
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
</style>
