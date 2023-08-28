<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label: string
}>()

const emits = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const value = computed({
  get() { return props.modelValue },
  set(v) { emits('update:modelValue', v) },
})
</script>

<template>
  <fieldset class="flex flex-row items-center gap-3">
    <label class="" :for="label">
      <span class="align-middle">{{ label }}</span>
    </label>
    <input
      :id="label" v-model="value" type="checkbox"
      class="scale-125"
    >
  </fieldset>
</template>

<style scoped>
fieldset > label {
  white-space: nowrap;
}
</style>
