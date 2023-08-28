<script setup lang="ts">
import type { TableView } from '~/composables/settings'

const props = defineProps<{
  paint: boolean
  tableView: TableView
}>()

const emits = defineEmits<{
  (e: 'update:paint', paint: boolean): void
  (e: 'update:tableView', view: TableView): void }
>()
</script>

<template>
  <menu class="grid grid-cols-6 mx-2 gap-4 p-2">
    <button>
      <div class="i-ms-format-color-fill scale-150" @click="$emit('update:paint', !paint)" />
    </button>
    <BaseSelect
      :model-value="tableView"
      class="col-span-2"
      :options="ALL_TABLE_VIEWS.map((v) => { return { local: $t(`header.${v}`), value: v } })"
      @update:model-value="(newVal: TableView) => $emit('update:tableView', newVal)"
    />
  </menu>
</template>
