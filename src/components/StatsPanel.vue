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
      class="flex flex-row items-center justify-self-center"
      @click="showMinMax = !showMinMax"
    >
      <h1 class="justify-self-center font-sans text-xl font-semibold text-rose-900">
        {{ $t("header.min_max") }}
      </h1>
      <expand_more
        class="scale-75 fill-rose-900 transition-all"
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
        v-if="dataStore.data.length > 1 && false"
      ></StatsGraphs
    ></TransitionSlideFadeUp>
  </div>
</template>
<style></style>
