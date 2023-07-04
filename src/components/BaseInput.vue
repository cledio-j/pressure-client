<script setup lang="ts" generic="T">
const props = defineProps<{ label: string; type: FieldType; val: T; classes?: string }>()
const emits = defineEmits<{ (e: 'update:val', val: T): void }>()

type FieldType = 'number' | 'text' | 'url' | 'password'

const filled = ref(false)

const value = computed({
  get() {
    return props.val
  },
  set(v) {
    emits('update:val', v)
    if (v !== '' && v !== 0)
      filled.value = true
    else filled.value = false
  },
})

onMounted(() => {
  if (props.val || props.val === 0)
    filled.value = true
})
</script>

<template>
  <fieldset
    class="relative max-h-[3rem] flex flex-row items-center border-b transition-all"
  >
    <input
      :id="label"
      v-model="value"
      class="w-full rounded-1 bg-back-light py-0.5 pl-1 text-primary outline-none transition-all focus:bg-back"
      :class="{ 'mt-4': label }"
      :type="type"
      :filled="filled"
    >
    <slot>
      <!-- additional content -->
    </slot>
    <label
      v-if="label"
      class="absolute left-1 top-4.5 text-tx-faint transition-all duration-200"
      :for="label"
    >{{ label }}
    </label>
  </fieldset>
</template>

<style scoped>
fieldset {
  border-bottom-color: var(--c-text-faint)  ;
}
fieldset:has(input:focus) {
  border-bottom-color: var(--c-primary);
}
:where(input:focus, input[filled=true]) ~ label {
  transform: translateY(-1.1rem);
  z-index: 44;
  font-size: small;
}
</style>

<style>
</style>
