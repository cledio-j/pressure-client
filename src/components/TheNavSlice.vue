<script setup lang="ts">
import { ref } from "vue";
import LatestEntries from "./LatestEntries.vue";
import DataTable from "./DataTable.vue";
import NavButton from "./NavButton.vue";
import StatsPanel from "./StatsPanel.vue";

import timeline from "../assets/svg/timeline.svg?component";
import TheLatestEntries from "./TheLatestEntries.vue";

const emits = defineEmits<{
  (e: "did-navigation"): void;
}>();

const botPanel = ref("latest");

function navigate(to: string) {
  botPanel.value = to;
  history.pushState({ botPanel: botPanel.value }, "", `/static/${to}`);
  emits("did-navigation");
}

window.addEventListener("popstate", (e) => {
  if (e.state) {
    botPanel.value = e.state.botPanel;
  }
});
</script>
<template>
  <nav
    class="container mx-auto mt-2 mb-2 grid max-w-screen-lg grid-cols-3 justify-items-center scroll-auto bg-gray-100 px-1 py-1 shadow-sm shadow-gray-500"
  >
    <NavButton
      class="justify-self-start"
      @click="navigate('latest')"
      icon="timeline"
      :is-selected="botPanel == 'latest'"
      :but-text="$t('header.latest')"
    ></NavButton>
    <NavButton
      @click="navigate('data')"
      icon="table"
      :is-selected="botPanel == 'data'"
      :but-text="$t('header.data')"
    ></NavButton>
    <NavButton
      class="justify-self-end"
      @click="navigate('statistics')"
      :is-selected="botPanel == 'statistics'"
      icon="monitoring"
      :but-text="$t('header.statistics')"
    ></NavButton>
  </nav>
  <div class="relative">
    <Transition name="slide-left">
      <TheLatestEntries
        class="absolute w-full"
        v-show="botPanel == 'latest'"
      ></TheLatestEntries
    ></Transition>
    <Transition name="slide-middle">
      <DataTable
        class="absolute w-full"
        v-show="botPanel == 'data'"
      ></DataTable
    ></Transition>
    <Transition name="slide-right">
      <StatsPanel v-show="botPanel == 'statistics'"></StatsPanel
    ></Transition>
  </div>
</template>
<style scoped>
.slide-middle-leave-active,
.slide-right-leave-active,
.slide-left-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-middle-enter-active,
.slide-right-enter-active,
.slide-left-enter-active {
  transition: all 0.2s ease-in-out;
}

@media screen and (min-width: 900px) {
  .slide-right-enter-from,
  .slide-right-leave-to {
    opacity: 0;
    transform: translateY(-100px) translateX(400px) scale(50%);
  }
  .slide-left-enter-from,
  .slide-left-leave-to {
    opacity: 0;
    transform: translateY(-100px) translateX(-300px) scale(50%);
  }
}
@media screen and (max-width: 899px) {
  .slide-right-enter-from,
  .slide-right-leave-to {
    opacity: 20%;
    transform: translateY(-80px) translateX(100px) scale(50%);
  }
  .slide-left-enter-from,
  .slide-left-leave-to {
    opacity: 20%;
    transform: translateY(-80px) translateX(-100px) scale(50%);
  }
}
.slide-middle-enter-from,
.slide-middle-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(70%);
}
</style>
