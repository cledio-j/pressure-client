<script setup lang="ts" generic="T">
const props = defineProps<{
  modelValue: T[]
  options: Readonly<T[]>
  localLabels: string[]
}>()

const emits = defineEmits<{ (e: 'update:modelValue', arr: T[]): void }>()

const state = ref([...props.modelValue]) as Ref<T[]>

function flipOption(opt: T) {
  const idx = state.value.findIndex(v => v === opt)
  if (idx === -1)
    state.value.push(opt)
  else
    state.value.splice(idx, 1)
  emits('update:modelValue', state.value)
}
</script>

<template>
  <fieldset class="">
    <button
      v-for="(opt, idx) in options" :key="idx" type="button"
      class="rounded-md p-1 ring transition-all duration-100"
      :class="{
        'bg-back-light ring-primary-light  text-tx ring-3': modelValue.includes(opt),
        'bg-back-offwhite text-tx-faint ring-tx-faint ring-1': !modelValue.includes(opt),
      }"
      @click="flipOption(opt)"
    >
      {{ localLabels[idx] }}
    </button>
    <button
      class="font-semibold underline" type="button"
      @click="$emit('update:modelValue', options); state = [...options]"
    >
      {{ $t('controls.all') }}
    </button>
  </fieldset>
</template>
