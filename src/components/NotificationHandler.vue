<script setup lang="ts">
import type { NoteAction } from '~/stores/notifications'
import { useNoteStore } from '~/stores/notifications'

const { notes, clear } = useNoteStore()

function executeAction(action: NoteAction, idx: number) {
  action.action()
  if (action.close)
    notes.splice(idx, 1)
}
</script>

<template>
  <div v-if="notes.length" class="fixed left-0 right-0 top-1rem z-50 mx-2 rounded-md bg-back px-1 py-1 text-tx shadow shadow-primary-dark">
    <section v-for="(note, idx) in notes" :key="note.name">
      <header
        class="flex flex-row justify-between border-b border-primary-dark border-dashed py-1 text-lg text-tx-title"
      >
        <h2 class="flex flex-row items-center gap-1">
          <div
            class="text-2xl"
            :class="{
              'i-ms-error-outline-rounded text-error': note.severity === 'error',
              'i-ms-explosion-outline text-error': note.severity === 'fatal',
            }"
          /> {{ $t(note.name) }}
        </h2>
        <button class="rounded-full bg-back-offwhite px-0.5" @click="notes.splice(idx, 1)">
          <div class="i-ms-close text-xl" />
        </button>
      </header>
      <span class="py-2 text-tx">{{ $t(note.description || '') }}</span>
      <menu
        v-if="note.actions && note.actions.length"
        class="flex flex-row"
      >
        <button
          v-for="action in note.actions"
          :key="action.name"
          type="button"
          class="btn"
          @click="executeAction(action, idx)"
        >
          <div v-if="action.icon" :class="[action.icon]" />
          {{ action.name }}
        </button>
      </menu>
      <details v-if="note.original">
        <span class="text-xs">{{ note.original.stack }}</span>
      </details>
    </section>
    <button v-if="notes.length > 1" type="button" @click="clear()">
      close all
    </button>
  </div>
</template>
