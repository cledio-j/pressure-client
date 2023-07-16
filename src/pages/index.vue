<script setup lang="ts">
import TheNavFooter from '~/components/TheNavFooter.vue'
import TheNewEntry from '~/components/TheNewEntry.vue'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <Suspense>
    <TheNewEntry />
  </Suspense>
  <RouterView v-slot="{ Component }">
    <KeepAlive exclude="Settings">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
  <TheNavFooter />
  <div class="h-3rem" />
</template>
