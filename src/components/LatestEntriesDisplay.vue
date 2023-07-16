<script setup lang="ts">
import type { CardState } from '~/types'
import type { Reading } from '~/types/api'

const props = defineProps<{
  items: Reading[]
}>()
const emit = defineEmits<{
  (e: 'readingChanged', reading: Reading): void
}>()

const stateMap = reactive<Map<Reading, CardState>>(new Map())
const comparisonType = ref<'last' | 'dayBefore'>('last')

function makeState() {
  props.items.forEach((i, idx) => stateMap.set(i,
    {
      expanded: idx < 3,
      weather: false,
      edit: false,
    }))
}

function toggleState(item: Reading, key: keyof CardState) {
  const state = stateMap.get(item)
  if (state)
    state[key] = !state[key]
}

function getComparison(index: number) {
  if (comparisonType.value === 'last')
    return props.items[index + 1]
  // todo dayBefore
}

function handleEdit(reading: Reading, item: Reading) {
  emit('readingChanged', reading)
  toggleState(item, 'edit')
}

onMounted(() => {
  if (!stateMap || stateMap.size === 0)
    makeState()
})

watch(props.items, () => {
  const oldMap = new Map(stateMap)
  makeState()
  for (const [k, v] of oldMap.entries())
    stateMap.set(k, v)
})
</script>

<template>
  <TransitionGroup name="list">
    <div
      v-for="(item, idx) of items" :key="item.id"
      class="relative items-center justify-between text-tx-title shadow-primShadow shadow-sm transition-all duration-200"
      :class="{
        'h-[50px] ease-out': !stateMap.get(item)?.expanded,
      }"
    >
      <div
        class="flex flex-row justify-between border-t py-0"
      >
        <h2
          class="cursor-pointer justify-self-center py-1 text-lg font-semibold md:col-span-3"
          :class="{
            'border-b border-dashed  md:py-1 md:pt-0':
              stateMap.get(item)?.expanded,
          }"
          @click="toggleState(item, 'expanded')"
        >
          {{ `${$d(new Date(item.timestamp), "long")} - ${$t(`daytime.${item.day_time}`)}` }}
        </h2>
        <BaseExpandButton
          :expanded="stateMap.get(item)?.expanded"
          @toggle-expand="toggleState(item, 'expanded')"
        />
      </div>
      <div v-if="stateMap.get(item)?.expanded" class="relative mt-1 flex flex-col">
        <div class="flex flex-row">
          <div class="left-2 max-w-3rem flex flex-col gap-4 text-2xl text-white">
            <button
              class="rounded-full bg-back p-1.5 md:invisible"
              :class="{ 'text-error bg-back-active': stateMap.get(item)?.weather }"
              @click="toggleState(item, 'weather')"
            >
              <div
                class="i-ms-cloudy"
              />
            </button>
            <button
              class="rounded-full bg-back p-1.5 md:invisible"
              :class="{ 'text-error bg-back-active': stateMap.get(item)?.edit }"
              @click="toggleState(item, 'edit')"
            >
              <div class="i-ms-edit" />
            </button>
          </div>
          <ReadingValuesCard
            class="mb-2"
            :state="stateMap.get(item)!"
            :item="item"
            :comparison="getComparison(idx)"
            @edit="(reading: Reading) => handleEdit(reading, item)"
          />
        </div>
        <ReadingWeatherCard
          v-if="stateMap.get(item)?.weather" class="mb-2" :weather="item.weather"
        />
      </div>
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
</style>
