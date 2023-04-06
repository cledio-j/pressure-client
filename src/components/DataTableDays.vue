<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { decideColor } from '../utils/tableFuncs'

import { useDataStore } from '../store'
import TablePaginationClient from './TablePaginationClient.vue'

const props = defineProps<{
  color: boolean
}>()

const emits = defineEmits<{
  (e: 'moreData'): void
}>()

const dataStore = useDataStore()

const vals = ['systolic_bp', 'diastolic_bp', 'heart_rate']
const firstRow = ref(0)
const tableData = reactive({
  currentPage: 1,
  perPage: 15,
})

const rows = computed(() => {
  const rowsArr = dataStore.dates
    .slice(firstRow.value, firstRow.value + tableData.perPage)
    .map((d) => {
      return {
        date: d,
        morning: dataStore.findReadingByDateDayTime(d, 'morning'),
        lunch: dataStore.findReadingByDateDayTime(d, 'lunch'),
        evening: dataStore.findReadingByDateDayTime(d, 'evening'),
      }
    })
  return rowsArr
})

watch(firstRow, (newVal) => {
  if (
    newVal > rows.value.length - tableData.perPage
    && dataStore.data.length < dataStore.totalAvailable
  )
    emits('moreData')
})
</script>

<template>
  <table class="border-collapse">
    <thead>
      <tr>
        <th
          scope="col"
          class="border-2 border-t-0 border-l-0 border-b-2 border-gray-500"
        />
        <th
          v-for="item in ['morning', 'lunch', 'evening']"
          :key="item"
          colspan="3"
          class="border-2 border-t-0 border-gray-500 font-semibold text-rose-800"
          scope="col"
        >
          {{ $t(`daytime.${item}`) }}
        </th>
      </tr>
      <tr>
        <th
          class="border-2 border-b-2 border-t-2 border-gray-500 border-b-gray-500 px-1 font-semibold text-gray-900"
          scope="col"
        >
          {{ $t("header.date") }}
        </th>
        <template v-for="i in 3" :key="i">
          <th
            v-for="(item, index) in ['systolic_bp', 'diastolic_bp', 'heart_rate']"
            :key="item"
            class="border border-b-2 border-t-0 border-gray-400 border-b-gray-500 px-1 font-semibold text-gray-900"
            :class="{ 'border-r-2 border-r-gray-500': index === 2 }"
            scope="col"
          >
            {{ $t(`header.${item}`) }}
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in rows" :key="item.date">
        <tr class="hover:bg-gray-200">
          <td class="border border-r-2 border-gray-400 border-r-gray-500">
            {{ $d(new Date(item.date), "short") }}
          </td>
          <td
            v-for="(x, index) in item.morning"
            :key="index"
            :class="{ 'border-r-2 border-r-gray-500': index === 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
          <td
            v-for="(x, index) in item.lunch"
            :key="index"
            :class="{ 'border-r-2 border-r-gray-500': index === 2 }"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x }}
          </td>
          <td
            v-for="(x, index) in item.evening"
            :key="index"
            class="border border-t-0 border-gray-400"
            :style="{
              backgroundColor: color ? decideColor(vals[index], x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <TablePaginationClient
    v-model:current-page="tableData.currentPage"
    v-model:per-page="tableData.perPage"
    v-model:first-row="firstRow"
    :real-total="Math.round(dataStore.totalAvailable / 3)"
    :total-rows="rows.length"
    :approx="true"
  />
</template>

<style scoped>
td {
  transition-property: all;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}
</style>
