<script setup lang="ts">
import type { Reading } from 'api'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  readings: Reading[]
  headers: Record<keyof Reading, boolean>
  firstRow: number
  lastRow: number
  colored?: boolean
}>()

defineEmits<{ (e: 'showCard', reading: Reading): void }>()
const { d } = useI18n()

// const tableState = reactive({
//   sortBy: 'timestamp',
//   order: 'desc',
// })

const data = computed(() => {
  return props.readings.slice(props.firstRow, props.lastRow)
})

function getTime(type: 'date' | 'time', value: string) {
  const date = new Date(value)
  if (type === 'date')
    return d(date, 'short')
  else
    return date.toISOString().slice(11, 16)
}
</script>

<template>
  <div class="max-h-screen">
    <table class="w-full border-collapse">
      <thead>
        <template v-for="[name, show] in Object.entries(headers)" :key="name">
          <th
            v-if="show"
            class="relative cursor-default border border-back border-b-gray-400 px-1 py-2 font-semibold text-primary"
          >
            {{ $t(`header.${name}`) }}
          </th>
        </template>
      </thead>
      <tbody>
        <tr
          v-for="reading in data" :key="reading.id"
          class="cursor-pointer" hover="bg-back-light"
          @click="$emit('showCard', reading)"
        >
          <template
            v-for="[name, show] in Object.entries(headers) as [keyof Reading, boolean][]"
            :key="name"
          >
            <td
              v-if="show" class="border border-gray-400 px-1"
              :style="{
                backgroundColor: colored ? decideColor(name, reading) : '',
              }"
            >
              {{ name === 'day_time'
                ? $t(`daytime.${reading[name]}`)
                : name === 'date' || name === 'time'
                  ? getTime(name, reading.timestamp)
                  : reading[name] }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
