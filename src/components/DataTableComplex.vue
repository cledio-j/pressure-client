<script setup lang="ts">
import type { DayReadings } from './TheDataPanel.vue'
import { DAY_TIMES, VAL_KEYS } from '~/const'

const props = defineProps<{
  type: 'values' | 'days'
  days: [string, DayReadings][]
  colored: boolean
}>()

const isValues = computed(() => {
  return props.type === 'values'
})
</script>

<template>
  <table class="">
    <TableDoubleHeader
      :titles="isValues ? VAL_KEYS : DAY_TIMES"
      :sub-titles="isValues ? DAY_TIMES : VAL_KEYS"
      :local-sub-title-prefix="isValues ? 'daytimeShort' : 'header'"
      :local-title-prefix="isValues ? 'header' : 'daytime'"
    />
    <tbody class="">
      <DataTableRow v-for="[date, dayReadings] in days" :key="date" :type="type" :readings="dayReadings" :colored="colored">
        <td class="border">
          {{ $d(new Date(date), 'short') }}
        </td>
      </DataTableRow>
    </tbody>
  </table>
</template>
