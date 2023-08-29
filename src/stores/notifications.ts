import { defineStore } from 'pinia'

export interface NoteAction {
  name: string
  description?: string
  icon?: string
  action: ((arg0?: any) => void) | ((arg0?: any) => Promise<void>)
}

export interface Note {
  name: string
  description?: string
  severity: string
  original?: Error
  response?: Response
  actions?: NoteAction[]

}

export const useNoteStore = defineStore('notifications', () => {
  const notes: Note[] = []
  function clear() {
    notes.length = 0
  }
  return { notes, clear }
})
