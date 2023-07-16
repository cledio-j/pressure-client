export function getLocalISO() {
  // does the acrobatics to get a html datepicker compatible string with correct TZ
  const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -8)
  return localISOTime
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
