<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

// const { execute, isFetching, error, data } = useFetch()
</script>

<template>
  <div>
    <slot />
  </div>
</template>
