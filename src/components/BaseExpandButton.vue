<script setup lang="ts">
defineProps<{
  expanded?: boolean
}>()
defineEmits<{ (e: 'toggleExpand'): void }>()
</script>

<template>
  <button
    class="text-2xl"
    type="button"
    aria-label="Expand"
    @click="$emit('toggleExpand')"
  >
    <div
      aria-hidden="true"
      focusable="false"
      class="i-ms-expand-more text-primary transition-all hover:scale-90"
      :class="{ 'rotate-180 ease-in': expanded }"
    />
  </button>
</template>
