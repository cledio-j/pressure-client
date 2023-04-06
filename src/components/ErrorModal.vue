<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseIconButton from './BaseIconButton.vue'

const props = defineProps<{ error: ErrorObj }>()
const emits = defineEmits<{
  (e: 'user-responded'): void
}>()

const attrsForAction = {
  retry: { icon: 'refresh', color: 'fill-blue-900 hover:fill-blue-500' },
  cancel: { icon: 'cancel', color: 'fill-red-900 hover:fill-red-700' },
}

function doErrorAction(error: ErrorAction) {
  emits('user-responded')
  error.func()
}
</script>

<template>
  <BaseModal :showing="error.active || false">
    <h1
      class="curso my-1 select-none border-b border-dashed border-rose-300 pb-1 align-middle text-2xl font-semibold text-red-900"
    >
      <BaseIconButton
        v-if="error.severity === 'fatal'"
        class="cursor-default pb-1 align-middle text-3xl"
        color="fill-red-600"
        icon="error"
      >
        error
      </BaseIconButton>
      <span
        v-else-if="error.severity === 'warn'"
        class="pb-1 align-middle text-3xl text-yellow-400"
      >warning</span>
      <span
        v-else
        class="pb-1 align-middle text-3xl text-blue-600"
      >info</span>
      {{ error.title }}
    </h1>
    <p class="ml-1">
      {{ error.message }}
    </p>
    {{ error.details }}
    <div class="mt-2 flex flex-row justify-between">
      <template v-for="item in error.options" :key="item.name">
        <BaseIconButton
          :icon="attrsForAction[item.name].icon"
          :text="$t(`controls.${item.name}`)"
          class="border bg-rose-100 text-lg font-semibold text-red-900 shadow-sm shadow-gray-200 hover:scale-105 hover:bg-rose-200"
          :color="attrsForAction[item.name].color"
          extra-classes="pr-1 pb-0.5 scale-75"
          :label="item.name"
          @click.stop.prevent="doErrorAction(item)"
        />
      </template>
    </div>
  </BaseModal>
</template>
