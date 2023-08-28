<script setup lang="ts">
import { useDataStore } from './stores/data'

const dataStore = useDataStore()
const repository = useServerData()

onMounted(
  () => {
    if (dataStore.ready)
      repository.getData()
  })
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
