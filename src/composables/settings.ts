import type { Reading } from 'api'

type TableView = 'entries' | 'days' | 'values'
type StatsView = 'minMax' | 'graph'

export interface Settings {
  table: {
    headers: { [key in keyof Reading]: boolean }
    color: boolean
    defaultView: TableView
    perPage: number
    perFetch: number
    initialFetch: number
  }
  stats: {
    defaultView: StatsView
    graphDefaultPeriod: number
  }
  lastUpdated: string | Date | undefined
  daytimeOptions: string[]
  timeShortcuts: string
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
      defaultView: 'entries',
      perPage: 25,
      perFetch: 50,
      initialFetch: 500,
    },
    stats: {
      defaultView: 'graph',
      graphDefaultPeriod: 100,
    },
    lastUpdated: new Date(),
    daytimeOptions: ['morning', 'lunch', 'evening', 'other'],
    timeShortcuts: ['8:30', '12:30', '18:30'],
  }
}

function getLocalStorage() {
  const settings = localStorage.getItem('localSettings')
  if (!settings)
    return
  return JSON.parse(settings) as Settings
}

function isRemoteAvailable() {
  return false
}

function getRemote() {

}

export function useSettings() {
  const defaults = getDefault()
  // const remoteAvailable = isRemoteAvailable()

  const local = getLocalStorage()

  const settings = ref(local || defaults)

  const update = (newSettings: Settings) => {
    localStorage.setItem('localSettings', JSON.stringify(newSettings))
  }

  watchEffect(() => update(settings.value))

  return { defaults, settings, update }
}
