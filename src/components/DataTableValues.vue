<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { decideColor } from '../utils/tableFuncs'

import { useDataStore } from '../store'
import TablePaginationClient from './TablePaginationClient.vue'

const props = defineProps<{
  color: boolean
}>()

const emits = defineEmits<{
  (e: 'more-data'): void
}>()

const dataStore = useDataStore()

const firstRow = ref(0)
const tableData = reactive({
  currentPage: 1,
  perPage: 10,
})

const rows = computed(() => {
  const rowsArr: {
    date: string
    systolic_bp: number[]
    diastolic_bp: number[]
    heart_rate: number[]
  }[] = []
  dataStore.dates.slice(firstRow.value, firstRow.value + tableData.perPage).forEach((e) => {
    const morning = dataStore.findReadingByDateDayTime(e, 'morning')
    const lunch = dataStore.findReadingByDateDayTime(e, 'lunch')
    const evening = dataStore.findReadingByDateDayTime(e, 'evening')
    rowsArr.push({
      date: e,
      systolic_bp: [morning[0], lunch[0], evening[0]],
      diastolic_bp: [morning[1], lunch[1], evening[1]],
      heart_rate: [morning[2], lunch[2], evening[2]],
    })
  })
  return rowsArr
})
</script>

<template>
  <table class="border-collapse">
    <thead>
      <tr>
        <th
          scope="col"
          class="border-2 border-t-0 border-gray-200 border-b-gray-500 border-r-gray-500 px-1"
        />
        <th
          v-for="item in ['systolic_bp', 'diastolic_bp', 'heart_rate']"
          :key="item"
          colspan="3"
          scope="col"
          class="border-2 border-t-0 border-gray-500 border-b-gray-500 px-1"
        >
          {{ $t(`header.${item}`) }}
        </th>
      </tr>
      <tr>
        <th
          class="border border-b-2 border-r-2 border-t-0 border-b-gray-500 border-r-gray-500 px-1"
          scope="col"
        >
          {{ $t("header.date") }}
        </th>
        <template v-for="i in 3" :key="i">
          <th
            v-for="item in ['morning', 'lunch', 'evening']"
            :key="item"
            :class="{ 'border-r-2 border-r-gray-500': item === 'evening' }"
            class="border border-b-2 border-b-gray-500 px-1"
            scope="col"
          >
            {{ $t(`daytime.${item}`) }}
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in rows.slice(firstRow, firstRow + tableData.perPage)" :key="item.date">
        <tr>
          <td class="border border-gray-400">
            {{ $d(new Date(item.date), "short") }}
          </td>
          <td
            v-for="(x, index) in item.systolic_bp"
            :key="index"
            :class="{ 'border-r-2 border-r-gray-500': index === 2 }"
            class="border border-gray-400"
            :style="{
              backgroundColor: color ? decideColor('systolic_bp', x) : '',
            }"
          >
            {{ x ? x : "" }}
          </td>
          <td
            v-for="(x, index) in item.diastolic_bp"
            :key="index"
            :class="{ 'border-r-2 border-r-gray-500': index === 2 }"
            class="border border-gray-400"
            :style="{
              backgroundColor: color ? decideColor('diastolic_bp', x) : '',
            }"
          >
            {{ x }}
          </td>
          <td
            v-for="(x, index) in item.heart_rate"
            :key="index"
            class="border border-t-0 border-gray-400"
          >
            {{ x }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <TablePaginationClient
    v-model:current-page="tableData.currentPage"
    v-model:per-page="tableData.perPage"
    v-model:first-row="firstRow"
    :real-total="30 * dataStore.totalPages"
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
