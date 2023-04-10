<script setup lang="ts">
import CloseIcon from '../assets/svg/close.svg?component'
import { useNoteStore } from '@/notifications'

const noteStore = useNoteStore()
</script>

<template>
  <Transition name="slide-in">
    <div
      v-if="noteStore.notes.length > 0"
      class="fixed top-2 mx-4 z-[100]"
    >
      <div
        class="flex flex-row gap-2 rounded-md bg-gray-100 bg-opacity-95 px-2 shadow-sm shadow-gray-400"
      >
        <h2 class="font-semibold text-red-900 pt-1">
          {{ noteStore.notes[0].title }}
        </h2>
        <span class="pt-1 text-gray-700">{{ noteStore.notes[0].message }}</span>
        <button
          v-for="(item, index) in noteStore.notes[0].actions" :key="index"
          class="underline font-semibold text-blue-800 min-w-fit"
          @click="item.action"
        >
          {{ $t(`errorActions.${item.name}`) }}
        </button>
        <button class="row-span-2 fill-red-900" @click="noteStore.notes.shift()">
          <CloseIcon widht="32" height="32" viewBox="0 -3 48 44" />
        </button>
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
