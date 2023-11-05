<script setup lang="ts">
import type { Reading } from 'api'
import { VAL_KEYS } from '~/const'

const props = defineProps<{
  reading: Reading
}>()
defineEmits<{ (e: 'close'): void }>()
const thisReading = ref<Reading>({ ...props.reading })

async function handleReset(reset: () => void) {
  thisReading.value = { ...props.reading }
  await nextTick()
  reset()
}
</script>

<template>
  <div>
    <ReadingInputForm :initial="thisReading">
      <template #botMenu="slotProps">
        <menu class="mt-2 min-h-3.5rem flex flex-row items-center justify-between border-b border-t border-dashed">
          <button
            type="button" class="flex flex-row items-center border rounded-full bg-white p-1"
            @click="handleReset(slotProps.reset)"
          >
            <div class="i-ms-undo text-2xl text-primary" />
            <span class="text-sm text-tx-secondary">{{ $t('controls.reset') }}</span>
          </button>
          <button
            v-if="VAL_KEYS.some(v => reading[v] !== slotProps.state[v])
              || reading.timestamp !== slotProps.state.timestamp
              || reading.day_time !== slotProps.state.day_time"
            class="flex-rowrounded-md mx-3 my-1 max-w-15rem flex bg-white p-0 text-start shadow-info shadow-sm outline-info outline btn"
          >
            <div class="i-ms-info-outline mx-1 text-4xl text-info" />
            <span class="text-sm text-info">{{ $t('controls.unsavedChanges') }}</span>
          </button>
          <span v-else class="mx-5 text-end text-sm text-tx-faint">
            {{ $t('controls.changeHere') }}
          </span>
          <!-- <button
            v-else
            type="button"
            class="mx-3 bg-white text-primary shadow-info outline-primary outline btn hover:bg-back-offwhite"
            @click="$emit('close')"
          >
            {{ $t('controls.close') }}
          </button> -->
        </menu>
      </template>
    </ReadingInputForm>
    <ReadingWeatherCard class="mb-1" :weather="thisReading.weather" />
  </div>
</template>
