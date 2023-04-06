<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fixTZ, xDaysAgo, xDaysFromNow } from '../utils/dateUtils'

// Exposes interface to allow resetting from parent

const props = defineProps<{
  fromDateMinus: number
  toDatePlus: number
  buttonVals?: number[]
}>()

const emits = defineEmits<{
  (e: 'interface', fn: () => void): void
  (e: 'newDate', newVal: string, field: string): void
}>()

const from = ref(fixTZ(xDaysAgo(props.fromDateMinus)))
const to = ref(fixTZ(xDaysFromNow(props.toDatePlus)))

function reset() {
  from.value = xDaysAgo(props.fromDateMinus).toISOString().substring(0, 16)
  to.value = xDaysFromNow(props.toDatePlus).toISOString().substring(0, 16)
}

function setFormTo(num: number) {
  from.value = fixTZ(xDaysAgo(num))
  to.value = fixTZ(xDaysFromNow(props.toDatePlus))
  emits('newDate', from.value, 'from')
  emits('newDate', to.value, 'to')
}

onMounted(() => {
  emits('interface', reset)
})
</script>

<template>
  <div>
    <slot>
      <!-- Header/Title -->
    </slot>
    <div v-if="buttonVals">
      <div class="flex flex-row gap-2 justify-between mb-2">
        <span class="pt-1">{{ $t("messages.last") }}</span>
        <button
          v-for="num in buttonVals"
          :key="num"
          class="p-1 text-rose-500 rounded-xl shadow-md shadow-rose-100 hover:bg-gray-100"
          @click="setFormTo(num)"
        >
          {{ `${num} ${$t("messages.days")}` }}
        </button>
      </div>
    </div>
    <fieldset>
      <div class="grid grid-rows 2">
        <div class="grid grid-cols-4">
          <label for="input-from" class="col col-form-label align-middle p-1">{{ $t("controls.from")
          }}</label>
          <input
            id="input-from"
            v-model="from"
            class="col-span-3 bg-pink-50 p-1 ring-rose-200 ring-2 rounded-sm focus:ring-rose-400 outline-none text-center"
            type="datetime-local" required
            @change.stop="$emit('newDate', from, 'from')"
          >
        </div>
        <div class="grid grid-cols-4 mt-2">
          <label class="p-1" for="input-to">{{ $t("controls.to") }}</label>
          <input
            id="input-to"
            v-model="to" class="col-span-3 bg-pink-50 p-1 ring-rose-200 ring-2 rounded-sm focus:ring-rose-400 outline-none text-center" type="datetime-local" required
            @change.stop="$emit('newDate', to, 'to')"
          >
        </div>
      </div>
    </fieldset>
  </div>
</template>
