<script setup lang="ts">
import { getStr } from "../utils/tableFuncs";
import { useI18n } from "vue-i18n";
import { decideColor } from "../utils/tableFuncs";
import { inject, reactive, Ref, ref, watch } from "vue";
import ReadingCard from "./ReadingCard.vue";
import BaseModal from "./BaseModal.vue";

import { dataStore } from "../store";
import TablePaginationClient from "./TablePaginationClient.vue";
const { t } = useI18n();
const { d } = useI18n();

const props = defineProps<{
  headers: { name: string; show: boolean }[] | undefined;
  color: boolean;
}>();

const tableData = reactive({
  currentPage: 1,
  perPage: 10,
});

const firstRow = ref(0);

watch(firstRow, (newVal) => {
  if (
    newVal > dataStore.data.length - tableData.perPage &&
    dataStore.data.length < dataStore.total
  ) {
    emits("more-data");
  }
});

watch(
  () => tableData.perPage,
  (newVal) => {}
);

const emits = defineEmits<{
  (e: "update", data: Reading, index: number): void;
  (e: "more-data"): void;
}>();

const token = inject<Ref<string>>("token");
const apiUrl = inject("apiUrl");

const slice = reactive({ from: 0, to: 20 });

const viewCard = ref(false);
const cardIndex = ref() as Ref<number>;
const cardData: Ref<Reading | undefined> = ref();

function showCard(item: Reading, index: number) {
  cardData.value = { ...item };
  cardIndex.value = index;
  viewCard.value = true;
}
async function handleModify() {
  if (!cardData.value) {
    console.log("no card data");
    return;
  }
  if (!token) {
    console.log("not authorized");
    return;
  }
  const response = await fetch(apiUrl + "reading/modify" + `?id=${cardData.value.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    body: JSON.stringify(cardData.value),
  });
  viewCard.value = false;
  dataStore.updateReading(cardData.value, cardIndex.value);
}

async function handleDelete() {
  if (!cardData.value) {
    console.log("no card data");
    return;
  }
  if (!token) {
    console.log("not authorized");
    return;
  }
  const response = await fetch(apiUrl + "reading/delete" + `?id=${cardData.value.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
  });
  dataStore.deleteReading(cardIndex.value);
  viewCard.value = false;
}

function reset(data: Reading) {
  cardData.value = { ...data };
}
</script>
<template>
  <div class="max-h-screen">
    <table class="w-full border-collapse">
      <thead>
        <template v-for="item in headers">
          <th
            v-if="item.show"
            scope="col"
            class="border border-gray-400 px-2 py-2"
          >
            {{ $t("header." + item.name) }}
          </th>
        </template>
      </thead>
      <tbody>
        <template
          v-for="(item, index) in dataStore.data.slice(firstRow, firstRow + tableData.perPage)"
          ><tr
            class="cursor-pointer hover:bg-gray-200"
            @click="showCard(item, index)"
          >
            <template v-for="value in headers">
              <td
                :scope="value.name == 'date' ? 'row' : ''"
                class="border border-gray-400 px-2 transition-colors duration-300"
                :class="{ 'font-mono font-semibold': value.name == 'date' }"
                :style="{
                  backgroundColor: color ? decideColor(value.name, item) : '',
                }"
                v-if="value.show"
              >
                {{ getStr(value.name as HeaderKey, item, t, d) }}
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <BaseModal
      :showing="viewCard"
      @close="viewCard = false"
    >
      <ReadingCard
        @reset="reset"
        @modify="handleModify()"
        @delete-entry="handleDelete()"
        :data="cardData"
        :edit="true"
        v-if="viewCard && cardData"
      ></ReadingCard
    ></BaseModal>
    <TablePaginationClient
      v-model:current-page="tableData.currentPage"
      :real-total="dataStore.total"
      v-model:per-page="tableData.perPage"
      :total-rows="dataStore.data.length"
      v-model:first-row="firstRow"
    ></TablePaginationClient>
  </div>
</template>
