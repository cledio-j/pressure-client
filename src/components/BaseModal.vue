<script setup lang="ts">
import BaseIconButton from './BaseIconButton.vue'
const props = defineProps<{
  showing: boolean
}>()

// onMounted(() => {
//   const body = document.querySelector("body");
//   body?.classList.add("modal-open");
// });

// onUnmounted(() => {
//   const body = document.querySelector("body");
//   body?.classList.remove("modal-open");
// });

const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="showing"
    class="fixed top-0 right-0 left-0 z-50 h-full w-full bg-gray-400 bg-opacity-70  backdrop-opacity-70 md:inset-0"
  >
    <div class="container-lg mx-auto flex h-full items-center shadow-lg shadow-black">
      <div class="relative mx-2 mb-32 flex-1 rounded-lg bg-white p-2 shadow sm:mx-auto sm:max-w-sm">
        <BaseIconButton
          class="absolute top-1 right-1"
          icon="close"
          label="close"
          @click="emits('close')"
        />
        <slot>
          <!-- Modal content -->
        </slot>
      </div>
    </div>
  </div>
</template>
