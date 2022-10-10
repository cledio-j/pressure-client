<script setup lang="ts">
import BaseIconButton from "./BaseIconButton.vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalRows: number;
  firstRow: number;
}>();
const emits = defineEmits<{
  (e: "update:currentPage", neVal: number): void;
  (e: "update:perPage", neVal: number): void;
}>();

function isAvail(page: number) {
  if (page < 1 || page > props.totalPages) {
    return false;
  } else return true;
}

function navigate(to: number) {
  if (isAvail(to)) {
    emits("update:currentPage", to);
  }
}
</script>
<template>
  <div
    class="grid h-12 grid-cols-2 content-center items-center border border-t-0 border-gray-500 md:grid-cols-3"
  >
    <div class="justify-self-end md:col-start-2">
      <label
        for="perPageValue"
        class="pr-8 text-sm"
        >{{ $t("messages.per_page") }}</label
      >
      <select
        id="perPageValue"
        class="border-b-2 border-rose-400 bg-white"
        :value="perPage"
        @change="$emit('update:perPage', parseInt(($event.target as HTMLInputElement).value))"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
    <nav class="justify-self-end">
      <span class="text-sm">{{ firstRow + "-" + currentPage * perPage + " of " + totalRows }}</span>
      <a
        aria-label="previous"
        class="material-symbols-outlined cursor-pointer select-none"
        :class="{ 'cursor-not-allowed text-gray-400': !isAvail(currentPage - 1) }"
        :disabled="isAvail(currentPage - 1)"
        @click="navigate(currentPage - 1)"
        ><BaseIconButton
          icon="arrowForward"
          :extra-classes="'scale-75 rotate-180'"
          :color="!isAvail(currentPage - 1) ? 'cursor-not-allowed fill-gray-400' : ''"
      /></a>
      <a
        aria-label="next"
        class="material-symbols-outlined select-none"
        :disabled="isAvail(currentPage + 1)"
        @click="navigate(currentPage + 1)"
        ><BaseIconButton
          icon="arrowForward"
          :color="!isAvail(currentPage + 1) ? 'cursor-not-allowed fill-gray-400' : ''"
          :extra-classes="'scale-75'"
      /></a>
    </nav>
  </div>
</template>
