<script setup lang="ts">
import { ref } from 'vue'
import * as Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'
import type { Reading } from 'api'

const props = defineProps<{ data: Reading[] }>()
const { t } = useI18n()
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

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0)
}

function movingAverage(data: number[], interval: number) {
  const result: number[] = []
  data.forEach((_d, idx) => {
    const relevant = data.slice(Math.max(idx - interval, 0), Math.min(idx + interval, data.length))
    result.push(sum(relevant) / relevant.length)
  })
  return result
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined)
    return false
  return true
}

function makeData(data: Reading[]) {
  const sysArrEvening: number[] = []
  const diaArrEvening: number[] = []
  const sysArrLunch: (number | null)[] = []
  const diaArrLunch: (number | null)[] = []
  const sysArrMorning: (number | null)[] = []
  const diaArrMorning: (number | null)[] = []
  const tempArr: (number | null)[] = []
  const totalSysArr: (number | null)[] = []
  const totalDiaArr: (number | null)[] = []

  const xArr: string[] = []
  data.forEach((e) => {
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

  const sysMoving = movingAverage(totalSysArr.filter(notEmpty), 12)
  const diaMoving = movingAverage(totalDiaArr.filter(notEmpty), 12)
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
      y: sysMoving,
      type: 'scatter',
      line: { shape: 'linear' },
      mode: 'line',
      name: 'Sys moving',
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
      y: diaMoving,
      type: 'scatter',
      line: { shape: 'linear', color: 'rgb(59, 167, 118)' },
      mode: 'line',
      name: 'Dia moving',
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

const gData = computed<any>(() => {
  return makeData(props.data)
})

function makePlot() {
  Plotly.react(graphOne.value, gData.value, layout, config)
}

onMounted(() => makePlot())
</script>

<template>
  <section class="grid grid-cols-1 mx-0.5">
    <figure ref="graphOne" />
  </section>
</template>
