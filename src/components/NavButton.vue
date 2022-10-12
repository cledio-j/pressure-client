<script setup lang="ts">
import timeline from "../assets/svg/timeline.svg?component";
import table from "../assets/svg/table.svg?component";
import monitoring from "../assets/svg/monitoring.svg?component";

const icons: { [index: string]: any } = {
  timeline: timeline,
  table: table,
  monitoring: monitoring,
};

defineProps<{
  icon: string;
  isSelected: boolean;
  butText: string;
}>();
</script>
<template>
  <button
    class="flex cursor-pointer list-none items-center px-2 text-lg transition-all hover:shadow-md hover:shadow-rose-400"
    :class="{ 'font-bold shadow-md shadow-rose-300': isSelected }"
  >
    <component
      class="scale-[0.70] cursor-pointer pr-1 transition-colors"
      :class="{ 'fill-rose-400': isSelected }"
      :is="icons[icon]"
    ></component>

    <span>{{ butText }}</span>
  </button>
</template>
