export function xDaysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(0, 0, 0, 0)
  return date
}

export function xDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getTodayIsoStr() {
  // does the acrobatics to get a html datepicker compatible string with correct TZ
  const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -8)
  return localISOTime
}

export function fixTZ(d: Date) {
  // get html datepicker compatible string from existing date
  const tzoffset = new Date().getTimezoneOffset() * 60000
  return new Date(d.valueOf() - tzoffset).toISOString().slice(0, -8)
}

export function getDayTime() {
  const hours = new Date().getHours()
  if (hours >= 0 && hours < 11)
    return 'morning'

  else if (hours <= 17)
    return 'lunch'

  else if (hours <= 24)
    return 'evening'

  else
    return 'other'
}
