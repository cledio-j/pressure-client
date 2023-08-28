import type { ModifyReadingResponse, Reading, ReadingApiResponse } from 'api'
import type { FetchError } from './fetch'
import { useDataStore } from '~/stores/data'

export function useServerData() {
  const errors = ref<FetchError[]>([])
  const isFetching = ref(false)
  const dataStore = useDataStore()
  const { settings } = useSettings()

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

  async function getData() {
    dataStore.ready = false
    isFetching.value = true
    const { data, error } = await useFetch<ReadingApiResponse>(
      'readings/get' + `?per_page=${50}`,
      { auth: true, method: 'GET', immediate: true },
    )
    if (error.value) {
      errors.value.push(error.value)
      return
    }

    const res = await data.value
    isFetching.value = false
    if (res)
      dataStore.updateData(res, true)

    backgroundFetch('readings/get', dataStore.totalPages, 2, settings.value.table.perFetch)
      .then(() => dataStore.ready = true)
  }

  async function backgroundFetch(
    resource: string, length: number, start: number, per_page: number) {
    const pageNums = Array.from({ length: length - 1 }, (x, i) => i + start)
    const urls = pageNums.map(p => `${resource}?page=${p}&per_page=${per_page}`)

    isFetching.value = true
    const { fetchErrors, asyncError } = await usePaginatedFetch<ReadingApiResponse>(urls,
      { auth: true, method: 'GET' }, dataStore.updateData,
    )
    if (fetchErrors.value)
      fetchErrors.value.forEach(e => errors.value.push(e))
    if (asyncError.value)
      errors.value.push(asyncError.value)
    isFetching.value = false
    dataStore.removeDuplicates()
  }

  return { errors, isFetching, patchReading, getData }
}
