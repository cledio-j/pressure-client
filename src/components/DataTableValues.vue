<script setup lang="ts">
import TableDoubleHeader from './TableDoubleHeader.vue'
import type { DayReadings } from './TheDataPanel.vue'
import { DAY_TIMES, VAL_KEYS } from '~/const'

defineProps<{
  days: [string, DayReadings][]
  colored: boolean
}>()
</script>

<template>
  <table class="w-full">
    <TableDoubleHeader
      :titles="VAL_KEYS"
      :sub-titles="DAY_TIMES"
      local-sub-title-prefix="daytimeShort"
      local-title-prefix="header"
    />
    <tbody>
      <template v-for="[date, dayReadings] in days" :key="date">
        <tr>
          <td class="border">
            {{ $d(new Date(date), 'short') }}
          </td>
          <DataTableRow type="values" :readings="dayReadings" :colored="colored" />
        </tr>
      </template>
    </tbody>
  </table>
</template>
