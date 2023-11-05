import type { NewReading, Reading, WeatherReading } from 'api'
import type { IDBPDatabase } from 'idb'
import type { MaybeRef } from 'vue'
import type { Schema } from '../utils/idb'
import { open } from '../utils/idb'
import type { Repository } from '~/types'
import { useNoteStore } from '~/stores/notifications'

export function useLocalData(): Repository {
  const isBusy = ref(false)
  const ready = ref(false)

  const { notes } = useNoteStore()

  const db = ref<IDBPDatabase<Schema>>()

  async function getDB() {
    db.value = await open()
  }

  getDB().then(
    () => ready.value = true,
    () => {
      ready.value = false
      notes.push({
        name: 'DB error',
        severity: 'fatal',
      })
    },

  )

  async function putReading(reading: NewReading) {
    if (!ready.value || !db.value)
      return

    if (Object.values(reading).includes(undefined))
      // check for missing values
      return

    const toPut: Reading = {
      user_id: 1,
      diastolic_bp: reading.diastolic_bp!, // we would have erroed already if this was missing
      systolic_bp: reading.systolic_bp!,
      heart_rate: reading.heart_rate!,
      day_time: reading.day_time,
      timestamp: reading.timestamp,
      created: new Date().toISOString(),
      uuid: crypto.randomUUID(),
      id: 0,
      weather: {} as WeatherReading,
    }

    await db.value.put('readings', toPut, toPut.uuid)
    return toPut
  }

  async function patchReading(reading: Reading) {
    if (!ready.value || !db.value)
      return

    const toChange = await db.value.getFromIndex('readings', 'uuid', reading.uuid)
    if (!toChange) {
      putReading(reading)
      return
    }

    Object.assign(toChange, reading)
    await db.value.put('readings', toChange, toChange.uuid)

    return toChange
  }

  async function deleteReading(reading: MaybeRef<Reading>) {
    if (!ready.value || !db.value)
      return

    const deleted = unref(reading)

    await db.value.delete('readings', deleted.uuid)

    return deleted
  }

  async function getData() {

  }

  return { isBusy, ready, patchReading, putReading, deleteReading, getData }
}
