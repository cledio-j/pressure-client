export function getStr(key: HeaderKey, item: Reading, t: any, d: any, isMobile: boolean) {
  // t and d are translation stuff from useI18n
  // gets the right string rep for Reading values (i.e. splitting timestamp to time and date)
  if (key === 'day_time') {
    return !isMobile ? t(`daytime.${item.day_time}`) : t(`daytime.${item.day_time}-s`)
  }
  else if (key === 'date') {
    const date = item.timestamp?.split('T')[0] as string
    return d(new Date(date), isMobile ? 'short' : 'mid')
  }
  else if (key === 'time') {
    return item.timestamp?.split('T')[1].slice(0, 5)
  }
  else { return item[key] }
}

export function findReading(data: Reading[] | undefined, date: string, dayTime: DayTimeStr) {
  // get Reading values for specific date and daytime
  const reading = data?.find((e) => {
    return e.timestamp?.substring(0, 10) === date && dayTime === e.day_time
  })
  if (!reading)
    return [0, 0, 0]

  return [reading?.systolic_bp, reading?.diastolic_bp, reading?.heart_rate]
}

const ranges = {
  sys: { min: 120, max: 180, delta: 60 },
  dia: { min: 80, max: 110, delta: 30 },
}

function calcPercent(key: 'sys' | 'dia', value: number) {
  if (value < ranges[key].min) {
    return 0
  }
  else if (value > ranges[key].max) {
    return 1
  }
  else {
    const n = value - ranges[key].min
    return n / ranges[key].delta
  }
}

export function decideColor(
  key: string,
  entry: number | Reading,
  hueStart = 120, // green
  hueEnd = 0, // red
) {
  const name = key.substring(0, 3)
  if (['sys', 'dia'].includes(name)) {
    if (typeof entry != 'number')
      entry = entry[key as 'systolic_bp' | 'diastolic_bp']

    if (entry === 0)
      return ''
    let a = calcPercent(name as 'sys' | 'dia', entry)
    a = (hueEnd - hueStart) * a
    const c = a + hueStart
    return `hsl(${c}, 80%, 70%)`
  }
  else { return '' }
}

export function sortReadings(
  data: Reading[],
  sort_by: Sortable = 'timestamp',
  order: 'asc' | 'desc' = 'desc',
) {
  const x = performance.now()
  console.log(sort_by, order)
  data.sort((a: Reading, b: Reading) => {
    if (a[sort_by] > b[sort_by]) {
      if (order === 'desc')
        return -1
      else return 1
    }
    else if (a[sort_by] < b[sort_by]) {
      if (order === 'desc')
        return 1
      else return -1
    }
    return 0
  })
  console.log(`Sorting took ${performance.now() - x}ms`)
  return data
}
