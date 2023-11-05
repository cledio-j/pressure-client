import type { Reading } from 'api'

const { settings } = useSettings()

const ranges = {
  sys: settings.table.colorSys,
  dia: settings.table.colorDia,
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
    return `hsl(${c}, 85%, 75%)`
  }
  else { return '' }
}
