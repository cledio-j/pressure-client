<script setup lang="ts">
import type { Reading } from 'api'

const props = defineProps<{
  reading: Reading
}>()
</script>

<template>
  <div>
    <slot />
  </div>
</template>
