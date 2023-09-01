<script setup lang="ts">
import type { Reading } from 'api'

defineProps<{
  reading: Reading
}>()
</script>

<template>
  <div>
    <slot />
  </div>
</template>
