<script setup lang="ts">
const expanded = ref(true)
</script>

<template>
  <div class="top-shadow mb-2 flex flex-col items-center">
    <header class="w-full flex flex-row items-center justify-between bg-back-light py-1">
      <h1
        class="px-2 pt-1 text-xl font-semibold text-tx-title"
        @click="expanded = !expanded"
      >
        {{ $t('controls.new_entry') }}
      </h1>
      <button type="button" aria-label="OCR" class="border rounded-full bg-white p-1.5">
        <div class="i-ms-photo-camera text-lg text-primary" />
      </button>
      <BaseExpandButton @toggle-expand="expanded = !expanded" />
    </header>
    <ReadingInputForm v-if="expanded" />
  </div>
</template>

<style scoped>
.top-shadow {
  box-shadow: 0px 0px 6px var(--c-primary-light);
}
</style>
