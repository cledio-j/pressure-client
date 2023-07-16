<script setup lang="ts">
import type { Reading } from 'api'
import { useDataStore } from '~/stores/data'

const expanded = ref(true)
const dataStore = useDataStore()

function handleNew(reading: Reading) {
  reading.timestamp.slice(0, -3)
  dataStore.insertReading(reading)
}

function handleError() {}
</script>

<template>
  <div>
    <header class="flex flex-row items-center justify-between">
      <h1 class="px-2 pt-1 text-xl font-semibold text-tx-title">
        {{ $t('controls.new_entry') }}
      </h1>
      <button>
        <div class="i-ms-photo-camera text-lg text-primary-dark" />
      </button>
      <BaseExpandButton @toggle-expand="expanded = !expanded" />
    </header>
    <ReadingInputForm v-if="expanded" @new-reading="handleNew" @error="handleError" />
  </div>
</template>
