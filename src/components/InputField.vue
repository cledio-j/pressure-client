<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  reset: boolean
  wantValidate: boolean
}>()

const emits = defineEmits<{
  (e: 'change', newVal: number, val: boolean): void
}>()

const content: Ref<number | null> = ref(0)
const changed = ref(false)
const validated = ref('initial')

function report() {
  changed.value = true
  const val = validate()
  if (!content.value)
    content.value = 0
  emits('change', content.value, val)
}

function validate() {
  if (content.value == null || content.value <= 0) {
    validated.value = 'error'
    return false
  }
  else if (content.value < 40 || content.value > 200) {
    validated.value = 'warn'
    return true
  }
  else {
    validated.value = 'yes'
    return true
  }
}

watch(
  () => props.reset,
  () => {
    validated.value = 'initial'
    changed.value = false
    content.value = 0
  },
)
watch(
  () => props.wantValidate,
  () => validate(),
)
</script>

<template>
  <div class="grid grid-cols-3 mb-2 gap-2 justify-items-center">
    <label
      class="relative text-md font-medium text-gray-900 p-2 justify-self-end"
      for="sysInput"
    >{{ name }}
      <span
        v-if="validated === 'error'"
        class="absolute top-2 -right-44 material-symbols-outlined text-red-800"
      >warning</span></label>
    <input
      id="sysInput"
      v-model="content"
      type="number"
      class="p-1 border border-gray-300 rounded-lg bg-gray-50 w-full justify-self-center col-start-2 col-span-2 lg:col-span-1"
      :class="{
        'bg-red-300': validated === 'error',
        'bg-green-200': validated === 'yes',
        'bg-yellow-200': validated === 'warn',
        'bg-gray-50': validated === 'initial',
      }"
      @focusout="report"
      @focusin="!content ? (content = null) : (content = content)"
    >
  </div>
</template>
