<script setup lang="ts">
import BaseIconButton from './BaseIconButton.vue'

const props = defineProps<{
  show: boolean
  infoText: string
  actionText?: string
}>()
const emits = defineEmits<{ (e: 'close'): void; (e: 'action'): void }>()
</script>

<template>
  <Transition name="slide-in">
    <div
      v-if="show"
      class="fixed top-2 left-[50%] translate-x-[-50%]"
    >
      <div
        class="flex flex-row gap-2 rounded-md bg-gray-300 bg-opacity-95 px-4 shadow-sm shadow-gray-600"
      >
        <button class="cursor-default">
          {{ infoText }}
        </button>
        <button
          v-if="actionText"
          class="underline"
          @click="$emit('action')"
        >
          {{ actionText }}
        </button>
        <BaseIconButton
          icon="close"
          class="scale-75 p-0"
          @click="$emit('close')"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateY(-50px) translateX(-50%);
}
</style>
