import type {
  ModifyReadingResponse,
  NewReading, NewReadingResponse, Reading, ReadingApiResponse,
} from 'api'
import { useDataStore } from '~/stores/data'
import { useNoteStore } from '~/stores/notifications'

export function useServerData() {
  const isFetching = ref(false)
  const dataStore = useDataStore()
  const { notes } = useNoteStore()
  const { settings } = useSettings()

  async function patchReading(reading: Reading) {
    const { data, error } = await useFetch<ModifyReadingResponse>(
      `reading/modify?id=${reading.id}`,
      { auth: true, method: 'POST', immediate: true, body: JSON.stringify(reading) },
    )
    if (error.value) {
      notes.push(error.value)
      return
    }
    const result = await data.value
    if (result && result.success)
      dataStore.replaceReading(result.reading)
  }

  async function putReading(reading: NewReading) {
    const { data, error } = await useFetch<NewReadingResponse>(
      'reading/put',
      { auth: true, method: 'PUT', immediate: true, body: JSON.stringify(reading) },
    )
    if (error.value) {
      notes.push(error.value)
      return
    }
    const result = await data.value
    if (result && result.success) {
      result.reading.timestamp.slice(0, -3)
      dataStore.insertReading(result.reading)
    }
  }

  async function getData() {
    dataStore.ready = false
    isFetching.value = true
    const { data, error } = await useFetch<ReadingApiResponse>(
      'readings/get' + `?per_page=${settings.value.table.perFetch}`,
      { auth: true, method: 'GET', immediate: true },
    )
    if (error.value) {
      notes.push(error.value)
      return
    }

    const res = await data.value
    isFetching.value = false
    if (res)
      dataStore.updateData(res, true)

    dataStore.ready = true

    backgroundFetch('readings/get', dataStore.totalPages, 2, settings.value.table.perFetch)
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
      fetchErrors.value.forEach(e => notes.push(e))
    if (asyncError.value)
      notes.push(asyncError.value)
    isFetching.value = false
    dataStore.removeDuplicates()
  }

  return { isFetching, patchReading, getData, putReading }
}
