<script setup lang="ts">
</script>

<template>
  <nav
    class="nav-shadow fixed bottom-0 left-0 right-0 z-50 h-3rem flex flex-row justify-center bg-back-light pt-1 text-sm"
  >
    <ul class="grid grid-cols-4 w-full text-xs">
      <NavButton to="/" :text="$t('header.latest')" icon="i-ms-timeline" />
      <NavButton to="/data" :text="$t('header.data')" icon="i-ms-table" />
      <NavButton to="/stats" :text="$t('header.statistics')" icon="i-ms-monitoring" />
      <NavButton to="/settings" :text="$t('header.settings')" icon="i-ms-settings" />
    </ul>
  </nav>
</template>

<style scoped>
.nav-shadow {
    box-shadow: 0px -1px 3px var(--c-primary-light);
}
nav {
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: var(--c-primary-dark)
}
</style>
