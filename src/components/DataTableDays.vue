<script setup lang="ts">
import type { DayReadings } from './TheDataPanel.vue'
import { DAY_TIMES, VAL_KEYS } from '~/const'

defineProps<{
  days: [string, DayReadings][]
  colored: boolean
}>()
</script>

<template>
  <table class="w-full border-collapse">
    <TableDoubleHeader
      :titles="DAY_TIMES"
      :sub-titles="VAL_KEYS"
      local-title-prefix="daytime"
      local-sub-title-prefix="header"
    />
    <tbody>
      <template v-for="[date, dayReadings] in days" :key="date">
        <tr>
          <td class="border">
            {{ $d(new Date(date), 'short') }}
          </td>
          <DataTableRow :readings="dayReadings" type="days" :colored="colored" />
        </tr>
      </template>
    </tbody>
  </table>
</template>
