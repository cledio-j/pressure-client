<script setup lang="ts">
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import { type FetchError } from '~/composables/fetch'
import { useServerData } from '~/composables/serverData'
import { useDataStore } from '~/stores/data'
import type { Reading } from '~/types/api'

const dataStore = useDataStore()
const errors = ref<FetchError[]>([])

const repository = useServerData()

async function handleDelete(reading: Reading) {
  const { deleted, errors: deleteErrors } = await useDelete(reading)
  if (deleteErrors.value.length > 0) {
    errors.value.push(...deleteErrors.value)
    return
  }
  const idx = dataStore.findIndex(deleted)
  console.error(idx)
}
</script>

<template>
  <article
    v-if="dataStore.ready"
    class="new-shadow relative mb-2 flex flex-col gap-2 pb-2 transition-all"
  >
    <h1 class="mx-1 font-bold text-tx">
      {{ $t('settings.latest') }}
    </h1>
    <LatestEntriesDisplay
      :items="dataStore.latest"
      @reading-changed="repository.patchReading"
      @delete-reading="handleDelete"
    />
  </article>
  <div v-else class="grid grid-cols-1 mt-12 w-full place-items-center">
    <BaseLoadingSpinner />
  </div>
</template>
