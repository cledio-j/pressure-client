<script setup lang="ts">
import { inject, onMounted, reactive, Ref, ref } from "vue";
import { xDaysFromNow, xDaysAgo } from "../utils/dateUtils";

import { dataStore } from "../store";

import DataTableSettingsModal from "./DataTableSettingsModal.vue";
import BaseIconButton from "./BaseIconButton.vue";
import DataTableEntries from "./DataTableEntries.vue";
import DataTableValues from "./DataTableValues.vue";
import DataTableDays from "./DataTableDays.vue";
import BaseLoadingSpinner from "./BaseLoadingSpinner.vue";

const apiUrl = inject("apiUrl");
const token = inject<Ref<string>>("token");
const authorized = inject<Ref<boolean>>("authorized");

const toDate = ref(xDaysFromNow(1));
const fromDate = ref(xDaysAgo(365));
const mode: Ref<"entries" | "days" | "values"> = ref("entries");
const headers: Ref<{ name: string; show: boolean }[] | undefined> = ref();
const showSettings = ref(false);

const tableData: TableDataObj = reactive({
  data: [],
  color: false,
  currentPage: 1,
  perPage: 200,
  totalPages: 1,
  currentDirection: "desc",
  currentOrderBy: "timestamp",
  getter: getData,
});

onMounted(() => {
  tryGetData();
});

function tryGetData() {
  if (token && token.value) {
    getData();
  } else {
    setTimeout(tryGetData, 1000);
  }
}

async function getData(toPage?: number) {
  if (!authorized || !token || !token.value || !authorized.value) {
    console.log("not authorized");
    setTimeout(getData, 1000);
    return;
  }
  const reqBody: GetDataRequestBody = {
    per_page: dataStore.perPage,
    page: toPage ? toPage : 1,
    order: dataStore.currentDirection,
    sort_by: dataStore.currentOrderBy,
    to_date: toDate.value,
    from_date: fromDate.value,
  };
  const response = await fetch(apiUrl + "readings/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    body: JSON.stringify(reqBody),
  }).catch((error) => {
    console.log(error);
    return;
  });
  if (!response?.ok) {
    console.log("Something went wrong. Status:" + response?.status);
    return;
  }
  const result = (await response.json()) as ReadingApiResponse;
  dataStore.updateData(result.data, result.meta);
  dataStore.updateParamsFromBody(reqBody);
}

function updateSettings(newHeaders: any) {
  headers.value = newHeaders;
}

function updateDate(value: string, field: string) {
  if (field == "from") {
    fromDate.value = new Date(value);
  } else if (field == "to") {
    toDate.value = new Date(value);
  }
}
</script>
<template>
  <div @keydown.esc="showSettings = false">
    <div class="grid-col-1 mb-2 grid justify-items-center">
      <div class="rounded-2xl p-1 pt-2 outline outline-gray-300">
        <select
          v-model="mode"
          class="rounded-lg border border-gray-300 text-lg"
        >
          <option value="entries">{{ $t("header.entries") }}</option>
          <option value="days">{{ $t("header.days") }}</option>
          <option value="values">{{ $t("header.values") }}</option>
        </select>
        <BaseIconButton
          class="px-1"
          :color="tableData.color ? 'rainbow-font' : 'fill-gray-600'"
          :class="{ 'scale-[0.9]': true }"
          :extra-classes="'hover:scale-105'"
          @click="tableData.color = !tableData.color"
          icon="paint"
          label="Toggle color"
        ></BaseIconButton>
        <BaseIconButton
          class="px-1"
          @click="showSettings = true"
          :extra-classes="'hover:scale-105'"
          icon="settings"
          label="settings"
        ></BaseIconButton>
        <DataTableSettingsModal
          :showing="showSettings"
          :fromDateMinus="365"
          :toDatePlus="1"
          @close="showSettings = false"
          @new-settings="(headers) => updateSettings(headers)"
          @new-date="(v: string, f: string) => updateDate(v, f)"
        ></DataTableSettingsModal>
      </div>
    </div>

    <div
      v-if="dataStore.data.length && headers"
      class="grid grid-cols-1"
    >
      <DataTableEntries
        v-if="mode == 'entries'"
        :headers="headers"
        @more-data="getData(dataStore.currentPage + 1)"
        :color="tableData.color"
      ></DataTableEntries>
      <DataTableDays
        v-else-if="mode == 'days'"
        @more-data="getData(dataStore.currentPage + 1)"
        :color="tableData.color"
      ></DataTableDays>
      <DataTableValues
        :color="tableData.color"
        @more-data="getData(dataStore.currentPage + 1)"
        v-else-if="mode == 'values'"
      ></DataTableValues>
    </div>
    <div
      class="grid"
      v-else
    >
      <BaseLoadingSpinner class="justify-self-center"></BaseLoadingSpinner>
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
  </div>
</template>
<style>
.rainbow-font {
  fill: url(#my-cool-gradient);
}
</style>
