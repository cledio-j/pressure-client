<script setup lang="ts">
import { useDataStore } from './stores/data'

const dataStore = useDataStore()
const { getData } = useServerData()

onMounted(
  () => {
    if (!dataStore.ready)
      getData()
  })
</script>

<template>
  <main>
    <NotificationHandler />
    <RouterView />
  </main>
</template>
