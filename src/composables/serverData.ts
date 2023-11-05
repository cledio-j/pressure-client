import type {
  DeletedReadingResponse,
  ModifyReadingResponse,
  NewReading,
  NewReadingResponse,
  Reading,
  ReadingApiResponse,
} from 'api'
import type { MaybeRef } from 'vue'
import { useDataStore } from '~/stores/data'
import { useNoteStore } from '~/stores/notifications'
import type { Repository } from '~/types'

export function useServerData(): Repository {
  const isBusy = ref(false)
  const ready = ref(true)
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
    if (result && result.success) {
      dataStore.replaceReading(result.reading)
      return result.reading
    }
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
      return result.reading
    }
  }

  async function deleteReading(reading: MaybeRef<Reading>) {
    const deleted = unref(reading)

    const { data, error } = await useFetch<DeletedReadingResponse>(
      'reading/delete' + `?id=${deleted.id}`,
      { auth: true, method: 'DELETE', immediate: true })

    if (error.value) {
      notes.push(error.value)
      return
    }
    const response = await data.value
    if (response && response.success) {
      const idx = dataStore.binFindIndex(deleted)
      dataStore.data.splice(idx, 1)
    }

    return deleted
  }

  async function getData() {
    dataStore.ready = false
    isBusy.value = true
    const { data, error } = await useFetch<ReadingApiResponse>(
      'readings/get' + `?per_page=${settings.table.perFetch}`,
      { auth: true, method: 'GET', immediate: true },
    )
    if (error.value) {
      notes.push(error.value)
      return
    }

    const res = await data.value
    isBusy.value = false
    if (res)
      dataStore.updateData(res, true)

    dataStore.ready = true

    backgroundFetch('readings/get', dataStore.totalPages, 2, settings.table.perFetch)
  }

  async function backgroundFetch(
    resource: string, length: number, start: number, per_page: number) {
    const pageNums = Array.from({ length: length - 1 }, (x, i) => i + start)
    const urls = pageNums.map(p => `${resource}?page=${p}&per_page=${per_page}`)

    isBusy.value = true
    const { fetchErrors, asyncError } = await usePaginatedFetch<ReadingApiResponse>(urls,
      { auth: true, method: 'GET' }, dataStore.updateData,
    )
    if (fetchErrors.value)
      fetchErrors.value.forEach(e => notes.push(e))
    if (asyncError.value)
      notes.push(asyncError.value)
    isBusy.value = false
    dataStore.removeDuplicates()
  }

  return {
    ready,
    deleteReading,
    isBusy,
    patchReading,
    getData,
    putReading,
  }
}
