<script setup lang="ts">
defineProps<{
  name: string
  value: boolean
}>()
</script>

<template>
  <div>
    <BaseToggle :name="name" :toggled="value" />
  </div>
</template>
