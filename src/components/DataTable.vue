<script setup lang="ts">
import { type Ref, inject, onMounted, reactive, ref } from 'vue'
import { xDaysAgo, xDaysFromNow } from '../utils/dateUtils'
import { authStore, useDataStore } from '../store'
import DataTableSettingsModal from './DataTableSettingsModal.vue'
import BaseIconButton from './BaseIconButton.vue'
import DataTableEntries from './DataTableEntries.vue'
import DataTableValues from './DataTableValues.vue'
import DataTableDays from './DataTableDays.vue'
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import { type fetchOptions, useFetch } from '@/composables/fetch'

const apiUrl = inject('apiUrl')

const toDate = ref(xDaysFromNow(1))
const fromDate = ref(xDaysAgo(365))
const mode: Ref<'entries' | 'days' | 'values'> = ref('entries')
const headers: Ref<{ name: string; show: boolean }[] | undefined> = ref()
const showSettings = ref(false)

const dataStore = useDataStore()

const tableData: TableDataObj = reactive({
  data: [],
  color: false,
  currentPage: 1,
  perPage: 200,
  totalPages: 1,
  currentDirection: 'desc',
  currentOrderBy: 'timestamp',
  getter: getData,
})

onMounted(() => {
  tryGetData()
})

function tryGetData() {
  if (authStore.authorized)
    getData()

  else
    setTimeout(tryGetData, 1000)
}

function getRangeArray(n: number, first = 1) {
  const arr = [...Array(n).keys()]
  if (first === 0)
    return arr
  return arr.map(i => i + first)
}

// function preventUnhandled(...promises: Promise<any>[]) {
//   // this keeps the whole thing from exploding when one of the fetches errors
//   for (const p of promises) p.catch(() => {})
// }

async function getDataGradual(pages: number, per_page: number) {
  const urls = getRangeArray(pages - 1, 2).map(n => `readings/get?page=${n}&per_page=${per_page}`)
  const opts: fetchOptions = { auth: true, method: 'GET' }
  const responses: Promise<ReadingApiResponse>[] = urls.map(async (url) => {
    const res = await useFetch(url, opts)
    const data = res?.json()
    return data
  })
  try {
    for await (const r of responses)
      dataStore.updateData(r.data, r.meta)
  }
  catch (err) { console.error(err) }
}

async function getData(toPage?: number) {
  if (!authStore.authorized) {
    console.error('not authorized')
    setTimeout(getData, 1000)
    return
  }
  const response = await fetch(
    `${apiUrl
    }readings/get`
      + `?page=${toPage || 1}`
      + `&per_page=${dataStore.params.perPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
    },
  ).catch((error) => {
    console.error(error)
  })
  if (!response?.ok) {
    console.error(`Something went wrong. Status:${response?.status}`)
    return
  }
  const result = (await response.json()) as ReadingApiResponse

  dataStore.updateData(result.data, result.meta)
  dataStore.updateParams(result.params)
  dataStore.totalPages = result.meta.total_pages
  getDataGradual(dataStore.totalPages, dataStore.params.perPage)
}

async function getSortedData(sort_by: string, order: string, toPage = 1) {
  if (!authStore.authorized) {
    console.error('not authorized')
    return
  }
  try {
    const response = await fetch(
      `${apiUrl
      }readings/get?${
        new URLSearchParams({
          page: toPage.toString(),
          per_page: dataStore.params.perPage.toString(),
          sort_by,
          order,
        })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
      },
    )
    if (!response?.ok) {
      console.error(`Something went wrong. Status:${response?.status}`)
      return
    }
    const result = (await response.json()) as ReadingApiResponse
    dataStore.replaceData(result.data, result.meta)
    dataStore.updateParams(result.params)
    dataStore.totalPages = result.meta.total_pages
  }
  catch (_error) {
    console.error(_error)
  }
}

function updateSettings(newHeaders: any) {
  headers.value = newHeaders
}

function updateDate(value: string, field: string) {
  if (field === 'from')
    fromDate.value = new Date(value)

  else if (field === 'to')
    toDate.value = new Date(value)
}
function handleSort(sort_by: string, order: string) {
  getSortedData(sort_by, order)
}
</script>

<template>
  <div @keydown.esc="showSettings = false">
    <div
      v-if="dataStore.data.length && headers"
      class="grid grid-cols-1"
    >
      <DataTableEntries
        v-if="mode === 'entries'"
        :headers="headers"
        :color="tableData.color"
        @more-data="getData(dataStore.params.currentPage + 1)"
        @request-sort="(sort_by, order) => handleSort(sort_by, order)"
      />
      <DataTableDays
        v-else-if="mode === 'days'"
        :color="tableData.color"
        @more-data="getData(dataStore.params.currentPage + 1)"
      />
      <DataTableValues
        v-else-if="mode === 'values'"
        :color="tableData.color"
        @more-data="getData(dataStore.params.currentPage + 1)"
      />
    </div>
    <div
      v-else
      class="grid"
    >
      <BaseLoadingSpinner class="justify-self-center" />
    </div>
    <svg
      style="width: 0; height: 0; position: absolute"
      aria-hidden="true"
      focusable="false"
    >
      <linearGradient
        id="my-cool-gradient"
        x2="1"
        y2="1"
      >
        <stop
          offset="15%"
          stop-color="#f12c06"
        />
        <stop
          offset="56%"
          stop-color="#faed34"
        />
        <stop
          offset="100%"
          stop-color="#0eeb3e"
        />
      </linearGradient>
    </svg>
    <div class="grid-col-1 mt-1 grid justify-items-center w-full">
      <div class="w-full md:w-fit rounded-2xl p-1 pt-2 outline outline-gray-300 flex flex-row justify-center">
        <select
          v-model="mode"
          class="rounded-lg border border-gray-300 text-lg"
        >
          <option value="entries">
            {{ $t("header.entries") }}
          </option>
          <option value="days">
            {{ $t("header.days") }}
          </option>
          <option value="values">
            {{ $t("header.values") }}
          </option>
        </select>
        <BaseIconButton
          class="px-1 scale-[0.9]"
          :color="tableData.color ? 'rainbow-font' : 'fill-gray-600'"

          extra-classes="hover:scale-105"
          icon="paint"
          label="Toggle color"
          @click="tableData.color = !tableData.color"
        />
        <BaseIconButton
          class="px-1"
          extra-classes="hover:scale-105"
          icon="settings"
          label="settings"
          @click="showSettings = true"
        />
        <DataTableSettingsModal
          :showing="showSettings"
          :from-date-minus="365"
          :to-date-plus="1"
          @close="showSettings = false"
          @new-settings="(headers) => updateSettings(headers)"
          @new-date="(v: string, f: string) => updateDate(v, f)"
        />
      </div>
    </div>
  </div>
</template>

<style>
.rainbow-font {
  fill: url(#my-cool-gradient);
}
</style>
