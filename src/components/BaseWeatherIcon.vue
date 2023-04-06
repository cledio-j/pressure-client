<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import ClearDay from '../assets/svg/weather/clear-day.svg?component'
import ClearNight from '../assets/svg/weather/clear-night.svg?component'
import Cloudy from '../assets/svg/weather/cloudy.svg?component'
import Fog from '../assets/svg/weather/fog.svg?component'
import Hail from '../assets/svg/weather/hail.svg?component'
import PartlyCloudyNight from '../assets/svg/weather/partly-cloudy-night.svg?component'
import PartlyCloudyDay from '../assets/svg/weather/partly-cloudy-day.svg?component'
import Rain from '../assets/svg/weather/rain.svg?component'
import Sleet from '../assets/svg/weather/sleet.svg?component'
import Snow from '../assets/svg/weather/snow.svg?component'
import Thunderstorm from '../assets/svg/weather/thunderstorm.svg?component'
import Wind from '../assets/svg/weather/wind.svg?component'
import Thermostat from '../assets/svg/weather/thermostat.svg?component'

const props = defineProps<{ icon: string }>()

const icons: { [index: string]: FunctionalComponent } = {
  'cloudy': Cloudy,
  'clear-day': ClearDay,
  'clear-night': ClearNight,
  'fog': Fog,
  'hail': Hail,
  'partly-cloudy-night': PartlyCloudyNight,
  'partly-cloudy-day': PartlyCloudyDay,
  'rain': Rain,
  'sleet': Sleet,
  'snow': Snow,
  'thunderstorm': Thunderstorm,
  'wind': Wind,
  'thermostat': Thermostat,
}
</script>

<template>
  <component
    :is="icons[icon]"
    class="overflow-hidden"
    :class="{ 'fill-white': icon === 'cloudy' }"
  />
</template>

<style></style>
