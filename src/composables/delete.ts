import type { DeletedReadingResponse, Reading } from 'api'
import type { MaybeRef } from 'vue'
import type { FetchError } from './fetch'
import { useDataStore } from '~/stores/data'

const dataSore = useDataStore()

export async function useDelete(item: MaybeRef<Reading>) {
  const deleted = unref(item)
  const errors = ref<FetchError[]>([])

  const { data, error } = await useFetch<DeletedReadingResponse>(
    'reading/delete' + `?id=${deleted.id}`,
    { auth: true, method: 'DELETE', immediate: true })
  if (error.value)
    errors.value.push(error.value)
  const response = await data.value
  if (response && response.success) {
    const idx = dataSore.findIndex(deleted)
    dataSore.data.splice(idx, 1)
  }

  return { deleted, errors }
}
