<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'
</script>

<template>
  <Suspense>
    <AuthForm class="grid grid-cols-1 grid-rows-2 justify-center justify-items-center" />
  </Suspense>
</template>
