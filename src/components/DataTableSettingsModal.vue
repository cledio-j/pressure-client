<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Undo from '../assets/svg/undo.svg?component'
import Check from '../assets/svg/check.svg?component'
import BaseModal from './BaseModal.vue'
import BaseFromToDatePicker from './BaseFromToDatePicker.vue'
import { useBreakpoints } from '@/composables/breakpoints'

const props = defineProps<{
  showing: boolean
  fromDateMinus: number
  toDatePlus: number
}>()

const emits = defineEmits<{
  (e: 'newSettings', headers: any): void
  (e: 'close'): void
}>()

let childInterface: () => void
const online = ref(navigator.onLine)
const { width } = useBreakpoints()
const isMobile = computed(() => {
  return width.value < 640
})

const initialHeaders = [
  { name: 'date', show: true },
  { name: 'time', show: true },
  { name: 'timestamp', show: false },
  { name: 'systolic_bp', show: true },
  { name: 'diastolic_bp', show: true },
  { name: 'heart_rate', show: true },
  { name: 'day_time', show: true },
  { name: 'user_id', show: false },
  { name: 'id', show: false },
  { name: 'weather', show: false },
]
Object.freeze(initialHeaders)

const headers = ref(structuredClone(initialHeaders))

function reset() {
  headers.value = structuredClone(initialHeaders)
  childInterface()
  emits('newSettings', headers.value)
}
function getChildInterface(resetFn: () => void) {
  // grabbing child method
  childInterface = resetFn
}
onMounted(() => {
  emits('newSettings', headers.value)
})
</script>

<template>
  <BaseModal
    :showing="showing"
    @close="$emit('close')"
  >
    <h1
      class="curso my-1 border-b border-dashed border-rose-300 pb-1 text-2xl font-semibold text-red-900"
    >
      {{ $t("messages.settings") }}
    </h1>
    <div>
      <fieldset
        class=""
        @change="$emit('newSettings', headers)"
      >
        <legend class="text-lg font-semibold text-red-900">
          {{ $t("messages.choose_header") }}
        </legend>
        <div class="ml-2 grid grid-cols-2">
          <template v-for="item in headers" :key="item.name">
            <div>
              <input
                :id="`input-${item.name}`"
                v-model="item.show"
                type="checkbox"
                class="accent-red-400"
              >
              <label class="pl-1" :for="`input-${item.name}`">
                {{ $t(`header.${item.name}`) }}
              </label>
            </div>
          </template>
        </div>
      </fieldset>
    </div>
    <h5 class="text-lg font-semibold text-red-900">
      {{ online ? $t("controls.filter_by_date") : $t("messages.offline_not_avail") }}
    </h5>
    <BaseFromToDatePicker
      v-if="online"
      class="my-1"
      :from-date-minus="fromDateMinus"
      :to-date-plus="toDatePlus"
      @interface="getChildInterface"
    />
    <div class="mt-2 grid grid-cols-3">
      <button class="justify-self-start rounded-md p-0 align-middle" @click="reset">
        <Undo
          class="fill-gray-600 hover:fill-gray-500"
          label="reset-form"
          icon="undo"
        />
      </button>
      <button
        class="rounded-md p-0 align-middle col-start-3 mr-4 justify-self-end"
        @click="$emit('close')"
      >
        <Check class="fill-green-700 hover:fill-green-500 hover:scale-110 transition-all" />
      </button>
    </div>
  </BaseModal>
</template>
