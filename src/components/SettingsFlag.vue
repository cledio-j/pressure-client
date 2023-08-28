<script setup lang="ts">
const props = defineProps<{
  name: string
  value: boolean
}>()
</script>

<template>
  <div>
    <BaseToggle :toggled="value" />
  </div>
</template>
