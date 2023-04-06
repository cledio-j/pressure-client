<script setup lang="ts">
import BaseIconButton from './BaseIconButton.vue'

const props = defineProps<{
  currentPage: number
  realTotal: number
  perPage: number
  totalRows: number
  firstRow: number
  approx?: boolean // true if total row number is approximate
}>()
const emits = defineEmits<{
  (e: 'update:currentPage', neVal: number): void
  (e: 'update:perPage', neVal: number): void
  (e: 'update:firstRow', neVal: number): void
}>()

function isAvail(page: number) {
  if (page < 1 || page > props.realTotal / props.perPage)
    return false

  else return true
}

function calcFirstRow(to: number) {
  if (to > props.currentPage) {
    const result = props.firstRow + props.perPage
    return result <= props.realTotal ? result : props.realTotal
  }
  else {
    const result = props.firstRow - props.perPage
    return result >= 0 ? result : 0
  }
}
function navigate(to: number) {
  if (isAvail(to)) {
    emits('update:currentPage', to)
    emits('update:firstRow', calcFirstRow(to))
  }
}

function changePerPage(e: Event) {
  const to = parseInt((e.target as HTMLSelectElement).value)
  emits('update:perPage', to)
  emits('update:currentPage', Math.ceil(props.firstRow / to) + 1)
}
</script>

<template>
  <div
    class="grid h-12 grid-cols-2 content-center items-center border border-t-0 border-gray-500 md:grid-cols-3"
  >
    <footer class="justify-self-end md:col-start-2">
      <label
        for="perPageValue"
        class="pr-8 text-sm"
      >{{ $t("messages.per_page") }}</label>
      <select
        id="perPageValue"
        class="border-b-2 border-rose-400 bg-white"
        :value="perPage"
        @change="(e) => changePerPage(e)"
      >
        <option value="10">
          10
        </option>
        <option value="15">
          15
        </option>
        <option value="20">
          20
        </option>
        <option value="50">
          50
        </option>
      </select>
    </footer>
    <nav class="justify-self-end">
      <span class="text-sm">
        {{
          `${firstRow
            + 1
          }-${
            firstRow + perPage
          }${$t(!approx ? "messages.of" : "messages.of_about")
          }${realTotal}`
        }}</span>
      <a
        aria-label="previous"
        class="material-symbols-outlined cursor-pointer select-none"
        :class="{ 'cursor-not-allowed text-gray-400': !isAvail(currentPage - 1) }"
        :disabled="isAvail(currentPage - 1)"
        @click="navigate(currentPage - 1)"
      ><BaseIconButton
        icon="arrowForward"
        label="previous"
        extra-classes="scale-75 rotate-180"
        :color="!isAvail(currentPage - 1) ? 'cursor-not-allowed fill-gray-400' : ''"
      /></a>
      <a
        aria-label="next"
        class="material-symbols-outlined select-none"
        :disabled="isAvail(currentPage + 1)"
        @click="navigate(currentPage + 1)"
      ><BaseIconButton
        icon="arrowForward"
        label="next"
        :color="!isAvail(currentPage + 1) ? 'cursor-not-allowed fill-gray-400' : ''"
        extra-classes="scale-75"
      /></a>
    </nav>
  </div>
</template>
