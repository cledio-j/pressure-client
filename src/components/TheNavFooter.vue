<script setup lang="ts">
</script>

<template>
  <nav class="nav-shadow fixed bottom-0 left-0 right-0 h-3rem flex flex-row justify-center bg-back-light pt-1 text-sm">
    <ul class="grid grid-cols-4 gap-2 text-xs">
      <RouterLink to="/" class="grid grid-cols-1 justify-items-center text-center">
        <div class="i-ms-timeline" />
        <span> {{ $t('header.latest') }}</span>
      </RouterLink>
      <RouterLink to="/data" class="grid grid-cols-1 justify-items-center text-center">
        <div class="i-ms-table" />
        <span> {{ $t('header.data') }}</span>
      </RouterLink>
      <RouterLink to="/stats" class="grid grid-cols-1 justify-items-center text-center">
        <div class="i-ms-monitoring" />
        <span> {{ $t('header.statistics') }}</span>
      </RouterLink>
      <RouterLink to="/settings" class="grid grid-cols-1 justify-items-center text-center">
        <div class="i-ms-settings" />
        <span> {{ $t('header.settings') }}</span>
      </RouterLink>
    </ul>
  </nav>
</template>

<style scoped>
.nav-shadow {
    box-shadow: 0px -1px 3px var(--c-primary-light);
}
div {
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: var(--c-primary-dark)
}
</style>
