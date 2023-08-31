<script setup lang="ts">
const props = defineProps<{
  range: [number, number]
  lower: number
  upper: number
  label: string
}>()

const emits = defineEmits<{
  (e: 'update:lower', val: number): void
  (e: 'update:upper', val: number): void
}>()

function calcPercent(i: number) {
  return (i - props.range[0]) / (props.range[1] - props.range[0]) * 100
}

const lThumb = ref<HTMLDivElement | undefined>()
const uThumb = ref<HTMLDivElement | undefined>()
const container = ref<HTMLDivElement | undefined>()

const rect = computed(() => {
  if (!container.value)
    return
  return container.value.getBoundingClientRect()
})

const { x: lowerX } = useDraggable(lThumb, { axis: 'x' })
const { x: upperX } = useDraggable(uThumb, { axis: 'x' })

function getNewPos(start: number, x: number) {
  if (!rect.value)
    return 0
  const newPos = (x - rect.value.left) * ((props.range[1] - props.range[0]) / rect.value.width)
  const val = Math.round(newPos + props.range[0])
  if (val > props.range[1])
    return props.range[1]
  if (val < props.range[0])
    return props.range[0]
  return val
}

watch(lowerX, (newVal, _oldVal) => {
  let val = getNewPos(lowerX.value, newVal)
  if (val >= props.upper)
    val = props.upper

  emits('update:lower', val)
})

watch(upperX, (newVal, _oldVal) => {
  let val = getNewPos(upperX.value, newVal)
  if (val <= props.lower)
    val = props.lower
  emits('update:upper', val)
})

function handleMove(e: Event) {
  // todo
}

const percent = computed(() => {
  return {
    upper: `${Math.floor(calcPercent(props.upper)).toString()}%`,
    lower: `${Math.floor(calcPercent(props.lower)).toString()}%`,
  }
})
</script>

<template>
  <fieldset class="relative mx-1 flex flex-row items-center justify-between gap-2">
    <label class="font-semibold text-tx-title">{{ label }}</labeL>
    <div class="flex flex-row items-center gap-1">
      <div>{{ lower }}</div>
      <div ref="container" relative class="h-1rem min-w-12rem" @click="handleMove">
        <div class="absolute top-0.375rem h-0.25rem w-100% bg-back" />
        <div
          ref="lThumb"
          class="lower absolute h-1rem w-1rem touch-none rounded-full bg-primary-dark"
          @click.stop.prevent
        />
        <div
          ref="uThumb"
          class="upper absolute h-1rem w-1rem touch-none rounded-full bg-primary-dark"
          @click.stop.prevent
        />
      </div>
      <span class="ml-4">{{ upper }}</span>
    </div>
  </fieldset>
</template>

<style scoped>
.lower{
  left: v-bind(percent.lower);
}
.upper{
  left: v-bind(percent.upper);
}
</style>
