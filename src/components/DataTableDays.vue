<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { decideColor } from "../utils/tableFuncs";

import { dataStore } from "../store";
import TablePaginationClient from "./TablePaginationClient.vue";

const props = defineProps<{
  color: boolean;
}>();

const emits = defineEmits<{
  (e: "more-data"): void;
}>();

const vals = ["systolic_bp", "diastolic_bp", "heart_rate"];
const firstRow = ref(0);
const tableData = reactive({
  currentPage: 1,
  perPage: 10,
});

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

watch(firstRow, (newVal) => {
  if (newVal > rows.value.length - tableData.perPage && dataStore.data.length < dataStore.total) {
    emits("more-data");
  }
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
          class="border-2 border-b-2 border-t-2 border-gray-500 border-b-gray-500 px-1"
          scope="col"
        >
          {{ $t("header.date") }}
        </th>
        <template v-for="i in 3">
          <th
            v-for="(item, index) in ['systolic_bp', 'diastolic_bp', 'heart_rate']"
            class="border border-b-2 border-t-0 border-gray-400 border-b-gray-500 px-1"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            scope="col"
          >
            {{ $t("header." + item) }}
          </th></template
        >
      </tr>
    </thead>
    <tbody>
      <template v-for="item in rows.slice(firstRow, firstRow + tableData.perPage)"
        ><tr class="hover:bg-gray-200">
          <td class="border border-l-0 border-r-2 border-gray-400 border-r-gray-500">
            {{ $d(new Date(item.date), "short") }}
          </td>
          <td
            v-for="(x, index) in item.morning"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
          <td
            v-for="(x, index) in item.lunch"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x }}
          </td>
          <td
            v-for="(x, index) in item.evening"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
        </tr></template
      >
    </tbody>
  </table>
  <TablePaginationClient
    v-model:current-page="tableData.currentPage"
    :real-total="30 * dataStore.totalPages"
    v-model:per-page="tableData.perPage"
    :total-rows="rows.length"
    v-model:first-row="firstRow"
    :approx="true"
  ></TablePaginationClient>
</template>
<style scoped>
td {
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
</style>
