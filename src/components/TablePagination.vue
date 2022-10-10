<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
  getter: (page: number) => Promise<void>;
}>();

function isAvail(page: number) {
  if (page < 1 || page > props.totalPages) {
    return false;
  } else return true;
}

function navigate(to: number) {
  props.getter(to);
}
</script>
<template>
  <div>
    <nav v-if="totalPages > 1">
      <a
        aria-label="previous"
        class="material-symbols-outlined cursor-pointer"
        :class="{ 'cursor-not-allowed text-gray-400': !isAvail(currentPage - 1) }"
        :disabled="isAvail(currentPage - 1)"
        @click="navigate(currentPage - 1)"
        >arrow_back</a
      >
      <template v-if="totalPages > 2 && totalPages < 9">
        <a
          v-for="n in totalPages"
          :aria-label="'navigate-to-' + n"
          class="cursor-pointer border px-2 p-1 hover:bg-rose-200 text-xl"
          :class="{ ' font-bold ring-2': n == currentPage }"
          @click="navigate(n)"
          >{{ n }}</a
        ></template
      >
      <template v-else-if="totalPages >= 9">
        <a>...</a>
        <a
          v-for="n in 5"
          :aria-label="'navigate-to-' + (currentPage - 2 + n)"
          class="cursor-pointer border px-2 p-1 hover:bg-rose-200 text-xl"
          :class="{ ' font-bold ring-2': n == currentPage }"
          @click="navigate(currentPage - 3 + n)"
          >{{ currentPage - 3 + n }}</a
        ><a>...</a></template
      >
      <a
        aria-label="next"
        class="material-symbols-outlined cursor-pointer"
        :class="{ 'cursor-not-allowed text-gray-400': !isAvail(currentPage + 1) }"
        :disabled="isAvail(currentPage + 1)"
        @click="navigate(currentPage + 1)"
        >arrow_forward</a
      >
    </nav>
  </div>
</template>
