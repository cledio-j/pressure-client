<script setup lang="ts">
import type { Reading } from 'api'
import { useDataStore } from '~/stores/data'
import type { Filter, TableView } from '~/types'
import { VAL_KEYS } from '~/const'

const dataStore = useDataStore()
const { settings } = useSettings()
const noFilter = (d: Reading[]) => d

const filterFn = ref<((data: Reading[]) => Reading[])>(noFilter)

const filteredData = computed(() => {
  return filterFn.value(dataStore.data)
})

const dayMap = computed<Map<string, DayReadings>>(() => {
  // I'm not entirely sure what caching magic Vue does here, but this is much faster than
  // anything else I've tried
  const newMap = new Map()

  filteredData.value.forEach((r) => {
    const d = r.timestamp.slice(0, 10)
    if (!newMap.has(d)) {
      newMap.set(d, {
        morning: new Set(),
        lunch: new Set(),
        evening: new Set(),
        other: new Set(),
      })
    }
    const v = newMap.get(d)
    v![r.day_time as keyof DayReadings].add(r)
  })
  return newMap
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

onMounted(() => {
  perPage.value = settings.table.perPage
  colored.value = settings.table.color
  view.value = settings.table.defaultView
})

const showModify = ref(false)
const expandedReading = ref<Reading>()

function handleExpand(r?: Reading) {
  if (!r)
    return
  expandedReading.value = r
  showModify.value = true
}
</script>

<template>
  <article class="max-w-100svw">
    <header
      class="flex flex-row items-center justify-between from-white to-back-light bg-gradient-to-b pb-0.5 shadow-primary-light shadow-sm"
    >
      <h1 class="mx-1 pb-1 font-bold text-tx">
        {{ $t('settings.table') }}
      </h1>
      <button
        class="border rounded-full bg-white p-2.5" :class="{ 'text-primary border-2 border-primary': showFilter }"
        @click="showFilter = !showFilter"
      >
        <div class="i-ms-filter-alt-outline scale-150" />
      </button>

      <TheTableTools
        v-model:paint="colored"
        v-model:table-view="view"
      />
    </header>
    <div>
      <TheTableFilter v-if="showFilter" @apply-filter="applyFilter" />
    </div>
    <div class="flex flex-col items-center">
      <DataTableEntries
        v-if="view === 'entries'"
        :headers="settings.table.headers"
        :readings="filteredData"
        :first-row="firstRow"
        :last-row="lastRow"
        :colored="colored"
        @expand-reading="handleExpand"
      />
      <DataTableComplex
        v-else :type="view" :days="days" :colored="colored"
        @expand-reading="handleExpand"
      />
      <DataPaginator
        v-model:per-page="perPage"
        v-model:page="page"
        class="max-w-2xl w-full md:min-w-50svw"
        :total-items="!approx ? filteredData.length : dayMap.size"
        :approx="approx"
      />
    </div>
    <BaseDialog
      :title="new Date(expandedReading?.timestamp || '').toLocaleString()" size="large" :open="showModify"
      @close-dialog="showModify = false, expandedReading = undefined"
      @confirm-dialog="showModify = false, expandedReading = undefined"
    >
      <ReadingModifyCard
        v-if="expandedReading"
        :reading="expandedReading" @close="showModify = false, expandedReading = undefined"
      />
    </BaseDialog>
  </article>
</template>
