<script setup lang="ts">
const props = defineProps<{
  name: string
  description?: string
  toggled: boolean
}>()

const emit = defineEmits<{ (e: 'update:toggled', val: boolean): void }>()

const value = computed({
  get() {
    return props.toggled
  },
  set(v) {
    emit('update:toggled', v)
  },
})
</script>

<template>
  <fieldset class="grid grid-cols-6 grid-rows-1 my-1 items-center">
    <label
      class="grid-col-span-3 grid-col-start-4 grid-row-start-1 font-semibold"
      :class="[toggled ? 'text-tx-title' : 'text-tx-faint opacity-60']"
    >
      {{ name }}
    </label>
    <div
      class="relative grid-col-start-2 h-1.25rem w-2.5rem flex flex-row items-center transition-all"
      @click="value = !value"
    >
      <div class="left-0 top-1rem h-1rem w-2.5rem rounded-3xl bg-back" />
      <div
        class="absolute top-0 h-1.25rem w-1.25rem rounded-full bg-black shadow-primShadow shadow-sm"
        :class="[toggled ? 'toggle-on bg-tx-title' : 'toggle-off bg-gray-4']"
      />
    </div>
  </fieldset>
</template>

<style scopeed>
.toggle-on {
  left: 1.25rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.toggle-off{
  left: 0rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
