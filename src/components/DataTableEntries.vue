<script setup lang="ts">
import { getStr } from "../utils/tableFuncs";
import { useI18n } from "vue-i18n";
import { decideColor } from "../utils/tableFuncs";
import TablePagination from "./TablePagination.vue";
import { computed, inject, reactive, Ref, ref } from "vue";
import ReadingCard from "./ReadingCard.vue";
import BaseModal from "./BaseModal.vue";

import { dataStore } from "../store";
import TablePaginationClient from "./TablePaginationClient.vue";
const { t } = useI18n();
const { d } = useI18n();

const props = defineProps<{
  // tableData: TableDataObj;
  headers: { name: string; show: boolean }[] | undefined;
  color: boolean;
}>();

const tableData = reactive({
  currentPage: 1,
  perPage: 10,
});

const firstRow = computed(() => {
  return (tableData.currentPage - 1) * tableData.perPage + 1;
});
const totalRows = computed(() => {
  return dataStore.data.length;
});
const totalPages = computed(() => {
  return dataStore.data.length / tableData.perPage;
});

const emits = defineEmits<{
  (e: "update", data: Reading, index: number): void;
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
    <table class="border-collapse w-full">
      <thead>
        <template v-for="item in headers">
          <th
            v-if="item.show"
            scope="col"
            class="px-2 py-2 border border-gray-400"
          >
            {{ $t("header." + item.name) }}
          </th>
        </template>
      </thead>
      <tbody>
        <template
          v-for="(item, index) in dataStore.data.slice(firstRow, firstRow + tableData.perPage)"
          ><tr
            class="hover:bg-gray-200 cursor-pointer"
            @click="showCard(item, index)"
          >
            <template v-for="value in headers">
              <td
                :scope="value.name == 'date' ? 'row' : ''"
                class="px-2 border border-gray-400 transition-colors duration-300"
                :class="{ 'font-semibold font-mono': value.name == 'date' }"
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
    <!-- <div class="grid grid-col-1 justify-items-center mt-1">
    <TablePagination
      :current-page="tableData.currentPage"
      :total-pages="tableData.totalPages"
      :getter="tableData.getter"
    ></TablePagination>
  </div> -->
    <TablePaginationClient
      v-model:current-page="tableData.currentPage"
      :total-pages="totalPages"
      v-model:per-page="tableData.perPage"
      :total-rows="totalRows"
      :first-row="firstRow"
    ></TablePaginationClient>
  </div>
</template>
