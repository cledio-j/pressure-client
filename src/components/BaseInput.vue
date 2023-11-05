<script setup lang="ts" generic="T">
const props = defineProps<{
  label: string
  type: FieldType
  val: T
}>()

const emits = defineEmits<{ (e: 'update:val', val: T): void }>()

type FieldType = 'number' | 'text' | 'url' | 'password'

const filled = computed(() => {
  if (props.val === 0)
    return true
  return Boolean(props.val)
})

const value = computed({
  get() {
    return props.val
  },
  set(v) {
    emits('update:val', v)
  },
})
</script>

<template>
  <fieldset
    class="relative max-h-[3.5rem] flex flex-row items-center overflow-hidden scroll-initial border-b text-lg transition-all"
  >
    <input
      :id="label"
      v-model="value"
      class="w-full rounded-1 bg-back-light py-0.5 pl-1 text-primary-dark outline-none transition-all focus:bg-back"
      :class="{ 'mt-4': label }"
      :type="type"
      :aria-labelledby="`${label}extra`"
      :filled="filled"
    >
    <slot>
      <!-- additional content -->
    </slot>
    <label
      v-if="label"
      :id="`${label}extra`"
      class="absolute left-1 top-4.5 text-tx-faint transition-all duration-200"
      :for="label"
    >{{ label }}
    </label>
  </fieldset>
</template>

<style scoped>
fieldset {
  border-bottom-color: var(--c-bg)  ;
}
fieldset:has(input:focus) {
  border-bottom-color: var(--c-primary);
}
:where(input:focus, input[filled=true]) ~ label {
  transform: translateY(-1.5rem);
  z-index: 44;
  font-size: small;
}
</style>
