<script setup lang="ts">
const showGraph = ref(false)
const showMinMax = ref(false)
</script>

<template>
  <div class="grid grid-cols-1">
    <div class="grid grid-cols-2 mb-1">
      <button
        class="border-r border-r-rose-900 shadow-gray-400 shadow-sm transition-all"
        :class="{ 'bg-gradient-to-l from-back to-white shadow-primary': !showGraph }"
        @click="showGraph = false"
      >
        <h2 class="justify-self-center py-1 text-xl font-semibold font-sans text-tx-title">
          {{ $t("header.min_max") }}
        </h2>
      </button>
      <button
        class="border-l border-l-rose-900 shadow-gray-400 shadow-sm transition-all"
        :class="{ 'bg-gradient-to-r from-back bg-opacity-50 to-white shadow-primary': showGraph }"
        @click="showGraph = true"
      >
        <h2 class="justify-self-center text-xl font-semibold font-sans text-tx-title">
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
