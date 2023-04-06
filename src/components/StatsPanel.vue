<script setup lang="ts">
import { ref } from 'vue'
import StatsMinMax from './StatsMinMax.vue'
import StatsGraphs from './StatsGraphs.vue'

const showMinMax = ref(true)
const showGraph = ref(false)
</script>

<template>
  <div class="grid grid-cols-1">
    <div class="mb-1 grid grid-cols-2">
      <button
        class="border-r border-r-rose-900 shadow-sm shadow-gray-400 transition-all"
        :class="{ 'bg-gradient-to-l from-rose-200 to-white shadow-rose-400': !showGraph }"
        @click="showGraph = false"
      >
        <h2 class="justify-self-center py-1 font-sans text-xl font-semibold text-rose-900">
          {{ $t("header.min_max") }}
        </h2>
      </button>
      <button
        class="border-l border-l-rose-900 shadow-sm shadow-gray-400 transition-all"
        :class="{ 'bg-gradient-to-r from-rose-200 to-white shadow-rose-400': showGraph }"
        @click="showGraph = true"
      >
        <h2 class="justify-self-center font-sans text-xl font-semibold text-rose-900">
          {{ $t("messages.graphs") }}
        </h2>
      </button>
    </div>
    <StatsMinMax
      v-if="!showGraph"
      v-show="showMinMax"
      class="justify-self-center"
    />
    <StatsGraphs
      v-else
      class="transition-all"
    />
  </div>
</template>

<style></style>
