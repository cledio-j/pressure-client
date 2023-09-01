<script setup lang="ts">
import type { Reading } from 'api'
import { useDataStore } from '~/stores/data'
import type { Filter, TableView } from '~/types'
import { VAL_KEYS } from '~/const'

const dataStore = useDataStore()
const { settings } = useSettings()
const noFilter = (d: Reading[]) => d

const filterFn = ref<((data: Reading[]) => Reading[])>(noFilter)

const dayMap = ref(new Map<string, DayReadings>())
const filteredData = computed(() => {
  return filterFn.value(dataStore.data)
})

watch([() => dataStore.hasAllData, () => filteredData.value], () => {
  if (!dataStore.hasAllData)
    // since this can be time consuming it should only happen once all data is in
    return
  makeDayMap(filteredData.value)
})

watchOnce(() => dataStore.ready, () => {
  // this makes sure the first page is available immediately
  makeDayMap(filteredData.value)
})

const page = ref(1)
const perPage = ref(20)
const colored = ref(false)
const view = ref<TableView>('entries')
const showFilter = ref(false)

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

const days = computed(() => {
  return Array.from(dayMap.value.entries()).slice(firstRow.value, lastRow.value)
})

function applyFilter(fil: Filter, defaultFilter: Filter) {
  const f = toRaw(fil)
  if (JSON.stringify(f) === JSON.stringify(toRaw(defaultFilter))) {
    filterFn.value = noFilter
    return
  }

  const filter = (data: Reading[]) => {
    const filtered = data.filter((r) => {
      // checks all conditions of the filter
      const passed: Array<boolean> = []
      for (const key of VAL_KEYS)
        passed.push(r[key] >= f[key][0] && r[key] <= f[key][1])
      passed.push(f.day_time.includes(r.day_time))
      const d = new Date(r.timestamp).getTime()
      passed.push(
        d >= new Date(f.date[0]).getTime()
        && d <= new Date(f.date[1]).getTime(),
      )
      return passed.every(Boolean)
    })
    return filtered
  }
  filterFn.value = filter
}

function makeDayMap(data: Reading[]) {
  dayMap.value.clear()

  data.forEach((r) => {
    const d = r.timestamp.slice(0, 10)
    if (!dayMap.value.has(d)) {
      dayMap.value.set(d, {
        morning: new Set(),
        lunch: new Set(),
        evening: new Set(),
        other: new Set(),
      })
    }
    const v = dayMap.value.get(d)
    v![r.day_time as keyof DayReadings].add(r)
  })

  console.error(dayMap)
}

onMounted(() => {
  perPage.value = settings.value.table.perPage
  colored.value = settings.value.table.color
  view.value = settings.value.table.defaultView
})
</script>

<template>
  <article>
    <header class="flex flex-row items-center justify-between pb-2">
      <h1 class="mx-1 pb-1 font-bold text-tx">
        {{ $t('settings.table') }}
      </h1>
      <button @click="showFilter = !showFilter">
        <div class="i-ms-filter-alt-outline scale-150" />
      </button>

      <TheTableTools
        v-model:paint="colored"
        v-model:table-view="view"
      />
    </header>
    <TheTableFilter v-if="showFilter" @apply-filter="applyFilter" />
    <DataTableEntries
      v-if="view === 'entries'"
      :headers="settings.table.headers"
      :readings="filteredData"
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
      :total-items="!approx ? filteredData.length : dayMap.size"
      :approx="approx"
    />
  </article>
</template>
