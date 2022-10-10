<script setup lang="ts">
import { onMounted, ref } from "vue";
import Plotly from "plotly.js-basic-dist";

import { dataStore } from "../store";

const graphOne = ref();

function makePlot() {
  Plotly.newPlot(graphOne.value, dataStore.getSys("evening") as any, {
    margin: { t: 0 },
  });
}

onMounted(() => {
  makePlot();
});
</script>
<template>
  <div class="grid grid-cols-1">
    <div ref="graphOne"></div>
  </div>
</template>
