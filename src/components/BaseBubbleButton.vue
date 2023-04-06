<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

const props = defineProps<{ icon: FunctionalComponent; toggleFn: () => void; active: boolean }>()
</script>

<template>
  <button
    class="rounded-full bg-rose-300 bg-opacity-80"
    :class="{ 'ring ring-rose-400': active }"
    @click="toggleFn"
  >
    <component
      :is="icon"
      class="scale-75 fill-white"
    />
  </button>
</template>
