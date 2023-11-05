import type { Reading } from 'api'
import type { DBSchema } from 'idb/with-async-ittr'
import { openDB } from 'idb/with-async-ittr'

export interface DBAction {
  type: 'modify' | 'delete' | 'add'
  target: string
  timestamp: Date
}

export interface Schema extends DBSchema {
  'readings': { value: Reading; key: string; indexes: { 'timestamp': string; 'uuid': string } }
  'actions': { value: DBAction; key: string; indexes: { 'timestamp': string; 'target': string } }
}

export async function open() {
  const db = await openDB<Schema>('localData', 1, {
    upgrade(db) {
      const readingStore = db.createObjectStore('readings', { keyPath: 'uuid' })
      readingStore.createIndex('timestamp', 'timestamp')

      const actionStore = db.createObjectStore('actions', { keyPath: 'timestamp' })
      actionStore.createIndex('target', 'target')
    },
  })
  return db
}
