<script setup lang="ts">
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

const stateMap = reactive<Map<number, CardState>>(new Map())
const comparisonType = ref<'last' | 'dayBefore'>('last')

// function makeState() {
//   props.items.forEach((i, idx) => stateMap.set(i,
//     {
//       expanded: idx < 3,
//       weather: false,
//       edit: false,
//     }))
// }

function makeState() {
  const arr = Array.from({ length: props.items.length }, (_x, i) => i)
  arr.forEach((n) => {
    stateMap.set(n, {
      expanded: n < 3,
      edit: false,
      weather: false,
    })
  })
}

function toggleState(idx: number, key: keyof CardState) {
  const state = stateMap.get(idx)
  if (state)
    state[key] = !state[key]
}

function getComparison(index: number) {
  if (comparisonType.value === 'last')
    return props.items[index + 1]
  // todo dayBefore
}

function handleEdit(idx: number, item: Reading) {
  emit('readingChanged', props.items[idx])
  toggleState(idx, 'edit')
}

// async function handleDelete(reading: Reading, item: Reading) {
//   const { deleted, errors } = await useDelete(reading)
//   if (errors.value.length > 0) {
//     emit('deleteError', errors.value)
//     return
//   }
//   emit('deleteReading', deleted)
//   stateMap.delete(item)
// }

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
        'h-[50px] ease-out': !stateMap.get(idx)?.expanded,
      }"
    >
      <div
        class="flex flex-row justify-between border-t py-0"
      >
        <h2
          class="cursor-pointer justify-self-center py-1 text-lg font-semibold md:col-span-3"
          :class="{
            'border-b border-dashed  md:py-1 md:pt-0':
              stateMap.get(idx)?.expanded,
          }"
          @click="toggleState(idx, 'expanded')"
        >
          {{ `${$d(new Date(item.timestamp), "long")} - ${$t(`daytime.${item.day_time}`)}` }}
        </h2>
        <BaseExpandButton
          :expanded="stateMap.get(idx)?.expanded"
          @toggle-expand="toggleState(idx, 'expanded')"
        />
      </div>
      <div v-if="stateMap.get(idx)?.expanded" class="relative mt-1 flex flex-col">
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
              class="rounded-full bg-back p-1.5 md:invisible"
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
            :comparison="getComparison(idx)"
            @edit="(reading: Reading) => handleEdit(idx, reading)"
            @delete="$emit('deleteReading', item)"
          />
        </div>
        <ReadingWeatherCard
          v-if="stateMap.get(idx)?.weather" class="mb-2" :weather="item.weather"
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
