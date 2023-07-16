<script setup lang="ts">
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import { type FetchError } from '~/composables/fetch'
import { useDataStore } from '~/stores/data'
import type { ModifyReadingResponse, Reading, ReadingApiResponse } from '~/types/api'

const dataStore = useDataStore()
const isFecthing = ref(false)
const errors = ref<FetchError[]>([])

async function backgroundFetch(resource: string, length: number, start: number, per_page: number) {
  const pageNums = Array.from({ length: length - 1 }, (x, i) => i + start)
  const urls = pageNums.map(p => `${resource}?page=${p}&per_page=${per_page}`)

  const { fetchErrors, asyncError } = await usePaginatedFetch<ReadingApiResponse>(urls,
    { auth: true, method: 'GET' }, dataStore.updateData,
  )
  if (fetchErrors.value)
    fetchErrors.value.forEach(e => errors.value.push(e))
  if (asyncError.value)
    errors.value.push(asyncError.value)
  dataStore.removeDuplicates()
}

async function getData() {
  isFecthing.value = true
  const { data, error } = await useFetch<ReadingApiResponse>('readings/get' + `?per_page=${50}`,
    { auth: true, method: 'GET', immediate: true },
  )
  if (error.value) {
    errors.value.push(error.value)
    return
  }

  const res = await data.value
  isFecthing.value = false
  if (res)
    dataStore.updateData(res, true)

  backgroundFetch('readings/get', dataStore.totalPages, 2, 50)
}

async function patchReading(reading: Reading) {
  const { data, error } = await useFetch<ModifyReadingResponse>(
    `reading/modify?id=${reading.id}`,
    { auth: true, method: 'POST', immediate: true, body: JSON.stringify(reading) },
  )
  if (error.value) {
    errors.value.push(error.value)
    return
  }
  const result = await data.value
  if (result && result.success)
    dataStore.replaceReading(result.reading)
}

onMounted(
  () => {
    if (dataStore.data.length <= 0)
      getData().then()
  })
</script>

<template>
  <div
    v-if="dataStore.latest.length > 0"
    class="relative grid grid-cols-1 max-w-lg transition-all"
  >
    <LatestEntriesDisplay
      :items="dataStore.latest"
      @reading-changed="patchReading"
    />
  </div>
  <div v-else class="grid grid-cols-1 items-center">
    <BaseLoadingSpinner />
  </div>
</template>
