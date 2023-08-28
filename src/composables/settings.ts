import type { Reading } from 'api'

export const ALL_TABLE_VIEWS = ['entries', 'days', 'values'] as const
export const ALL_STATS_VIEWS = ['minMax', 'graph'] as const
export const LOCAL_OPTIONS = ['en', 'de'] as const
export const PER_PAGE_OPTS = [5, 10, 15, 25, 50, 75] as const
export const INITIAL_FETCH_OPTS = [50, 100, 250, 500, 1000, 5000] as const
export const VAL_KEYS = ['systolic_bp', 'diastolic_bp', 'heart_rate'] as const
export const DAY_TIMES = ['morning', 'lunch', 'evening'] as const
export const LATEST_COUNTS = [5, 10, 15, 20] as const
export const LATEST_EXPANDED = [1, 3, 5, 10] as const

export const ComparisonType = {
  latest: 0,
  dayBefore: 1,
} as const

export type StatsView = typeof ALL_STATS_VIEWS[number]
export type PerPageOption = typeof PER_PAGE_OPTS[number]
export type InitialFetchOption = typeof INITIAL_FETCH_OPTS[number]
export type TableView = typeof ALL_TABLE_VIEWS[number]
export type LocalOption = typeof LOCAL_OPTIONS[number]

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

interface ColorSetting {
  min: number
  max: number
  delta: number
}

function getDefault(): Settings {
  return {
    table: {
      headers: {
        date: true,
        time: true,
        timestamp: false,
        systolic_bp: true,
        diastolic_bp: true,
        heart_rate: true,
        day_time: true,
        user_id: false,
        id: false,
        weather: false,
      },
      color: true,
      colorSys: { min: 120, max: 180, delta: 60 },
      colorDia: { min: 80, max: 110, delta: 30 },
      defaultView: 'entries',
      perPage: 25,
      perFetch: 50,
      initialFetch: 500,
    },
    stats: {
      defaultView: 'graph',
      graphDefaultPeriod: 100,
    },
    latest: {
      comparison: 'latest',
      numEntries: 10,
      numExpanded: 3,
    },
    language: 'de',
    dark: false,
    lastUpdated: new Date(),
    daytimeOptions: ['morning', 'lunch', 'evening', 'other'],
    timeShortcuts: ['8:30', '12:30', '18:30'],
  }
}

function getLocalStorage() {
  const jsonSettings = localStorage.getItem('localSettings')
  if (!jsonSettings)
    return
  const settings = JSON.parse(jsonSettings) as Settings

  return settings
}

// function isRemoteAvailable() {
//   return false
// }

// function getRemote() {

// }

export function useSettings() {
  const defaults = getDefault()
  // const remoteAvailable = isRemoteAvailable()

  const local = getLocalStorage()

  const settings = ref(local || defaults)

  const update = (newSettings: Settings) => {
    localStorage.setItem('localSettings', JSON.stringify(newSettings))
  }

  const reset = () => {
    settings.value = defaults
  }

  watchEffect(() => update(settings.value))

  return { defaults, settings, update, reset }
}
