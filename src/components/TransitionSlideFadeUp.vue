<script setup lang="ts"></script>
<template>
  <Transition name="slide-fade">
    <slot>
      <!-- content -->
    </slot>
  </Transition>
</template>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.slide-fade-leave-to {
  transform: translateY(-100px) scale(0%);
}
</style>
