<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BetterInputField from './BetterInputField.vue'
import BaseDateInput from './BaseDateInput.vue'
import ReadingDaytimeInput from './ReadingDaytimeInput.vue'

const props = defineProps<{
  data: Reading | ReadingInput
  modified: boolean
  frozen?: boolean
}>()

const emits = defineEmits<{
  (e: 'reset', data: Reading): void
  (e: 'interface:reset', fn: () => void): void
  (e: 'update:data', data: Reading | ReadingInput): void
}>()

const modelValue = computed({
  get() {
    return props.data
  },
  set(data) {
    emits('update:data', data)
  },
})

const inputFieldResetFns: (() => void)[] = []

function reset() {
  inputFieldResetFns.forEach(reset => reset())
}

onMounted(() => {
  emits('interface:reset', reset)
})
</script>

<template>
  <div
    class="ml-2 grid grid-flow-row w-full"
    :class="{ 'border-gray-600 bg-gray-200': modified }"
  >
    <BaseDateInput
      v-model="modelValue.timestamp"
      :frozen="frozen"
    />
    <template v-for="str in ['systolic_bp', 'diastolic_bp', 'heart_rate']" :key="str">
      <BetterInputField
        v-model="modelValue[str as ReadingValStr]"
        :frozen="frozen"
        :name="$t(`header.${str}`)"
        @interface="(fn) => inputFieldResetFns.push(fn)"
      />
    </template>
    <ReadingDaytimeInput
      v-model="modelValue.day_time"
      :frozen="frozen"
    />
  </div>
</template>
