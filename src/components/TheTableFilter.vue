<script setup lang="ts">
import type { DayTimeVal } from '~/types'

const props = defineProps<{
  modelValue?: boolean
}>()

interface Filter {
  systolic_bp: [number, number]
  diastolic_bp: [number, number]
  heart_rate: [number, number]
  day_time: DayTimeVal[]
}

const ranges = {
  systolic_bp: [30, 200],
  diastolic_bp: [20, 150],
  heart_rate: [20, 200],
}

const filter = reactive<Filter>({
  systolic_bp: [30, 200],
  diastolic_bp: [20, 150],
  heart_rate: [20, 200],
  day_time: ['morning', 'evening', 'lunch', 'other'],
})
</script>

<template>
  <div class="min-h-12rem w-full">
    <template v-for="val in VAL_KEYS" :key="val">
      <BaseTwoValSlider
        v-model:lower="filter[val][0]"
        v-model:upper="filter[val][1]"
        :range="ranges[val]"
        :label="$t(`header.${val}`)"
      />
    </template>
  </div>
</template>
