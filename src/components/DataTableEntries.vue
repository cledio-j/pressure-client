<script setup lang="ts">
import type { Reading } from 'api'

const props = defineProps<{
  readings: Reading[]
}>()

const tableState = reactive({
  currentPage: 1,
  perPage: 15,
  sortBy: 'timestamp',
  order: 'desc',
  firstRow: 0,
})

const lastRow = computed(() => {
  return tableState.firstRow + tableState.perPage
})

interface Header {
  name: keyof Reading
  show: boolean
}

const headers = ref<Header[]>([])

function getHeaders() {
  return [
    { name: 'date', show: true },
    { name: 'time', show: true },
    { name: 'timestamp', show: false },
    { name: 'systolic_bp', show: true },
    { name: 'diastolic_bp', show: true },
    { name: 'heart_rate', show: true },
    { name: 'day_time', show: true },
    { name: 'user_id', show: false },
    { name: 'id', show: false },
    { name: 'weather', show: false },
  ]
}

onMounted(() => {
  headers.value = getHeaders()
})
</script>

<template>
  <div class="max-h-screen">
    <table class="w-full border-collapse">
      <thead>
        <template v-for="header in headers" :key="header">
          <th v-if="header.show">
            {{ $t(`header.${header.name}`) }}
          </th>
        </template>
      </thead>
      <tbody>
        <tr
          v-for="reading in readings.slice(tableState.firstRow, lastRow)" :key="reading.id"
          class="cursor-pointer" hover="bg-back-light"
        >
          <td
            v-for="header in headers.filter(h => h.show)" :key="header.name"
          >
            {{ reading[header.name] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
