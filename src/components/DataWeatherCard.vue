<script setup lang="ts">
import BaseWeatherIcon from './BaseWeatherIcon.vue'
const props = defineProps<{ weather: WeatherReading }>()
</script>

<template>
  <div
    class="rounded-full bg-opacity-20 bg-gradient-to-b from-sky-300 to-rose-100 pr-0 opacity-100 ring-2 ring-gray-300 drop-shadow-xl"
  >
    <div
      class="ml-8 mt-4 grid w-3/4 grid-cols-3 grid-rows-1 justify-items-center justify-self-center"
    >
      <BaseWeatherIcon
        :icon="weather.icon"
        class="row-span-2 scale-150"
      />
      <div class="flex flex-row">
        <BaseWeatherIcon
          class="-translate-y-1 scale-75 overflow-clip fill-red-700"
          icon="thermostat"
        />
        <span class="text-xl font-semibold">{{ `${weather.temperature.toFixed(1)}°C` }}</span>
      </div>
      <span class="ml-2 text-lg">{{ $t(`messages.${weather.condition}`) }}</span>
    </div>
    <div
      class="col-span-2 col-start-1 row-start-2 mx-2 mt-1 grid grid-cols-2 py-2 text-sm text-gray-900"
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
