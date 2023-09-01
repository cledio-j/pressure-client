<script setup lang="ts">
import { ALL_DAY_TIMES, VAL_KEYS } from '../const'
import type { Filter } from '~/types'
import { xDaysFromNow } from '~/utils/dates'

defineEmits<{ (e: 'applyFilter', filter: Filter, noFilter: Filter): void }>()

const ranges = {
  systolic_bp: [30, 200],
  diastolic_bp: [20, 150],
  heart_rate: [20, 200],
}

function getInitialFilter(): Filter {
  return {
    systolic_bp: [30, 200],
    diastolic_bp: [20, 150],
    heart_rate: [20, 200],
    day_time: ['morning', 'evening', 'lunch', 'other'],
    date: [
      xDaysFromNow(-1000).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)],
  }
}

const filter = ref<Filter>(getInitialFilter())
</script>

<template>
  <form class="mx-2 max-w-sm min-h-12rem w-full flex flex-col items-start gap-1">
    <section class="flex flex-col gap-1">
      <h3 class="font-semibold text-tx">
        {{ $t('controls.filterValue') }}
      </h3>
      <template v-for="val in VAL_KEYS" :key="val">
        <BaseTwoValSlider
          v-model:lower="filter[val][0]"
          v-model:upper="filter[val][1]"
          class="border-l border-primary-light border-dashed pl-2"
          :range="ranges[val]"
          :label="$t(`header.${val}`)"
        />
      </template>
    </section>
    <section class="mt-1">
      <h3 class="font-semibold text-tx">
        {{ $t('controls.filterDayTime') }}
      </h3>
      <BaseArraySelect
        v-model="filter.day_time"
        class="mx-2 mt-2 flex flex-row justify-between gap-3" :options="ALL_DAY_TIMES"
        :local-labels="ALL_DAY_TIMES.map(d => $t(`daytime.${d}`))"
      />
    </section>
    <section class="mb-2 mt-2 flex flex-col items-start">
      <h3 class="font-semibold text-tx">
        {{ $t('controls.filter_by_date') }}
      </h3>
      <fieldset class="ml-1 flex flex-col gap-1 border-l border-primary-light border-dashed">
        <BaseDateInput v-model="filter.date[0]" type="date" label="Von" />
        <BaseDateInput v-model="filter.date[1]" type="date" label="Bis" />
      </fieldset>
    </section>
    <div
      class="mx-2 mb-2 max-w-xs w-full flex flex-row justify-between border-t border-dashed py-1"
    >
      <button
        type="button" class="border rounded-full bg-back-light p-1"
        @click="filter = getInitialFilter()"
      >
        <div class="i-ms-undo text-2xl text-primary" />
      </button>

      <button
        type="submit" class="btn"
        @click.stop.prevent="$emit('applyFilter', filter, getInitialFilter())"
      >
        {{ $t('controls.applyFilter') }}
      </button>
    </div>
  </form>
</template>
