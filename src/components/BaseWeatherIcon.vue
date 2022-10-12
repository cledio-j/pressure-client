<script setup lang="ts">
import Cloudy from "../assets/svg/weather/cloudy.svg?component";

const icons = { cloudy: Cloudy };

const props = defineProps<{ icon: string }>();
</script>
<template>
  <component
    :class="{ 'fill-gray-300': icon == 'cloudy' }"
    :is="icons[icon]"
  ></component>
</template>
