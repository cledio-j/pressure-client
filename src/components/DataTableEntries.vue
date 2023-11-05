<script setup lang="ts">
import type { Reading } from 'api'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  readings: Reading[]
  headers: Record<string, boolean>
  firstRow: number
  lastRow: number
  colored?: boolean
}>()

defineEmits<{ (e: 'expandReading', reading: Reading): void }>()
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
  <table class="w-100svw border-collapse select-none place-self-center md:min-w-50svw md:w-auto">
    <thead>
      <template v-for="(show, name, _idx) in headers" :key="_idx">
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
        @click="$emit('expandReading', reading)"
      >
        <template
          v-for="(show, name) in headers"
          :key="name"
        >
          <td
            v-if="show" class="border border-gray-400 px-1 transition-colors"
            :style="{
              backgroundColor: colored ? decideColor(name, reading) : '',
            }"
          >
            {{ name === 'day_time'
              ? $t(`daytime.${reading[name]}`)
              : name === 'date' || name === 'time'
                ? getTime(name, reading.timestamp)
                : reading[name as keyof Reading] }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
