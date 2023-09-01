import type { Settings } from '~/types'

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
