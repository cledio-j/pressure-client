<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import type { FetchError } from '~/composables/fetch'
import type { CardState } from '~/types'
import type { Reading } from '~/types/api'

const props = defineProps<{
  items: Reading[]
}>()
const emit = defineEmits<{
  (e: 'readingChanged', reading: Reading): void
  (e: 'deleteReading', reading: Reading): void
  (e: 'deleteError', errors: FetchError[]): void
}>()

const { settings } = useSettings()
const breakpoints = useBreakpoints(breakpointsTailwind)

const stateMap = reactive<Map<number, CardState>>(new Map())

function makeState() {
  const arr = Array.from({ length: props.items.length }, (_x, i) => i)
  arr.forEach((n) => {
    stateMap.set(n, {
      expanded: n < settings.value.latest.numExpanded,
      edit: false,
      weather: breakpoints.isGreater('sm'),
      comparison: getComparison(n),
    })
  })
}

function toggleState(idx: number, key: keyof Pick<CardState, 'expanded' | 'weather' | 'edit'>) {
  const state = stateMap.get(idx)
  if (state)
    state[key] = !state[key]
}

function getComparison(index: number) {
  if (settings.value.latest.comparison === 'latest') {
    return props.items[index + 1]
  }
  else if (settings.value.latest.comparison === 'dayBefore') {
    for (let i = index + 1; i < props.items.length; i++) {
      if (props.items[i].day_time === props.items[index].day_time)
        return props.items[i]
    }
    return null
  }
  else {
    return null
  }
}

function handleEdit(idx: number, item: Reading) {
  emit('readingChanged', props.items[idx])
  toggleState(idx, 'edit')
}

function updateStateMap() {
  const oldMap = new Map(stateMap)
  makeState()
  for (const [k, v] of oldMap.entries())
    stateMap.set(k, v)
}

onMounted(() => {
  if (!stateMap || stateMap.size === 0)
    makeState()
})

watch(props.items, () => {
  updateStateMap()
})
watch(breakpoints.current(), () => {
  stateMap.clear()
  makeState()
})
</script>

<template>
  <TransitionGroup name="list">
    <div
      v-for="(item, idx) of items" :key="item.id"
      class="card-shadow relative mx-1.5 min-h-2.5rem flex flex-col flex-nowrap rounded-sm from-back-offwhite to-white bg-gradient-to-tr px-0.5 text-tx-title transition-all duration-200"
      :class="{
        'ease-out': !stateMap.get(idx)?.expanded,
      }"
    >
      <header
        class="flex flex-row justify-between py-0"
      >
        <h2
          class="cursor-pointer justify-self-center pt-1 font-500"
          :class="{
            'border-b border-dashed  md:py-1 md:pt-0':
              stateMap.get(idx)?.expanded,
          }"
          @click="toggleState(idx, 'expanded')"
        >
          {{ `${$d(new Date(item.timestamp), "long")} - ${$t(`daytime.${item.day_time}`)}` }}
        </h2>
        <BaseExpandButton
          class="text-2xl text-tx-title"
          :expanded="stateMap.get(idx)?.expanded"
          @toggle-expand="toggleState(idx, 'expanded')"
        />
      </header>
      <div v-if="stateMap.get(idx)?.expanded" class="relative mt-1 flex flex-col sm:grid sm:grid-cols-2">
        <div class="flex flex-row">
          <div class="left-2 max-w-3rem flex flex-col gap-4 text-2xl text-white">
            <button
              class="rounded-full bg-back p-1.5 md:invisible"
              :class="{ 'text-error bg-back-active': stateMap.get(idx)?.weather }"
              @click="toggleState(idx, 'weather')"
            >
              <div
                class="i-ms-cloudy"
              />
            </button>
            <button
              class="rounded-full bg-back p-1.5"
              :class="{ 'text-error bg-back-active': stateMap.get(idx)?.edit }"
              @click="toggleState(idx, 'edit')"
            >
              <div class="i-ms-edit" />
            </button>
          </div>
          <ReadingValuesCard
            class="mb-2"
            :state="stateMap.get(idx)!"
            :item="item"
            @edit="(reading: Reading) => handleEdit(idx, reading)"
            @delete="$emit('deleteReading', item)"
          />
        </div>
        <ReadingWeatherCard
          v-if="stateMap.get(idx)?.weather" class="mb-2" :weather="item.weather"
        />
      </div>
      <span v-else class="my-0 shrink-0 py-0 align-text-top text-xs text-tx-secondary">
        {{ item.systolic_bp }}/{{ item.diastolic_bp }}
      </span>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}

.card-shadow {
  box-shadow: 0px 0px 2px var(--c-primary);
}
</style>
