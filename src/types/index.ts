import type { Reading } from 'api'
import type * as c from '../const'

export type DayTimeVal = typeof c.ALL_DAY_TIMES[number]
export type StatsView = typeof c.ALL_STATS_VIEWS[number]
export type PerPageOption = typeof c.PER_PAGE_OPTS[number]
export type InitialFetchOption = typeof c.INITIAL_FETCH_OPTS[number]
export type TableView = typeof c.ALL_TABLE_VIEWS[number]
export type LocalOption = typeof c.LOCAL_OPTIONS[number]

export interface CardState {
  expanded: boolean
  weather: boolean
  edit: boolean
  comparison: Reading | null
}

export interface Settings {
  table: {
    headers: { [key in keyof Reading]: boolean }
    color: boolean
    defaultView: TableView
    perPage: PerPageOption
    perFetch: number
    initialFetch: InitialFetchOption
    colorSys: ColorSetting
    colorDia: ColorSetting
  }
  stats: {
    defaultView: StatsView
    graphDefaultPeriod: number
  }
  latest: {
    comparison: keyof typeof ComparisonType
    numEntries: typeof LATEST_COUNTS[number]
    numExpanded: typeof LATEST_EXPANDED[number]
  }
  language: LocalOption
  dark: boolean
  lastUpdated: string | Date | undefined
  daytimeOptions: string[]
  timeShortcuts: string[]
}
export interface ColorSetting {
  min: number
  max: number
  delta: number
}
export interface Filter {
  systolic_bp: [number, number]
  diastolic_bp: [number, number]
  heart_rate: [number, number]
  day_time: DayTimeVal[]
  date: [string, string]
}

// export type IconMap = typeof WEATHER_ICONS
// export type IconKey = keyof IconMap
