<script setup lang="ts">
import type { WeatherReading } from 'api'

defineProps<{ weather: WeatherReading }>()

type IconMap = typeof icons
type IconKey = keyof IconMap

const icons = {
  'cloudy': 'i-ms-cloudy text-white',
  'clear-day': 'i-ms-clear-day text-amber',
  'partly-cloudy-day': 'i-ms-partly-cloudy-day text-rose-200',
  'clear-night': 'i-ms-clear-night text-slate-200',
  'rain': 'i-ms-rainy text-cyan-200',
  'partly-cloudy-night': 'i-ms-partly-cloudy-night text-slate-200',
  'fog': 'i-ms-foggy text-bluegray-300',
  'sleet': 'i-ms-rainy-snow text-blue-300',
  'hail': 'i-ms-weather-hail text-blue-300',
  'wind': 'i-ms-air text-white',
  'snow': 'i-ms-cloudy-snowing text-white',
}
</script>

<template>
  <div
    class="rounded-full bg-opacity-20 from-sky-300 to-rose-100 bg-gradient-to-b pr-0 opacity-100 ring-2 ring-gray-300 drop-shadow-xl"
  >
    <div
      class="grid grid-cols-3 grid-rows-1 ml-8 mt-4 w-3/4 justify-items-center justify-self-center"
    >
      <div class="text-4xl" :class="icons[weather.icon as IconKey]" />
      <div class="flex flex-row">
        <div class="i-ms-thermostat text-2xl text-red-700" />
        <span class="text-xl font-semibold">{{ `${weather.temperature.toFixed(1)}°C` }}</span>
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
        <span class="font-semibold">{{ `${weather.relative_humidity}%` }}</span>
      </div>
      <div class="flex-ro mx-5 flex justify-between md:mx-3">
        <span>{{ $t("header.pressure") }}</span>
        <span class="font-semibold">{{ `${weather.pressure}hPa` }}</span>
      </div>
      <div class="flex-ro mx-5 flex justify-between md:mx-3">
        <span>{{ $t("header.cloud_cover") }}</span>
        <span class="font-semibold">{{ `${weather.cloud_cover}%` }}</span>
      </div>
    </div>
  </div>
</template>
