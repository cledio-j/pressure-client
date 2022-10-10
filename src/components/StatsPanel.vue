<script setup lang="ts">
import { ref } from "vue";
import StatsMinMax from "./StatsMinMax.vue";
import TransitionSlideFadeUp from "./TransitionSlideFadeUp.vue";
import StatsGraphs from "./StatsGraphs.vue";

import { dataStore } from "../store";
import expand_more from "../assets/svg/expand-more.svg?component";

const showMinMax = ref(true);
</script>
<template>
  <div class="grid grid-cols-1">
    <button
      class="justify-self-center flex flex-row items-center"
      @click="showMinMax = !showMinMax"
    >
      <h1 class="text-xl text-rose-900 font-sans font-semibold justify-self-center">
        {{ $t("header.min_max") }}
      </h1>
      <expand_more
        class="transition-all scale-75 fill-rose-900"
        :class="{ 'rotate-180 ease-in': !showMinMax }"
      />
    </button>
    <TransitionSlideFadeUp>
      <StatsMinMax
        v-show="showMinMax"
        class="justify-self-center"
      ></StatsMinMax>
    </TransitionSlideFadeUp>
    <TransitionSlideFadeUp>
      <StatsGraphs
        class="transition-all"
        v-if="dataStore.data.length > 1"
      ></StatsGraphs
    ></TransitionSlideFadeUp>
  </div>
</template>
<style></style>
