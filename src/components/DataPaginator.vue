<script setup lang="ts">
import { PER_PAGE_OPTS } from '~/const'

const props = defineProps<{
  perPage: number
  page: number
  totalItems: number
  approx?: boolean
}>()

defineEmits<{
  (e: 'update:perPage', perPage: number): void
  (e: 'update:page', page: number): void
}>()

const firstRow = computed(() => props.perPage * (props.page - 1) + 1)
const lastRow = computed(() => firstRow.value + props.perPage - 1)

const lastRowStr = computed(() => {
  if (props.approx)
    return lastRow.value > props.totalItems ? Math.round(props.totalItems / 3) : lastRow.value
  return lastRow.value > props.totalItems ? props.totalItems : lastRow.value
})

function isAvail(page: number) {
  if (page < 1 || page > props.totalItems / props.perPage)
    return false

  else return true
}
</script>

<template>
  <div class="flex flex-row items-center justify-between border border-t-0 border-gray-400 px-1 py-1">
    <div>
      <label
        for="perPageValue"
        class="pr-3 text-sm"
      >{{ $t("messages.per_page") }}</label>
      <select
        id="perPageValue"
        class="border-b-2 border-primary-light"
        :value="perPage"
        @change="(e) => $emit('update:perPage', parseInt(((e.target as HTMLSelectElement).value)))"
      >
        <option v-for="num in PER_PAGE_OPTS" :key="num" :value="num">
          {{ num }}
        </option>
      </select>
    </div>
    <nav class="flex flex-row justify-self-end gap-2">
      <span class="text-sm">
        {{ `${firstRow}-${lastRowStr}
        ${$t(`messages.${approx ? 'of_about' : 'of'}`)}
        ${totalItems}` }}
      </span>
      <button
        type="button"
        aria-label="previous"
        class="cursor-pointer select-none text-tx disabled:cursor-not-allowed disabled:text-tx-faint"
        :disabled="!isAvail(page - 1)"
        @click="$emit('update:page', page - 1)"
      >
        <div
          class="i-ms-arrow-back scale-125"
        />
      </button>
      <button
        aria-label="next"
        type="button"
        class="cursor-pointer select-none text-tx disabled:cursor-not-allowed disabled:text-tx-faint"
        :disabled="!isAvail(page + 1)"
        @click="$emit('update:page', page + 1)"
      >
        <div class="i-ms-arrow-forward scale-125" />
      </button>
    </nav>
  </div>
</template>
