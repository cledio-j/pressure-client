import type { Reading } from 'api'

export {}

export type DayTimeVal = 'other' | 'morning' | 'lunch' | 'evening'

export interface CardState {
  expanded: boolean
  weather: boolean
  edit: boolean
  comparison: Reading | null
}
// export type IconMap = typeof WEATHER_ICONS
// export type IconKey = keyof IconMap
