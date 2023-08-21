<script setup lang="ts">
import { onKeyUp } from '@vueuse/core'

export interface LocalOption {
  local: string
  value: string
}

const props = defineProps<{
  modelValue: string
  label: string
  options: LocalOption[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', neVal: string): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emits('update:modelValue', v)
  },
})

const field = shallowRef<HTMLFieldSetElement>()
const optionsOpen = ref(false)
const hasSelected = ref(false)

function makeSelection(val: string) {
  hasSelected.value = true
  optionsOpen.value = false
  value.value = val
}

function getLocalValue(value: string) {
  const val = props.options.find(o => o.value === value)
  return val?.local
}

onClickOutside(field, () => optionsOpen.value = false)
onKeyUp('ArrowDown', (e) => {
  if (optionsOpen.value)
    e.preventDefault()
})
</script>

<template>
  <fieldset
    ref="field" class="relative min-w-7rem"
    @keyup.esc="optionsOpen ? optionsOpen = false : ''"
  >
    <button
      type="button"
      class="w-full flex flex-row place-content-center justify-between border border-primary-light rounded-sm p-2"
      :class="{ 'bg-back-active': optionsOpen, 'text-tx-secondary-light': !hasSelected }"
      @click.prevent.stop="optionsOpen = !optionsOpen"
    >
      {{ getLocalValue(modelValue) || 'pls select' }}
      <div
        class="i-ms-expand-more inline-block scale-140 transition-all"
        :class="{ 'rotate-180': optionsOpen }"
      />
    </button>
    <div class="absolute top-9 z-50 w-full">
      <Transition name="slide">
        <ul
          v-show="optionsOpen"
          class="relative z-50 cursor-pointer select-none overflow-visible border bg-back shadow-md shadow-primary-light"
        >
          <template v-for="o in options" :key="o.value">
            <button
              type="button"
              class="w-full flex flex-row justify-between border-t border-t-primary px-2 text-tx-title transition-colors hover:(bg-back-active text-primary)"
              @click.prevent="makeSelection(o.value)"
            >
              <span class="cursor-pointer py-2 pl-4">
                {{ o.local }}
              </span>
              <slot :item="o">
                <!-- extra content -->
              </slot>
            </button>
          </template>
        </ul>
      </Transition>
    </div>
  </fieldset>
</template>

<style scoped>
.slide-enter-active {
  animation: slide-in 0.15s
}
.slide-leave-active {
  animation: slide-in 0.15s reverse
}
@keyframes slide-in {
  0% {
    opacity: 0%;
    transform: translateY(-10px) scale(0.9);
  }
  100% {
    opacity: 100%;
  }
}
</style>
