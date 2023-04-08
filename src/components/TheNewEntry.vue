<script setup lang="ts">
import { type Ref, inject, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDayTime, getTodayIsoStr } from '../utils/dateUtils'
import { invalidResponse, networkError, notAuthorized } from '../utils/errors'
import { authStore, errorStore, useDataStore } from '../store'
import camera from '../assets/svg/camera.svg?component'
import expand_more from '../assets/svg/expand-more.svg?component'
import OcrInput from './OcrInput.vue'
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import ReadingInputForm from './ReadingInputForm.vue'
import TransitionSlideFadeUp from './TransitionSlideFadeUp.vue'

import BaseIconButton from './BaseIconButton.vue'

const emits = defineEmits<{
  (e: 'interface:collapse', fn: () => void): void
}>()

const { t } = useI18n()

const dataStore = useDataStore()

const apiUrl = inject('apiUrl')

const input: ReadingInput = reactive(getInitial())

const reset = ref(false)
const collapsed = ref(false)
const waitingForFetch = ref(false)
const angryButton = ref(false)
const animatingSymbol = ref(false)
const needValidation = ref(false)
const wantOcr = ref(false)
const entryForm = ref() as Ref<HTMLFormElement>

const resetFn = ref<() => void | undefined>()

function doReset() {
  Object.assign(input, getInitial())
  reset.value = !reset.value
  resetFn.value && resetFn.value()
}

function getInitial() {
  return {
    systolic_bp: 0,
    diastolic_bp: 0,
    heart_rate: 0,
    timestamp: getTodayIsoStr(),
    day_time: getDayTime(),
  }
}

function makeRequestBody() {
  return {
    timestamp: input.timestamp,
    systolic_bp: input.systolic_bp,
    diastolic_bp: input.diastolic_bp,
    heart_rate: input.heart_rate,
    day_time: input.day_time,
  }
}

function validateReadings() {
  const allValid = [input.diastolic_bp, input.systolic_bp, input.heart_rate].every((e) => {
    if (e == null || e <= 0)
      return false
    else return true
  })
  return allValid
}

async function handleSubmit() {
  if (!authStore.authorized || !authStore.token) {
    errorStore.newError(notAuthorized(t, handleSubmit))
    return
  }
  if (!validateReadings()) {
    angryButton.value = true
    needValidation.value = true
    setTimeout(() => (angryButton.value = false), 500)
    return
  }
  waitingForFetch.value = true
  try {
    const res = await fetch(`${apiUrl}reading/put`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(makeRequestBody()),
    })
    if (res) {
      if (!res.ok) {
        errorStore.newError(
          invalidResponse(t, handleSubmit, res))
      }
      else {
        const data = await res.json()
        dataStore.addReading(data.reading)
        doReset()
      }
    }
  }
  catch (_error) {
    // fetch only throws on network error
    errorStore.newError(networkError(t, handleSubmit))
  }
  waitingForFetch.value = false
}

function switchOcr() {
  if (collapsed.value && !wantOcr.value)
    collapsed.value = false
  wantOcr.value = !wantOcr.value
  animatingSymbol.value = true
  setTimeout(() => {
    animatingSymbol.value = false
  }, 300)
}

function collapse() {
  collapsed.value = true
}
onMounted(() => {
  emits('interface:collapse', collapse)
})

function handleOCR(result: ImageResult) {
  input.systolic_bp = result.systolic_bp.result
  input.diastolic_bp = result.diastolic_bp.result
  input.heart_rate = result.pulse.result
  switchOcr()
}
</script>

<template>
  <div
    class="container mt-1 bg-gradient-to-l from-rose-100 via-rose-50 to-rose-100 shadow-md shadow-gray-300 transition-all duration-300"
    :class="{ 'do-magic ease-out': collapsed, 'h-22-5 ease-in': !collapsed }"
  >
    <div class="grid grid-cols-4 justify-items-center py-2">
      <h1
        class="col-span-2 ml-2 justify-self-start text-2xl lg:col-span-1 lg:justify-self-end select-none" @click="collapsed = !collapsed"
      >
        {{ $t("controls.new_entry") }}
      </h1>
      <button
        class="material-symbols-outlined justify-self-center text-3xl hover:text-gray-700"
        aria-label="toggle image input"
        :class="{
          'animate-pulse fill-blue-800 hover:fill-blue-600': wantOcr,
          'shake': animatingSymbol,
        }"
        @click="switchOcr()"
      >
        <camera class="scale-75" />
      </button>
      <button
        class="mr-2 justify-self-end text-2xl"
        aria-label="toggle collapse"
        @click="collapsed = !collapsed"
      >
        <expand_more
          class="transition-all"
          :class="{ 'rotate-180 ease-in': !collapsed }"
        />
      </button>
    </div>

    <TransitionSlideFadeUp>
      <div v-if="!collapsed">
        <form
          v-if="!wantOcr"
          ref="entryForm"
          method="dialog"
          class="grid w-full justify-center p-2"
          @submit.prevent="handleSubmit"
        >
          <ReadingInputForm
            :data="input"
            :modified="false"
            @interface:reset="(fn) => resetFn = fn"
          />
          <div class="my-2 grid grid-cols-3">
            <button class="ml-4 h-10 justify-self-start rounded-md p-0">
              <BaseIconButton
                icon="undo"
                label="reset form"
                @click.prevent="doReset"
              />
            </button>
            <button
              type="submit"
              class="mr-1 h-10 w-32 justify-self-end rounded-md bg-rose-200 px-4 text-lg font-semibold hover:bg-rose-300"
              :class="{ 'be-angry': angryButton }"
            >
              <span v-if="!waitingForFetch">{{ $t("controls.enter") }}</span>
              <span v-else><BaseLoadingSpinner /></span>
            </button>
          </div>
        </form>
        <OcrInput v-else @has-result="handleOCR" />
      </div>
    </TransitionSlideFadeUp>
  </div>
</template>

<style scoped>
.do-magic {
  height: 50px;
}
.h-22-5 {
  height: 22.5rem;
}
.shake {
  animation: shake 0.22s ease-out;
}

@keyframes shake {
  50% {
    transform: scale(1.15, 1.15);
  }
}
@keyframes be-angry {
  50% {
    transform: scale(1.1, 1.11);
    background-color: red;
  }
  75% {
    transform: scale(1.05, 1.05);
    background-color: rgb(252, 130, 130);
  }
}

.be-angry {
  transition: all;
  animation: be-angry 0.22s ease-out;
}
</style>
