<script setup lang="ts">
import { getStr } from "../utils/tableFuncs";
import { useI18n } from "vue-i18n";
import { decideColor } from "../utils/tableFuncs";
import { inject, reactive, Ref, ref, watch } from "vue";
import ReadingCard from "./ReadingCard.vue";
import BaseModal from "./BaseModal.vue";
import BaseInfoSlider from "./BaseInfoSlider.vue";
import South from "../assets/svg/south.svg?component";

import { dataStore } from "../store";
import TablePaginationClient from "./TablePaginationClient.vue";
import { addReading } from "../utils/apiFuncs";
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

const sort = reactive({ sort_by: "timestamp", order: "desc" });

const firstRow = ref(0);

watch(firstRow, (newVal) => {
  if (
    newVal > dataStore.data.length - tableData.perPage &&
    dataStore.data.length < dataStore.total
  ) {
    emits("more-data");
  }
});

const emits = defineEmits<{
  (e: "update", data: Reading, index: number): void;
  (e: "more-data"): void;
  (e: "request-sort", sort_by: string, order: "asc" | "desc"): void;
}>();

const token = inject<Ref<string>>("token");

const viewCard = ref(false);
const cardIndex = ref() as Ref<number>;
const cardData: Ref<Reading | undefined> = ref();

function showCard(item: Reading, index: number) {
  cardData.value = { ...item };
  cardIndex.value = index;
  viewCard.value = true;
}

function handleSort(name: string) {
  if (name == "date" || name == "time") {
    name = "timestamp";
  }
  if (name == "day_time") return;
  if (sort.sort_by == name) {
    let order: "asc" | "desc" = sort.order == "asc" ? "desc" : "asc";
    console.log(`Sort by ${name} in ${order} order`);
    sort.order = order;
    emits("request-sort", name, order);
  } else {
    console.log(`Sort by ${name} in 'desc' order`);
    sort.sort_by = name;
    sort.order = "desc";
    emits("request-sort", name, "desc");
  }
}

function isSortedBy(name: string) {
  if (sort.sort_by == name) {
    return true;
  } else if ((name == "time" || name == "date") && sort.sort_by == "timestamp") {
    return true;
  }
  return false;
}

function reset(data: Reading) {
  cardData.value = { ...data };
}

//for undo dialogue
const showUndo = ref(false);
const lastDeleted: Ref<Reading | undefined> = ref();
const lastIndex: Ref<number | undefined> = ref();

function showUndoDialogue(item: Reading, index: number) {
  viewCard.value = false;
  lastDeleted.value = item;
  lastIndex.value = index;
  showUndo.value = true;
}

function addDeleted() {
  if (!token || !lastDeleted.value) return;
  dataStore.addReading(lastDeleted.value, lastIndex.value);
  addReading(lastDeleted.value, token.value);
  showUndo.value = false;
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
            class="relative cursor-default border border-gray-400 px-2 py-2 font-semibold text-gray-600"
            :class="{ 'text-black': isSortedBy(item.name) }"
            @click="handleSort(item.name)"
          >
            <span>{{ $t("header." + item.name) }}</span>
            <South
              class="absolute right-0 top-0 scale-50 fill-gray-600 transition-all hover:fill-gray-500"
              v-if="isSortedBy(item.name)"
              :class="{ 'rotate-180': sort.order == 'asc' }"
            ></South>
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
    <BaseInfoSlider
      @close="showUndo = false"
      @action="addDeleted"
      :show="showUndo"
      :info-text="$t('messages.deleted_entry')"
      :action-text="$t('messages.undo')"
    ></BaseInfoSlider>
    <BaseModal
      :showing="viewCard"
      @close="viewCard = false"
    >
      <ReadingCard
        @reset="reset"
        @modify="viewCard = false"
        @delete-entry="showUndoDialogue"
        :data="cardData"
        :edit="true"
        :index="cardIndex"
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
