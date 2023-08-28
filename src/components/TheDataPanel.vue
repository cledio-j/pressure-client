<script setup lang="ts">
import type { Reading } from 'api'
import type { TableView } from '~/composables/settings'
import { useDataStore } from '~/stores/data'

const dataStore = useDataStore()
const { settings } = useSettings()

const page = ref(1)
const perPage = ref(20)
const colored = ref(false)
const view = ref<TableView>('entries')

const approx = computed(() => {
  return view.value !== 'entries'
})

const firstRow = computed(() => perPage.value * (page.value - 1))
const lastRow = computed(() => firstRow.value + perPage.value)

export interface DayReadings {
  morning: Set<Reading>
  lunch: Set<Reading>
  evening: Set<Reading>
  other: Set<Reading>
}

const dayMap = new Map<string, DayReadings>()

const days = computed(() => {
  return Array.from(dayMap.entries()).slice(firstRow.value, lastRow.value)
})

watchEffect(() => {
  if (!dataStore.ready)
    return
  dayMap.clear()
  dataStore.data.forEach((r) => {
    const d = r.timestamp.slice(0, 10)
    if (!dayMap.has(d)) {
      dayMap.set(d, {
        morning: new Set(),
        lunch: new Set(),
        evening: new Set(),
        other: new Set(),
      })
    }
    const v = dayMap.get(d)
    v![r.day_time as keyof DayReadings].add(r)
  })
  console.error(dayMap)
})

onMounted(() => {
  perPage.value = settings.value.table.perPage
  colored.value = settings.value.table.color
  view.value = settings.value.table.defaultView
})
</script>

<template>
  <section>
    <DataTableEntries
      v-if="view === 'entries'"
      :headers="settings.table.headers"
      :readings="dataStore.data"
      :first-row="firstRow"
      :last-row="lastRow"
      :colored="colored"
    />
    <DataTableDays
      v-else-if="view === 'days'"
      :days="days" :colored="colored"
    />
    <DataTableValues
      v-else-if="view === 'values'"
      :days="days" :colored="colored"
    />
    <DataPaginator
      v-model:per-page="perPage"
      v-model:page="page"
      :total-items="dataStore.totalAvail"
      :approx="approx"
    />
    <TheTableFooter
      v-model:paint="colored"
      v-model:table-view="view"
    />
  </section>
</template>
