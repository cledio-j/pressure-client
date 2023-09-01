export const ALL_DAY_TIMES = ['morning', 'lunch', 'evening', 'other'] as const
export const ALL_TABLE_VIEWS = ['entries', 'days', 'values'] as const
export const ALL_STATS_VIEWS = ['minMax', 'graph'] as const
export const LOCAL_OPTIONS = ['en', 'de'] as const
export const PER_PAGE_OPTS = [5, 10, 15, 25, 50, 75] as const
export const INITIAL_FETCH_OPTS = [50, 100, 250, 500, 1000, 5000] as const
export const VAL_KEYS = ['systolic_bp', 'diastolic_bp', 'heart_rate'] as const
export const DAY_TIMES = ['morning', 'lunch', 'evening'] as const
export const LATEST_COUNTS = [5, 10, 15, 20] as const
export const LATEST_EXPANDED = [1, 3, 5, 10] as const

// @unocss-include
export const WEATHER_ICONS = {
  'cloudy': 'i-ms-cloudy text-white',
  'clear-day': 'i-ms-clear-day text-amber',
  'partly-cloudy-day': 'i-ms-partly-cloudy-day text-rose-200',
  'clear-night': 'i-ms-clear-night text-slate-200',
  'rain': 'i-ms-rainy text-cyan-200',
  'partly-cloudy-night': 'i-ms-partly-cloudy-night text-slate-200',
  'fog': 'i-ms-foggy text-bluegray-300',
  'sleet': 'i-ms-rainy-snow text-blue-300',
  'hail': 'i-ms-weather-hail text-blue-300',
  'wind': 'i-ms-air text-white',
  'snow': 'i-ms-cloudy-snowing text-white',
} as const

export const ComparisonType = {
  latest: 0,
  dayBefore: 1,
} as const
