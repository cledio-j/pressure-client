<script setup lang="ts">
import { type Ref, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  labelstr: string
  inputType?: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', neVal: string): void
}>()

const lbl = ref() as Ref<HTMLLabelElement>

function moveLabel() {
  lbl.value.classList.add('focused')
}
function resetLabel() {
  if (!props.modelValue)
    lbl.value.classList.remove('focused')
}
</script>

<template>
  <div class="form-group relative">
    <input
      :id="labelstr"
      :type="inputType ? inputType : 'text'"
      class="h-8 rounded-sm border border-gray-600"
      :value="modelValue"
      required
      @focusin="moveLabel"
      @focusout="resetLabel"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <label
      ref="lbl"
      class="absolute left-1 top-1 text-gray-500 transition-all duration-200"
      :for="labelstr"
    >{{ labelstr }}</label>
  </div>
</template>

<style scoped>
.focused {
  transform: translateY(-21px);
  z-index: 44;
  font-size: small;
}
</style>
