<script setup lang="ts">
const props = defineProps<{
  to: string
  text: string
  icon: string
}>()

const route = useRoute()

const active = computed(() => {
  return props.to === route.path
})
</script>

<template>
  <RouterLink
    :to="to" class="grid grid-cols-1 justify-items-center text-center"
    :class="[active ? 'text-primary-dark font-semibold' : 'text-tx-faint']"
  >
    <div
      class="text-1.25rem line-height-1.25rem text-inherit"
      :class="[icon]"
    />
    <span> {{ text }}</span>
  </RouterLink>
</template>
