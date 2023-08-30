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
  <main class="mx-auto justify-center bg-light-200 container">
    <NotificationHandler />
    <RouterView />
  </main>
</template>
