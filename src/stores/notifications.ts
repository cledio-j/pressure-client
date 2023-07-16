import { defineStore } from 'pinia'

export interface noteAction {
  name: string
  action: ((arg0?: any) => void) | ((arg0?: any) => Promise<void>)
}

export class Notification {
  title: string
  message: string
  severity?: string = 'warning'
  actions?: noteAction[]
  constructor(title: string, message: string, actions?: noteAction[]) {
    this.title = title
    this.message = message
    this.actions = actions
  }
}

export const useNoteStore = defineStore('notifications', () => {
  const notes: Notification[] = []
  function clear() {
    notes.length = 0
  }
  return { notes, clear }
})
