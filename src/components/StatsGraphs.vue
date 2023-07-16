<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'
import { useDataStore } from '../stores/data'

const { t } = useI18n()
const dataStore = useDataStore()
const graphOne = ref()

const rangeOptions = {
  buttons: [
    {
      step: 'day',
      stepmode: 'backward',
      count: 7,
      label: '7',
    },
    {
      step: 'day',
      stepmode: 'backward',
      count: 30,
      label: '30',
    },
    {
      step: 'day',
      stepmode: 'backward',
      count: 100,
      label: '100',
    },
    {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '365',
    },
    {
      step: 'all',
      label: t('messages.all'),
      size: 20,
    },
  ],
}

const layout: Partial<Plotly.Layout> = {
  margin: { t: 0, l: 5, r: 0 }, // @ts-expect-error-plotly
  xaxis: { rangeselector: rangeOptions, fixedrange: true }, // @ts-expect-error-plotly
  yaxis: { ticklabelposition: 'inside', fixedrange: true, side: 'left' },
  // yaxis2: { ticklabelposition: "inside", overlaying: "y", side: "right", title: "Temp" },
  showlegend: true,
  legend: { orientation: 'h' },
  dragmode: false,
}

const config: Partial<Plotly.Config> = {
  displayModeBar: false,
  scrollZoom: false,
  responsive: true,
}

const data = ref<any>()

function makeData() {
  const sysArrEvening: (number | null)[] = []
  const diaArrEvening: (number | null)[] = []
  const sysArrLunch: (number | null)[] = []
  const diaArrLunch: (number | null)[] = []
  const sysArrMorning: (number | null)[] = []
  const diaArrMorning: (number | null)[] = []
  const tempArr: (number | null)[] = []
  const totalSysArr: (number | null)[] = []
  const totalDiaArr: (number | null)[] = []
  const xArr: string[] = []
  dataStore.data.forEach((e) => {
    xArr.push(e.timestamp)
    totalSysArr.push(e.systolic_bp)
    totalDiaArr.push(e.diastolic_bp)
    tempArr.push(e.weather.temperature)
    if (e.day_time === 'evening' || e.day_time === 'other') {
      sysArrEvening.push(e.systolic_bp)
      diaArrEvening.push(e.diastolic_bp);
      [sysArrLunch, diaArrLunch, sysArrMorning, diaArrMorning].forEach(e => e.push(null))
      tempArr.push(e.weather.temperature)
    }
    else if (e.day_time === 'lunch') {
      sysArrLunch.push(e.systolic_bp)
      diaArrLunch.push(e.diastolic_bp);
      [sysArrEvening, diaArrEvening, sysArrMorning, diaArrMorning].forEach(e => e.push(null))
    }
    else if (e.day_time === 'morning') {
      sysArrMorning.push(e.systolic_bp)
      diaArrMorning.push(e.diastolic_bp);
      [sysArrEvening, diaArrEvening, sysArrLunch, diaArrLunch].forEach(e => e.push(null))
    }
  })
  return [
    {
      x: xArr,
      y: totalSysArr,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Sys',
    },
    {
      x: xArr,
      y: totalDiaArr,
      type: 'scatter',
      line: { shape: 'linear', width: 2, color: 'rgb(219, 64, 82)' },
      mode: 'line',
      name: 'Dia',
    },
    {
      x: xArr,
      y: sysArrEvening,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Sys Abend',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: diaArrEvening,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Dia Abend',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: sysArrLunch,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Sys Mittag',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: diaArrLunch,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Dia Mittag',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: sysArrMorning,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Sys Morgen',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: diaArrMorning,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Dia Morgen',
      connectgaps: true,
      visible: 'legendonly',
    },
    {
      x: xArr,
      y: tempArr,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Temp',
      connectgaps: true,
      visible: 'legendonly',
    },
  ]
}

watch(dataStore.data, () => data.value = makeData(), { immediate: true })

function makePlot() {
  Plotly.react(graphOne.value, data.value, layout, config)
}

onMounted(() => {
  makePlot()
})
</script>

<template>
  <section class="grid grid-cols-1 mx-0.5">
    <figure ref="graphOne" />
  </section>
</template>
