<script setup lang="ts">
import { useServerData } from '~/composables/serverData'
import { useDataStore } from '~/stores/data'

const dataStore = useDataStore()

const repository = useServerData()
</script>

<template>
  <article>
    <div v-if="dataStore.ready" class="mb-2 flex flex-col gap-2 pb-2">
      <h1 class="mx-1 font-bold text-tx">
        {{ $t('settings.latest') }}
      </h1>
      <LatestEntriesDisplay
        :items="dataStore.latest"
        @reading-changed="repository.patchReading"
        @delete-reading="repository.deleteReading"
      />
    </div>
    <div v-else class="grid grid-cols-1 mt-12 w-full place-items-center">
      <BaseLoadingSpinner />
    </div>
  </article>
</template>
