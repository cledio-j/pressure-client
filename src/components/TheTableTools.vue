<script setup lang="ts">
import { ALL_TABLE_VIEWS } from '../const'
import type { TableView } from '~/types'

defineProps<{
  paint: boolean
  tableView: TableView
}>()

defineEmits<{
  (e: 'update:paint', paint: boolean): void
  (e: 'update:tableView', view: TableView): void }
>()
</script>

<template>
  <menu class="mx-2 flex flex-row gap-4">
    <BaseSelect
      :model-value="tableView"
      class="col-span-2"
      :options="ALL_TABLE_VIEWS.map((v) => { return { local: $t(`header.${v}`), value: v } })"
      @update:model-value="(newVal: TableView) => $emit('update:tableView', newVal)"
    />
    <button class="border rounded-full bg-back-offwhite px-2.5">
      <div
        class="i-ms-format-color-fill scale-150 transition-colors duration-200"
        :class="[paint ? 'rainbow' : 'text-tx-faint']"
        @click="$emit('update:paint', !paint)"
      />
    </button>
  </menu>
</template>

<style scoped>
.rainbow {
  background-image:
    linear-gradient(
      112deg in oklab,
      rgb(100% 0% 0%) 24% 0%, rgb(0% 100% 0%) 83% 100%
    )
  ;
}
</style>
