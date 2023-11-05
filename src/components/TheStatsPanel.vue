<script setup lang="ts">
import { useDataStore } from '~/stores/data'

const dataStore = useDataStore()
</script>

<template>
  <article class="grid grid-cols-1">
    <h1 class="mx-1 pb-1 font-bold text-tx">
      {{ $t('header.statistics') }}
    </h1>
    <StatsGraphs
      v-if="dataStore.hasAllData"
      :data="dataStore.data"
      class="transition-all"
    />
    <div v-else class="flex flex-row items-center">
      <BaseLoadingSpinner />
    </div>
    <!-- <StatsMinMax
      class="justify-self-center"
    /> -->
  </article>
</template>
