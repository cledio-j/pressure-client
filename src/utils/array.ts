export function binaryInsert<T>(
  arr: Array<T>,
  element: T,
  gt: (a: T, b: T) => boolean,
) {
  const insert = (e: T, lower: number, upper: number) => {
    if (upper - lower === 1) {
      let loc = 0
      if (gt(e, arr[upper]))
        loc = upper + 1
      else if (gt(arr[lower], e))
        loc = lower
      else loc = upper
      return loc
    }
    const mid = Math.floor((upper - lower) / 2) + lower
    if (gt(e, arr[mid]))
      insert(e, lower, mid)
    else
      insert(e, mid, upper)
  }

  return insert(element, 0, arr.length)
}

export function binarySearch<T>(
  arr: T[],
  element: T,
  getter: (a: T) => any = (a: T) => a, // default to using the element itself for comparison
) {
  let left = 0
  let right = arr.length - 1
  const lookFor = getter(element)

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const el = getter(arr[mid])
    if (el > lookFor)
      left = mid + 1
    else if (el < lookFor)
      right = mid - 1
    else
      return mid
  }

  return -1
}
