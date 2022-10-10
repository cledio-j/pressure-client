<script setup lang="ts">
import BaseIconButton from "./BaseIconButton.vue";
const props = defineProps<{
  showing: boolean;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();
</script>
<template>
  <div
    v-if="showing"
    class="fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full bg-gray-400 bg-opacity-70 backdrop-opacity-70"
  >
    <div class="container-lg mx-auto h-full flex items-center shadow-lg shadow-black">
      <div class="relative p-2 bg-white rounded-lg sm:mx-auto sm:max-w-sm mx-2 flex-1 mb-32 shadow">
        <BaseIconButton
          @click="emits('close')"
          class="absolute top-1 right-1"
          icon="close"
        ></BaseIconButton>
        <slot>
          <!-- Modal content -->
        </slot>
      </div>
    </div>
  </div>
</template>
