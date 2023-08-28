<script setup lang="ts">
const props = defineProps<{
  title: string
  sectionDescription?: string
}>()

const expanded = ref(false)
</script>

<template>
  <section class="my-1 items-center border-t border-back-light border-dashed">
    <div class="grid grid-cols-12 grid-rows-2 items-center border-back-light">
      <div class="grid-col-span-10 grid-row-span-2 grid-col-start-1 flex flex-col">
        <h2 class="font-semibold text-tx-title">
          {{ title }}
        </h2>
        <span
          v-if="sectionDescription"
          class="py-0.5 text-xs text-tx-faint"
        >{{ sectionDescription }}</span>
      </div>
      <button
        type="button"
        class="grid-row-span-2 grid-col-start-12"
        :class="{ 'i-ms-expand-more': !expanded, 'i-ms-expand-less': expanded }"
        @click="expanded = !expanded"
      />
    </div>
    <div v-if="expanded" class="ml-3 mr-2 border-l border-back border-dashed">
      <slot />
    </div>
  </section>
</template>
