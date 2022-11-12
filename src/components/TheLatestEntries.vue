<script setup lang="ts">
import { inject, nextTick, onMounted, reactive, Ref, ref } from "vue";
import { dataStore } from "../store";
import { addReading } from "../utils/apiFuncs";

import DataWeatherCard from "./DataWeatherCard.vue";
import ExpandMore from "../assets/svg/expand-more.svg?component";
import TransitionSlideFadeUp from "./TransitionSlideFadeUp.vue";
import DataValuesCard from "./DataValuesCard.vue";
import BaseIconButton from "./BaseIconButton.vue";
import BaseLoadingSpinner from "./BaseLoadingSpinner.vue";
import ReadingDeleteButton from "./ReadingDeleteButton.vue";
import BaseInfoSlider from "./BaseInfoSlider.vue";
import ReadingCard from "./ReadingCard.vue";
import BaseModal from "./BaseModal.vue";

const compareTo: Ref<"dayBefore" | "last"> = ref("dayBefore");
const token = inject<Ref<string>>("token");

const showUndo = ref(false);
const showCard = ref(false);
const lastDeleted: Ref<Reading | undefined> = ref();
const lastIndex: Ref<number | undefined> = ref();

const cardData: Ref<Reading | undefined> = ref();
const cardIndex: Ref<number | undefined> = ref();

const cardState: { [index: number]: boolean } = reactive({});

onMounted(() => {
  //make first three items expanded, rest closed
  for (let i = 0; i < 6; i++) {
    cardState[i] = i < 3 ? true : false;
  }
});

function showUndoDialogue(item: Reading, index: number) {
  lastDeleted.value = item;
  lastIndex.value = index;
  showUndo.value = true;
  showCard.value = false;
}

function addDeleted() {
  if (!token || !lastDeleted.value) return;
  dataStore.addReading(lastDeleted.value, lastIndex.value);
  addReading(lastDeleted.value, token.value);
  showUndo.value = false;
}

function setupModify(item: Reading, index: number) {
  cardData.value = item;
  cardIndex.value = index;
  showCard.value = true;
}

function resetModifyCard(data: Reading) {
  cardData.value = { ...data };
}
</script>
<template>
  <div
    v-if="dataStore.data.length > 0"
    class="grid grid-cols-1 transition-all"
  >
    <button
      class="absolute -top-10 -left-20 z-50 border-2 border-red-700"
      @click="compareTo == 'last' ? (compareTo = 'dayBefore') : (compareTo = 'last')"
    >
      {{ compareTo == "last" ? "Letzter" : "Gestern" }}
    </button>
    <BaseInfoSlider
      @close="showUndo = false"
      @action="addDeleted"
      :show="showUndo"
      :info-text="$t('messages.deleted_entry')"
      :action-text="$t('messages.undo')"
    ></BaseInfoSlider>
    <BaseModal
      :showing="showCard"
      @close="showCard = false"
      v-if="showCard && cardData && (cardIndex || cardIndex === 0)"
      ><ReadingCard
        @reset="resetModifyCard"
        @modify="showCard = false"
        @delete-entry="showUndoDialogue"
        :data="cardData"
        :index="cardIndex"
        :edit="true"
      ></ReadingCard
    ></BaseModal>
    <TransitionGroup name="list">
      <template
        v-for="(item, index) in dataStore.data.slice(0, 6)"
        :key="item.id"
      >
        <div
          class="container relative my-1 border-t-rose-200 bg-gradient-to-b from-slate-100 via-pink-50 to-rose-100 shadow-sm shadow-rose-200 transition-all duration-200"
          :class="{
            'do-magic ease-out': !cardState[index],
            ' h-80 ease-in md:h-48': cardState[index],
          }"
        >
          <button
            class="absolute right-2 top-0 z-50 text-2xl"
            aria-label="toggle collapse"
            @click="cardState[index] = !cardState[index]"
          >
            <ExpandMore
              class="scale-75 fill-gray-700 transition-all hover:scale-90"
              :class="{ 'rotate-180 ease-in': cardState[index] }"
            />
          </button>
          <div
            class="absolute top-0 z-40 w-full border-t border-rose-200 py-2"
            :class="{ 'shadow-sm shadow-rose-200': !cardState[index] }"
          >
            <h2
              class="z-50 mb-1 cursor-pointer place-self-center justify-self-center text-center text-lg font-semibold text-rose-900 md:col-span-3"
              :class="{
                'border-b border-dashed border-b-rose-900  md:py-1 md:pt-0': cardState[index],
              }"
              @click="cardState[index] = !cardState[index]"
            >
              {{ $d(new Date(item.timestamp), "long") + " - " + $t("daytime." + item.day_time) }}
            </h2>
          </div>
          <TransitionSlideFadeUp>
            <div
              v-if="cardState[index]"
              class="my-grid my-1 rounded-xl"
            >
              <div>
                <!-- leave this because I'm terrible at grid and it works like this-->
              </div>
              <DataValuesCard
                :index="index"
                :item="item"
                :compare-to="compareTo"
              ></DataValuesCard>
              <DataWeatherCard
                class="z-3 ml-2 mb-2 gap-2 md:col-start-2 md:row-start-2"
                :weather="item.weather"
              ></DataWeatherCard>
              <div
                class="col-start-3 row-start-2 hidden content-center justify-center justify-items-center gap-2 md:grid"
              >
                <ReadingDeleteButton
                  @delete-entry="showUndoDialogue"
                  :item="item"
                  :index="index"
                ></ReadingDeleteButton>
                <BaseIconButton
                  class="justify-self-start bg-rose-200 px-3 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
                  @click="setupModify(item, index)"
                  icon="edit"
                  label="modify-entry"
                  color="fill-blue-600"
                  :extra-classes="'scale-75'"
                  :text="$t('header.edit')"
                />
              </div>
            </div>
          </TransitionSlideFadeUp></div
      ></template>
    </TransitionGroup>
  </div>
  <div
    class="grid grid-cols-1"
    v-else
  >
    <BaseLoadingSpinner class="justify-self-center"></BaseLoadingSpinner>
  </div>
</template>
<style scoped>
@media screen and (min-width: 900px) {
  .my-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 39px 1fr;
    grid-gap: 3px;
  }
}
@media screen and (max-width: 900px) {
  .my-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 38px 1fr 1fr;
    grid-gap: 1px;
  }
}
.do-magic {
  height: 50px;
}

.slide-fade-leave-active .slide-fade-enter-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  scale: 50%;
  transform: translateY(-50px);
}

.slide-fade-leave-to {
  opacity: 0;
  scale: 0%;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
