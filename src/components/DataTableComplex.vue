<script setup lang="ts">
import type { Reading } from 'api'
import type { DayReadings } from './TheDataPanel.vue'
import { DAY_TIMES, VAL_KEYS } from '~/const'

const props = defineProps<{
  type: 'values' | 'days'
  days: [string, DayReadings][]
  colored: boolean
}>()

defineEmits<{ (e: 'expandReading', reading: Reading): void }>()

const isValues = computed(() => {
  return props.type === 'values'
})
</script>

<template>
  <table class="max-w-2xl w-100svw place-self-center md:min-w-50svw">
    <TableDoubleHeader
      :titles="isValues ? VAL_KEYS : DAY_TIMES"
      :sub-titles="isValues ? DAY_TIMES : VAL_KEYS"
      :local-sub-title-prefix="isValues ? 'daytimeShort' : 'header'"
      :local-title-prefix="isValues ? 'header' : 'daytime'"
    />
    <tbody class="">
      <DataTableRow
        v-for="[date, dayReadings] in days"
        :key="date"
        class="bg-light-600" :type="type" :readings="dayReadings" :colored="colored"
        @expand-reading="(reading) => $emit('expandReading', reading)"
      >
        <td class="border">
          {{ $d(new Date(date), 'short') }}
        </td>
      </DataTableRow>
    </tbody>
  </table>
</template>

<style scoped>
tbody > tr:nth-child(even) {
  background-color: white;
}
</style>
