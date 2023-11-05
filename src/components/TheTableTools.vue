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
    <button
      class="relative border rounded-full bg-white transition-all"
      :class="{ 'rainbow-btn ': paint }"
    >
      <div class="z-2 rounded-full bg-white p-3">
        <div
          class="i-ms-format-color-fill z-3 scale-125 transition-colors duration-200"
          :class="[paint ? 'rainbow' : 'text-tx']"
          @click="$emit('update:paint', !paint)"
        />
      </div>
    </button>
  </menu>
</template>

<style scoped>
menu {
  --c-rainbow: linear-gradient(
      112deg in oklab,
      rgb(100% 0% 0%) 24% 0%, rgb(0% 100% 0%) 83% 100%
    );
}
.rainbow {
  background-image: var(--c-rainbow);
}
.rainbow-btn {
  bckground-clip: padding-box;
  border: solid 1px transparent;
  box-sizing: border-box;
  align-items: center;
  z-index: 1;
}
.rainbow-btn::before {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: -1;
  margin: -2px;
  border-radius: inherit;
  background: var(--c-rainbow);
}
</style>
