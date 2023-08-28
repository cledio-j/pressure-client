<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="grid grid-cols-2 my-0.5rem ml-1 items-center">
    <label class="text-sm text-tx">
      {{ title }}
    </label>
    <slot />
  </div>
</template>
