<script setup lang="ts">
/// <reference types="vite-svg-loader" />
import Refresh from "../assets/svg/refresh.svg?component";
</script>
<template>
  <Refresh class="circle-spin" />
</template>
<style scoped>
.circle-spin {
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg) scale(100%);
    fill: lightcoral;
  }
  50% {
    transform: rotate(180deg) scale(120%);
    fill: rgb(255, 99, 133);
  }
  to {
    transform: rotate(360deg) scale(100%);
    fill: lightcoral;
  }
}
</style>
