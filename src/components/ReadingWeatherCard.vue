<script setup lang="ts">
import type { WeatherReading } from 'api'
import { WEATHER_ICONS } from '~/const'

defineProps<{ weather: WeatherReading }>()
</script>

<template>
  <div
    class="rounded-full bg-opacity-20 from-sky-300 to-rose-100 bg-gradient-to-b pr-0 opacity-100 ring-2 ring-gray-300 drop-shadow-xl"
  >
    <div
      class="grid grid-cols-3 grid-rows-1 ml-8 mt-4 w-3/4 justify-items-center justify-self-center"
    >
      <div class="text-4xl" :class="WEATHER_ICONS[weather.icon]" />
      <div class="flex flex-row">
        <div class="ed-700 text-r i-ms-thermostat text-2xl" />
        <span class="text-xl font-semibold">{{
          `${weather.temperature ? weather.temperature.toFixed(1) : $t('messages.missing')}°C` }}</span>
      </div>
      <span class="ml-2 text-lg">{{ $t(`messages.${weather.condition}`) }}</span>
    </div>
    <div
      class="grid col-span-2 col-start-1 row-start-2 grid-cols-2 mx-2 mt-1 py-2 text-sm text-gray-900"
    >
      <div class="mx-5 flex flex-row justify-between md:mx-3">
        <span>{{ $t("header.precipitation") }}</span>
        <span class="font-semibold">{{ `${weather.precipitation}mm` }}</span>
      </div>
      <div class="mx-5 flex flex-row justify-between md:mx-3">
        <span>{{ $t("header.humidity") }}</span>
        <span class="font-semibold">{{ `${weather.relative_humidity || 0}%` }}</span>
      </div>
      <div class="flex-ro mx-5 flex justify-between md:mx-3">
        <span>{{ $t("header.pressure") }}</span>
        <span class="font-semibold">{{ `${weather.pressure || 0}hPa` }}</span>
      </div>
      <div class="flex-ro mx-5 flex justify-between md:mx-3">
        <span>{{ $t("header.cloud_cover") }}</span>
        <span class="font-semibold">{{ `${weather.cloud_cover || 0}%` }}</span>
      </div>
    </div>
  </div>
</template>
