<script setup lang="ts">
import type { NewReading } from 'api'
import { getDayTime, getLocalISO } from '../utils/dates'
import { VAL_KEYS } from '~/const'

const { settings } = useSettings()
const repository = useServerData()

const dtOptions = settings.value.daytimeOptions

function getState(): NewReading {
  return {
    timestamp: getLocalISO(),
    systolic_bp: undefined,
    diastolic_bp: undefined,
    heart_rate: undefined,
    day_time: getDayTime(),
  }
}

const formState = ref<NewReading>(getState())

async function submit() {
  repository.putReading(formState.value).then(() => {
    formState.value = getState()
  })
}

function setYesterday() {
  const yesterday = new Date(formState.value.timestamp)
  yesterday.setDate(yesterday.getDate() - 1)
  formState.value.timestamp = getLocalISO(yesterday)
}

function setTime(t: string) {
  const [hours, mins] = t.split(':', 2)
  const newTime = new Date(formState.value.timestamp)
  newTime.setHours(Number.parseInt(hours), Number.parseInt(mins))
  formState.value.timestamp = getLocalISO(newTime)
  formState.value.day_time = getDayTime(new Date(formState.value.timestamp).getHours())
}

function getLocalePair(local: string, value: string) {
  return { local, value }
}

const shortcuts = settings.value.timeShortcuts
</script>

<template>
  <form class="max-w-sm flex flex-col justify-center">
    <fieldset class="mt-2 flex flex-col place-items-center">
      <div class="border border-back-light border-dashed py-1">
        <div class="grid grid-cols-12 mb-2 place-items-center gap-2">
          <button
            type="button"
            class="col-span-2 col-start-2 border rounded-full bg-back-light p-1" @click="setYesterday"
          >
            <div class="i-ms-west scale-125 text-primary" />
          </button>
          <BaseDateInput
            v-model:model-value="formState.timestamp"
            class="col-span-6 col-start-4" type="datetime-local" label=""
          />
          <button
            type="button" class="col-start-11 text-primary-dark underline"
            @click="formState.timestamp = getLocalISO()"
          >
            {{ $t('controls.now') }}
          </button>
        </div>
        <menu class="flex flex-row justify-center gap-2">
          <button
            v-for="shortcut in shortcuts" :key="shortcut"
            class="py-1 text-sm text-tx-title btn"
            type="button" @click="setTime(shortcut)"
          >
            {{ shortcut }}
          </button>
        </menu>
      </div>
      <template
        v-for="k in VAL_KEYS" :key="k"
      >
        <BaseInput v-model:val="formState[k]" type="number" :label="$t(`header.${k}`)" />
      </template>
      <BaseSelect
        v-model="formState.day_time"
        class="mt-4 w-12rem" :label="$t('daytime.daytime')"
        :options="dtOptions.map(o => getLocalePair($t(`daytime.${o}`), o))"
      />
    </fieldset>
    <menu
      class="mt-2 flex flex-row place-items-center justify-between border-t border-dashed px-4 py-1"
    >
      <button
        type="button" class="border rounded-full bg-back-light p-1"
        @click="formState = getState()"
      >
        <div class="i-ms-undo text-2xl text-primary" />
      </button>
      <button
        type="submit"
        class="my-1 text-tx btn"
        @click.stop.prevent="submit"
      >
        {{ $t('controls.enter') }}
      </button>
    </menu>
  </form>
</template>
