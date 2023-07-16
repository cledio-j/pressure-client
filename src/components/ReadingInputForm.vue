<script setup lang="ts">
import type { NewReadingResponse, Reading, ValueKey } from 'api'
import { getDayTime, getLocalISO } from '../utils/dates'
import type { FetchError } from '~/composables/fetch'

const emit = defineEmits<{
  (e: 'error', err: FetchError): void
  (e: 'newReading', reading: Reading): void
}>()

function getState() {
  return {
    timestamp: getLocalISO(),
    systolic_bp: undefined,
    diastolic_bp: undefined,
    heart_rate: undefined,
    day_time: getDayTime(),
  }
}

const formState = ref(getState())

async function submit() {
  const { data, error } = await useFetch<NewReadingResponse>(
    'reading/put',
    { auth: true, method: 'PUT', immediate: true, body: JSON.stringify(formState.value) },
  )
  if (error && error.value) {
    emit('error', error.value)
    return
  }
  const result = await data.value
  if (result && result.success)
    emit('newReading', result.reading)
}
</script>

<template>
  <form class="max-w-sm flex flex-col justify-center">
    <fieldset class="mt-1 flex flex-col items-center">
      <BaseDateInput v-model:model-value="formState.timestamp" type="datetime-local" label="" />
      <template
        v-for="k in (['systolic_bp', 'diastolic_bp', 'heart_rate'] as ValueKey[])" :key="k"
      >
        <BaseInput v-model:val="formState[k]" type="number" :label="$t(`header.${k}`)" />
      </template>
    </fieldset>
    <menu class="mx-4 mt-1 flex flex-row justify-between">
      <button type="button" @click="formState = getState()">
        <div class="i-ms-undo text-2xl text-tx-title" />
      </button>
      <button
        type="submit"
        class="m-1 bg-light px-4 py-2 font-semibold text-tx-title shadow-primShadow shadow-sm hover:bg-back-light"
        @click.stop.prevent="submit"
      >
        {{ $t('controls.enter') }}
      </button>
    </menu>
  </form>
</template>
