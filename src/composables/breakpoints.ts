import { type Ref, computed, ref } from 'vue'
import { useEventListener } from './event'

export function useBreakpoints() {
  const width: Ref<number> = ref(window.innerWidth)

  useEventListener(window, 'resize', () => (width.value = window.innerWidth))

  const breakpoint = computed(() => {
    if (width.value < 768)
      return 'sm'
    if (width.value < 1024)
      return 'md'
    if (width.value < 1280)
      return 'lg'
    if (width.value < 1536)
      return 'xl'
    return '2xl'
  })
  return { width, breakpoint }
}
