<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from "vue";
import { dataStore } from "../store";

import DataWeatherCard from "./DataWeatherCard.vue";
import ExpandMore from "../assets/svg/expand-more.svg?component";
import TransitionSlideFadeUp from "./TransitionSlideFadeUp.vue";
import DataValuesCard from "./DataValuesCard.vue";
import BaseIconButton from "./BaseIconButton.vue";

const compareTo: Ref<"dayBefore" | "last"> = ref("dayBefore");

const cardState: { [index: number]: boolean } = reactive({});
onMounted(() => {
  //this won't work if dataStore changes, so fix it
  let first = 0;
  dataStore.data.forEach((e) => {
    if (first < 3) {
      cardState[e.id] = true;
      first++;
    } else cardState[e.id] = false;
  });
});
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
    <template
      v-for="(item, index) in dataStore.data.slice(0, 6)"
      :key="item.id"
    >
      <div
        class="container relative my-1 border-t-rose-200 bg-gradient-to-b from-slate-100 via-pink-50 to-rose-100 shadow-md shadow-rose-300 transition-all duration-200"
        :class="{
          'do-magic ease-out': !cardState[item.id],
          ' h-80 ease-in md:h-48': cardState[item.id],
        }"
      >
        <button
          class="absolute right-2 top-0 z-50 text-2xl"
          aria-label="toggle collapse"
          @click="cardState[item.id] = !cardState[item.id]"
        >
          <ExpandMore
            class="scale-75 fill-gray-700 transition-all hover:scale-90"
            :class="{ 'rotate-180 ease-in': cardState[item.id] }"
          />
        </button>
        <div
          class="absolute top-0 z-40 w-full border-t border-rose-200 py-2"
          :class="{ 'shadow-md shadow-rose-300': !cardState[item.id] }"
        >
          <h2
            class="z-50 mb-1 cursor-pointer place-self-center justify-self-center text-center text-lg font-semibold text-rose-900 md:col-span-3"
            :class="{
              'border-b border-dashed border-b-rose-900  md:py-1 md:pt-0': cardState[item.id],
            }"
            @click="cardState[item.id] = !cardState[item.id]"
          >
            {{ $d(new Date(item.timestamp), "long") + " - " + $t("daytime." + item.day_time) }}
          </h2>
        </div>
        <TransitionSlideFadeUp>
          <div
            v-if="cardState[item.id]"
            class="my-grid my-1 rounded-xl border-t-2"
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
              class="z-50 ml-2 mb-2 gap-2 md:col-start-2 md:row-start-2"
              :weather="item.weather"
            ></DataWeatherCard>
            <div
              class="col-start-3 row-start-2 hidden content-center justify-center justify-items-center gap-2 md:grid"
            >
              <BaseIconButton
                icon="close"
                class="justify-self-start bg-rose-200 px-2 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
                label="delete-entry"
                color="fill-red-600"
                :extra-classes="'scale-75'"
                :text="$t('controls.delete_entry')"
              />
              <BaseIconButton
                class="justify-self-start bg-rose-200 px-3 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
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

.slide-fade-enter-active,
.drop-fade-enter-active {
  transition: all 0.5s ease-out;
}
.drop-fade-leave-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.slide-fade-leave-to {
  opacity: 0;
  scale: 0%;
}

.drop-fade-enter-from {
  position: absolute;
  opacity: 0;
  transform: translateY(-50px);
}
.drop-fade-leave-to {
  position: absolute;
  opacity: 0;
  transform: translateY(-50px);
}
</style>
