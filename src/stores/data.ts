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
  const totalAvail = ref(0)
  const ready = ref(false)

  const uuidSet = ref<Set<string>>(new Set())

  const { settings } = useSettings()

  const params: GetParams = reactive({
    from_date: new Date().toISOString(),
    to_date: new Date().toISOString(),
    page: 1,
    per_page: 50,
    order: 'desc',
    sort_by: 'timestamp',
  })
  const hasAllData = computed(() => totalAvail.value <= (data.value.length + 2))
  const latest = computed(() => {
    return data.value.toSorted((a, b) => {
      return new Date(`${a.date}T${a.time}`) > new Date(`${b.date}T${b.time}`) ? -1 : 1
    }).slice(0, settings.latest.numEntries)
  })
  function updateParams(updated: GetParams) {
    for (const [k, v] of Object.entries(updated))
      // @ts-expect-error key weirdness
      params[k] = v
  }
  function updateData(updated: ReadingApiResponse, refreshParams = false) {
    updated.data.filter((r) => {
      r.timestamp = r.timestamp.slice(0, -3)
      return !uuidSet.value.has(r.uuid)
    })
    data.value = data.value.concat(updated.data)
    totalPages.value = updated.meta.total_pages
    totalAvail.value = updated.meta.total
    if (refreshParams)
      updateParams(updated.params)
  }
  function removeDuplicates() {
    if (data.value.length > totalAvail.value)
      data.value = deDupe(data.value)
  }
  function replaceReading(reading: Reading) {
    const idx = data.value.findIndex(e => e.uuid === reading.uuid)
    Object.assign(data.value[idx], reading)
  }
  function insertReading(reading: Reading) {
    if (uuidSet.value.has(reading.uuid)) {
      replaceReading(reading)
      return
    }
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
  function binFindIndex(reading: Reading) {
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
    totalAvail,
    latest,
    hasAllData,
    removeDuplicates,
    replaceReading,
    insertReading,
    binFindIndex,
    ready,
  }
})
