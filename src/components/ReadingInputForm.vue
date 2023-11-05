<script setup lang="ts">
import type { NewReading, Reading } from 'api'
import { getDayTime, getLocalISO } from '../utils/dates'
import { VAL_KEYS } from '~/const'

const props = defineProps<{ initial?: Reading }>()

const { settings } = useSettings()
const repository = useServerData()

const dtOptions = settings.daytimeOptions

function getState(): NewReading {
  if (props.initial) {
    return props.initial
  }
  else {
    return {
      timestamp: getLocalISO(),
      systolic_bp: undefined,
      diastolic_bp: undefined,
      heart_rate: undefined,
      day_time: getDayTime(),
    }
  }
}

const formState = ref<NewReading>(getState())

const valid = reactive({
  systolic_bp: true,
  diastolic_bp: true,
  heart_rate: true,
})

function validate() {
  const inRange = (range: [number, number], value?: number) => {
    if (!value)
      return false
    return value >= range[0] && value <= range[1]
  }
  for (const val of VAL_KEYS)
    valid[val] = inRange(settings.ranges[val], formState.value[val])
}

async function submit() {
  validate()
  if (!Object.values(valid).every(Boolean))
    return
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

function reset() {
  formState.value = getState()
}

const shortcuts = settings.timeShortcuts
</script>

<template>
  <form class="max-w-sm flex flex-col">
    <fieldset class="mt-2 flex flex-col place-items-center">
      <div class="border border-back-light border-dashed py-1">
        <div class="grid grid-cols-6 mx-2 mb-2 justify-items-start gap-2">
          <button
            type="button" aria-label="Set day before"
            class="col-span-1 col-start-1 border rounded-full bg-back-light p-1" @click="setYesterday"
          >
            <div class="i-ms-west text-2xl text-primary" />
          </button>
          <BaseDateInput
            v-model:model-value="formState.timestamp"
            class="col-span-3 col-start-2" type="datetime-local" label=""
          />
          <button
            type="button" class="col-start-6 text-primary-dark underline"
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
        <BaseInput
          v-model:val="formState[k]" type="number" :label="$t(`header.${k}`)"
          :class="{ ' shadow-sm shadow-error': !valid[k] }"
        >
          <div v-if="!valid[k]" class="i-ms-warning-outline absolute right-5 top-5 text-xl text-error" />
        </BaseInput>
      </template>
      <BaseSelect
        v-model="formState.day_time"
        class="mt-4 w-12rem" :label="$t('daytime.daytime')"
        :options="dtOptions.map(o => getLocalePair($t(`daytime.${o}`), o))"
      />
    </fieldset>
    <slot name="botMenu" :state="formState" :reset="reset">
      <menu
        class="mt-2 flex flex-row place-items-center justify-between border-t border-dashed from-white to-back-light bg-gradient-to-b px-4 py-1"
      >
        <button
          type="button" aria-label="Reset form" class="border rounded-full bg-white p-1"
          @click="reset"
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
    </slot>
  </form>
</template>
