<script setup lang="ts">
const props = defineProps<{
  open: boolean
  size: 'large' | 'small'
  title?: string
}>()

defineEmits<{
  (e: 'closeDialog'): void
  (e: 'confirmDialog'): void
}>()

const closeButton = ref<HTMLButtonElement | null>(null)
const dialog = ref<HTMLDialogElement | null>(null)

const dialogStyles = computed(() => ({
  'dialog-closed': !props.open,
  'dialog-large': props.size === 'large',
}))
</script>

<template>
  <div
    v-if="open"
    class="fixed bottom-0 left-0 right-0 top-0 z-10 bg-gray-200 opacity-50"
    @click.self="$emit('closeDialog')"
  />

  <dialog
    ref="dialog"
    class="fixed inset-0 z-30 grid m-auto rounded-md bg-white p-0 shadow-gray-400 shadow-md"
    :class="dialogStyles"
    :open="open"
    @keyup.esc="$emit('closeDialog')"
    @click.stop
  >
    <form method="dialog">
      <header class="flex flex-row place-items-center justify-between bg-back-offwhite px-1 pb-1 pt-1 text-lg font-semibold text-tx-title">
        <h2>{{ title || 'Dialog' }}</h2>
        <button
          ref="closeButton"
          class="rounded-full bg-white hover:bg-back-light"
          @click="$emit('closeDialog')"
        >
          <div class="i-ms-close text-3xl text-error" />
        </button>
      </header>
      <article class="z-10 grid p-1">
        <slot>
          <!-- dialog content -->
        </slot>
      </article>
      <footer class="z-20 bg-back-offwhite px-2 py-2">
        <slot name="footer">
          <menu class="flex flex-row justify-between gap-2">
            <button
              autofocus type="reset"
              class="border border-primary bg-white text-error shadow-error btn hover:bg-back-offwhite"
              @click="$emit('closeDialog')"
            >
              {{ $t('controls.cancel') }}
            </button>
            <button
              class="border border-primary bg-white text-tx shadow-primShadow btn hover:bg-back-offwhite"
              @click="$emit('confirmDialog')"
              @focusout="closeButton?.focus()"
            >
              {{ $t('controls.close') }}
            </button>
          </menu>
        </slot>
      </footer>
    </form>
  </dialog>
</template>

<style>
html:has(dialog[open]){
  overflow: hidden;
}
dialog {
    opacity: 1;
    max-inline-size: min(96svw, 60ch);
    max-block-size: min(95svh, 100%);
    overflow: auto;
    transition: opacity .5s cubic-bezier(0.2, 0.0, 0, 1.0);
    min-height: 20rem;
}
dialog::backdrop{
    backdrop-filter: blur(1.5rem);
}
@media (max-width: 768px) {
    .dialog-large{
        margin-block-end: 0;
        border-end-end-radius: 0;
        border-end-start-radius: 0;
        min-width: 95svw;
    }
}

.dialog-closed {
    pointer-events: none;
    opacity: 0;
}
dialog > form {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: start;
  max-block-size: 90svh;
}
</style>
