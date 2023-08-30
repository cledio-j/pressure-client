import type { Reading } from 'api'

export {}

export interface CardState {
  expanded: boolean
  weather: boolean
  edit: boolean
  comparison: Reading | null
}
// export type IconMap = typeof WEATHER_ICONS
// export type IconKey = keyof IconMap
