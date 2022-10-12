<script setup lang="ts">
import BaseWeatherIcon from "./BaseWeatherIcon.vue";
const props = defineProps<{ weather: WeatherReading }>();
</script>
<template>
  <div
    class="grid grid-cols-2 grid-rows-2 rounded-full bg-opacity-70 bg-gradient-to-b from-blue-200 via-gray-200 to-rose-200 opacity-100 backdrop-blur-md"
  >
    <div class="ml-2 mt-2 grid grid-cols-3 gap-1 justify-self-center">
      <BaseWeatherIcon :icon="weather.icon" class="scale-[2]" />
      <h2 class="text-xl font-semibold">
        {{ weather.temperature + "°C" }}
      </h2>
      <span>{{ weather.condition }}</span>
    </div>
    <div class="col-start-1 row-start-2">
      <div class="grid grid-cols-3">
        <span>{{ weather.precipitation }}</span>
        <span>{{ weather.relative_humidity }}</span>
        <span>{{ weather.pressure }}</span>
      </div>
    </div>
  </div>
</template>
