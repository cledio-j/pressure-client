<script setup lang="ts">
</script>

<template>
  <article class="grid grid-cols-1">
    <h1 class="mx-1 pb-1 font-bold text-tx">
      {{ $t('header.statistics') }}
    </h1>
    <StatsGraphs
      class="transition-all"
    />
    <StatsMinMax
      class="justify-self-center"
    />
  </article>
</template>
