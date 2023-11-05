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
  <main class="min-h-100svh bg-light-200 container md:mx-auto">
    <NotificationHandler />
    <RouterView />
  </main>
</template>

<style>
html {
  background-color: rgba(255, 255, 255);
}
</style>
