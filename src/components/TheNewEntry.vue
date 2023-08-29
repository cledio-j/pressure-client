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
  <div class="">
    <header class="flex flex-row items-center justify-between border-b bg-back-light py-1">
      <h1
        class="px-2 pt-1 text-xl font-semibold text-tx-title"
        @click="expanded = !expanded"
      >
        {{ $t('controls.new_entry') }}
      </h1>
      <button type="button" class="border rounded-full bg-white p-1.5">
        <div class="i-ms-photo-camera text-lg text-primary" />
      </button>
      <BaseExpandButton @toggle-expand="expanded = !expanded" />
    </header>
    <ReadingInputForm v-if="expanded" @new-reading="handleNew" @error="handleError" />
  </div>
</template>
