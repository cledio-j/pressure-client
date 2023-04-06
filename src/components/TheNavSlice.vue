<script setup lang="ts">
import { ref } from 'vue'
import DataTable from './DataTable.vue'
import NavButton from './NavButton.vue'
import StatsPanel from './StatsPanel.vue'

import TheLatestEntries from './TheLatestEntries.vue'

const emits = defineEmits<{
  (e: 'didNavigation'): void
}>()

const botPanel = ref('latest')

function navigate(to: string) {
  botPanel.value = to
  history.pushState({ botPanel: botPanel.value }, '', `/#${to}`)
  emits('didNavigation')
}

window.addEventListener('popstate', (e) => {
  if (e.state)
    botPanel.value = e.state.botPanel
})
</script>

<template>
  <nav
    class="container mx-auto mt-2 mb-2 grid max-w-screen-lg grid-cols-3 justify-items-center scroll-auto bg-gray-100 px-1 py-1 shadow-sm shadow-gray-500 select-none tabHighlight"
  >
    <NavButton
      class="justify-self-start"
      icon="timeline"
      :is-selected="botPanel === 'latest'"
      :but-text="$t('header.latest')"
      @click="navigate('latest')"
    />
    <NavButton
      icon="table"
      :is-selected="botPanel === 'data'"
      :but-text="$t('header.data')"
      @click="navigate('data')"
    />
    <NavButton
      class="justify-self-end"
      :is-selected="botPanel === 'statistics'"
      icon="monitoring"
      :but-text="$t('header.statistics')"
      @click="navigate('statistics')"
    />
  </nav>
  <div class="relative">
    <Transition name="slide-left">
      <TheLatestEntries
        v-show="botPanel === 'latest'"
        class="absolute top-0 w-full"
      />
    </Transition>
    <Transition name="slide-middle">
      <DataTable
        v-show="botPanel === 'data'"
        class="absolute top-0 w-full"
      />
    </Transition>
    <Transition name="slide-right">
      <StatsPanel
        v-show="botPanel === 'statistics'"
        class="absolute top-0 w-full"
      />
    </Transition>
  </div>
</template>

<style scoped>
.tabHighlight {
  -webkit-tap-highlight-color: rgba(253, 164, 174, 0.301);
}

.slide-middle-leave-active,
.slide-right-leave-active,
.slide-left-leave-active {
  transition: all 0s ease-out;
}

.slide-middle-enter-active,
.slide-right-enter-active,
.slide-left-enter-active {
  transition: all 0.2s ease-out;
}

@media screen and (min-width: 900px) {
  .slide-right-enter-from,
  .slide-right-leave-to {
    opacity: 0;
    transform: translateY(-50px) translateX(200px) scale(65%);
  }
  .slide-left-enter-from,
  .slide-left-leave-to {
    opacity: 0;
    transform: translateY(-100px) translateX(-220px) scale(65%);
  }
}
@media screen and (max-width: 899px) {
  .slide-right-enter-from,
  .slide-right-leave-to {
    opacity: 0%;
    transform: translateY(-80px) translateX(100px) scale(65%);
  }
  .slide-left-enter-from,
  .slide-left-leave-to {
    opacity: 0%;
    transform: translateY(-80px) translateX(-100px) scale(65%);
  }
}
.slide-middle-enter-from,
.slide-middle-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(70%);
}
</style>
