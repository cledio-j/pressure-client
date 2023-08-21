export function getLocalISO(d: Date = new Date()) {
  // does the acrobatics to get a html datepicker compatible string with correct TZ
  const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
  const localISOTime = new Date(d.valueOf() - tzoffset).toISOString().slice(0, -8)
  return localISOTime
}

export function getDayTime(hours: number = new Date().getHours()) {
  if (hours >= 0 && hours < 11)
    return 'morning'

  else if (hours <= 16)
    return 'lunch'

  else if (hours <= 24)
    return 'evening'

  else
    return 'other'
}

export function xDaysFromNow(days: number, from?: Date | string) {
  if (!from)
    from = new Date()
  if (typeof (from) === 'string')
    from = new Date(from)
  const date = from
  date.setUTCDate(date.getUTCDate() + days)
  date.setUTCHours(0, 0, 0, 0)
  return date
}
