<script setup lang="ts">
import { computed } from "vue";
import { findReading } from "../utils/tableFuncs";
import { decideColor } from "../utils/tableFuncs";

import { dataStore } from "../store";

const props = defineProps<{
  tableData: TableDataObj;
}>();

const dates = computed(() => {
  let arr: string[] = [];
  dataStore.data.forEach((e) => {
    let str = e.timestamp ? e.timestamp.substring(0, 10) : "void";
    if (!arr.includes(str)) arr.push(str);
  });
  return arr;
});

const rows = computed(() => {
  let rowsArr: {
    date: string;
    systolic_bp: number[];
    diastolic_bp: number[];
    heart_rate: number[];
  }[] = [];
  dates.value.forEach((e) => {
    let morning = dataStore.findReadingByDateDayTime(e, "morning");
    let lunch = dataStore.findReadingByDateDayTime(e, "lunch");
    let evening = dataStore.findReadingByDateDayTime(e, "evening");
    rowsArr.push({
      date: e,
      systolic_bp: [morning[0], lunch[0], evening[0]],
      diastolic_bp: [morning[1], lunch[1], evening[1]],
      heart_rate: [morning[2], lunch[2], evening[2]],
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
          class="px-1 border-2 border-gray-200 border-b-gray-500 border-r-gray-500 border-t-0"
        ></th>
        <th
          v-for="item in ['systolic_bp', 'diastolic_bp', 'heart_rate']"
          colspan="3"
          scope="col"
          class="px-1 border-2 border-gray-500 border-b-gray-500 border-t-0"
        >
          {{ $t("header." + item) }}
        </th>
      </tr>
      <tr>
        <th
          class="px-1 border border-b-2 border-r-2 border-b-gray-500 border-r-gray-500 border-t-0"
          scope="col"
        >
          {{ $t("header.date") }}
        </th>
        <template v-for="i in 3">
          <th
            v-for="item in ['morning', 'lunch', 'evening']"
            :class="{ 'border-r-2 border-r-gray-500': item == 'evening' }"
            class="px-1 border border-b-2 border-b-gray-500"
            scope="col"
          >
            {{ $t("daytime." + item) }}
          </th></template
        >
      </tr>
    </thead>
    <tbody>
      <template v-for="item in rows"
        ><tr>
          <td class="border border-gray-400">{{ $d(new Date(item.date), "short") }}</td>
          <td
            v-for="(x, index) in item.systolic_bp"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-gray-400"
            :style="{
              backgroundColor: tableData.color ? decideColor('systolic_bp', x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
          <td
            v-for="(x, index) in item.diastolic_bp"
            :class="{ 'border-r-2 border-r-gray-500': index == 2 }"
            class="border border-gray-400"
            :style="{
              backgroundColor: tableData.color ? decideColor('diastolic_bp', x) : '',
            }"
          >
            {{ x }}
          </td>
          <td
            v-for="(x, index) in item.heart_rate"
            class="border border-t-0 border-gray-400"
          >
            {{ x }}
          </td>
        </tr></template
      >
    </tbody>
  </table>
</template>
<style scoped>
td {
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
</style>
