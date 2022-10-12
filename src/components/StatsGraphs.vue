<script setup lang="ts">
import { onMounted, ref } from "vue";
import { dataStore } from "../store";

const graphOne = ref();

function makePlot() {
  window.Plotly.newPlot(graphOne.value, dataStore.getSys("evening") as any, {
    margin: { t: 0 },
  });
}

onMounted(async () => {
  makePlot();
});
</script>
<template>
  <div class="grid grid-cols-1">
    <div ref="graphOne"></div>
  </div>
</template>
