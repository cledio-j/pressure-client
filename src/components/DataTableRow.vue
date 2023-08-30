<script setup lang="ts">
import { VAL_KEYS } from '../composables/settings'
import type { DayReadings } from './TheDataPanel.vue'

const props = defineProps<{
  readings: DayReadings
  type: 'values' | 'days'
  colored: boolean
}>()

const row = computed(() => {
  return {
    morning: Array.from(props.readings.morning.values()),
    lunch: Array.from(props.readings.lunch.values()),
    evening: Array.from(props.readings.evening.values()),
    other: Array.from(props.readings.other.values()),
  }
})

function getColor(time: typeof DAY_TIMES[number], val: typeof VAL_KEYS[number]) {
  if (!props.colored || !row.value[time].length)
    return ''
  return decideColor(val, row.value[time][0])
}
</script>

<template>
  <template v-if="type === 'days'">
    <template v-for="t in DAY_TIMES" :key="t">
      <td
        v-for="(k, i) in VAL_KEYS" :key="i"
        class="border-collapse border px-0.5 text-center transition-colors duration-200"
        :class="{ 'bg-back-light': row[t].length > 1 }"
        :style="{
          backgroundColor: getColor(t, k),
        }"
      >
        {{ row[t].length ? row[t][0][k] : '' }}
        <!-- <div v-if="row.other.length > 0">
          a
        </div> -->
      </td>
    </template>
  </template>
  <template v-else-if="type === 'values'">
    <template v-for="(k, _i) in VAL_KEYS" :key="_i">
      <td
        v-for="t in DAY_TIMES" :key="t"
        class="border-collapse border px-0.5 text-center"
        :style="{
          backgroundColor: getColor(t, k),
        }"
      >
        {{ row[t].length ? row[t][0][k] : '' }}
      </td>
    </template>
  </template>
</template>

<style scoped>
td:nth-child(3n-1){
  border-left: 2px solid var(--c-primary-dark);
}
</style>
