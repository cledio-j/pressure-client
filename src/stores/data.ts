import { defineStore } from 'pinia'
import type { GetParams, Reading, ReadingApiResponse } from '~/types/api'
import { binaryInsert, binarySearch } from '~/utils/array'

function deDupe<T extends { id: any }>(arr: T[]) {
  // filter out duplicates, which might happen due to weird caching/sorting/fetch interactions
  console.error('de-duping')
  const ids = new Set<any>()
  const result: T[] = []
  arr.forEach((i) => {
    if (!ids.has(i.id)) {
      result.push(i)
      ids.add(i.id)
    }
  })
  return result
}

export const useDataStore = defineStore('data', () => {
  const data = ref<Reading[]>([])
  const totalPages = ref(1)
  const totalItems = ref(0)
  const showLatest = ref(10)
  const params: GetParams = reactive({
    from_date: new Date().toISOString(),
    to_date: new Date().toISOString(),
    page: 1,
    per_page: 50,
    order: 'desc',
    sort_by: 'timestamp',
  })
  const hasAllData = computed(() => totalItems.value === data.value.length)
  const latest = computed(() => {
    return data.value.toSorted((a, b) => {
      return new Date(`${a.date}T${a.time}`) > new Date(`${b.date}T${b.time}`) ? -1 : 1
    }).slice(0, showLatest.value)
  })
  function updateParams(updated: GetParams) {
    for (const [k, v] of Object.entries(updated))
      // @ts-expect-error key weirdness
      params[k] = v
  }
  function updateData(updated: ReadingApiResponse, refreshParams = false) {
    updated.data.forEach(e => e.timestamp = e.timestamp.slice(0, -3))
    data.value = data.value.concat(updated.data)
    totalPages.value = updated.meta.total_pages
    totalItems.value = updated.meta.total
    if (refreshParams)
      updateParams(updated.params)
  }
  function removeDuplicates() {
    if (data.value.length > totalItems.value)
      data.value = deDupe(data.value)
  }
  function replaceReading(reading: Reading) {
    const idx = data.value.findIndex(e => e.id === reading.id)
    Object.assign(data.value[idx], reading)
  }
  function insertReading(reading: Reading) {
    // in most situations we insert near the beginning of the array, so the binary insertion
    // is kind of pointless. But, this is much more reliably fast for the rare cases when we insert
    // at the middle/end
    const gt = (a: Reading, b: Reading) => {
      let result: boolean
      if (params.sort_by === 'timestamp')
        result = new Date(a.timestamp) >= new Date(b.timestamp)
      else
        result = a[params.sort_by]! >= b[params.sort_by]!
      if (params.order !== 'desc')
        result = !result
      return result
    }
    const idx = binaryInsert<Reading>(data.value, reading, gt) || 0
    data.value.splice(idx, 0, reading)
  }
  function findIndex(reading: Reading) {
    const getter = (a: Reading) => {
      if (params.sort_by === 'timestamp')
        return new Date(a.timestamp)
      else
        return a[params.sort_by]
    }
    return binarySearch(data.value, reading, getter)
  }
  return {
    data,
    params,
    updateData,
    totalPages,
    totalAvail: totalItems,
    showLatest,
    latest,
    hasAllData,
    removeDuplicates,
    replaceReading,
    insertReading,
    findIndex,
  }
})
