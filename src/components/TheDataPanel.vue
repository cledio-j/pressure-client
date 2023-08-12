<script setup lang="ts">
import DataTableEntries from './DataTableEntries.vue'
import { useDataStore } from '~/stores/data'

const dataStore = useDataStore()
</script>

<template>
  <div>
    <DataTableEntries :readings="dataStore.data" />
  </div>
</template>
