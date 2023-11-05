export function useValidate<T>(value: Ref<T | undefined>, range: [T, T]) {
  const valid = computed(() => {
    if (!value)
      return false
    return value >= range[0] && value <= range[1]
  })

  return { valid }
}
