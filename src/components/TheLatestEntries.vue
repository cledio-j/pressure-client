<script setup lang="ts">
import { type Ref, inject, onBeforeMount, reactive, ref } from 'vue'
import { useDataStore } from '../store'
import ExpandMore from '../assets/svg/expand-more.svg?component'
import Cloudy from '../assets/svg/weather/cloudy.svg?component'
import Edit from '../assets/svg/edit.svg?component'
import DataWeatherCard from './DataWeatherCard.vue'
import TransitionSlideFadeUp from './TransitionSlideFadeUp.vue'
import DataValuesCard from './DataValuesCard.vue'
import BaseIconButton from './BaseIconButton.vue'
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import ReadingDeleteButton from './ReadingDeleteButton.vue'
import BaseInfoSlider from './BaseInfoSlider.vue'
import ReadingCard from './ReadingCard.vue'
import BaseModal from './BaseModal.vue'
import BaseBubbleButton from './BaseBubbleButton.vue'
import { useFetch } from '@/composables/fetch'

const compareTo: Ref<'dayBefore' | 'last'> = ref('dayBefore')
const width = inject<Ref<number>>('width')

const showUndo = ref(false)
const showCard = ref(false)
const lastDeleted: Ref<Reading | undefined> = ref()
const lastIndex: Ref<number | undefined> = ref()

const cardData: Ref<Reading | undefined> = ref()
const cardIndex: Ref<number | undefined> = ref()

const cardState: CardState = reactive({})
const dataStore = useDataStore()

onBeforeMount(() => {
  // make first three items expanded, rest closed
  for (let i = 0; i < 6; i++)
    cardState[i] = { collapse: i < 3, weather: false, edit: false }
})

function showUndoDialogue(item: Reading, index: number) {
  lastDeleted.value = item
  lastIndex.value = index
  showUndo.value = true
  showCard.value = false
}

function addDeleted() {
  if (!lastDeleted.value)
    return
  dataStore.addReading(lastDeleted.value, lastIndex.value)
  useFetch('reading/put', { method: 'PUT', auth: true, body: JSON.stringify(lastDeleted.value) })
  showUndo.value = false
}

function setupModify(item: Reading, index: number) {
  cardData.value = item
  cardIndex.value = index
  showCard.value = true
}

function resetModifyCard(data: Reading) {
  cardData.value = { ...data }
}

function toggleWeather(index: number) {
  cardState[index].weather = !cardState[index].weather
}
function toggleEdit(index: number) {
  cardState[index].edit = !cardState[index].edit
}

function handleModify(data: Reading, index: number) {
  showCard.value = false
  dataStore.updateReading(data, index)
}
</script>

<template>
  <div
    v-if="dataStore.data.length > 0"
    class="relative grid grid-cols-1 transition-all"
  >
    <BaseInfoSlider
      :show="showUndo"
      :info-text="$t('messages.deleted_entry')"
      :action-text="$t('messages.undo')"
      @close="showUndo = false"
      @action="addDeleted"
    />
    <BaseModal
      v-if="showCard && cardData && (cardIndex || cardIndex === 0)"
      :showing="showCard"
      @close="showCard = false"
    >
      <ReadingCard
        :data="cardData"
        :index="cardIndex"
        :edit="true"
        @reset="resetModifyCard"
        @modify="handleModify"
        @delete-entry="showUndoDialogue"
      />
    </BaseModal>
    <TransitionGroup name="list">
      <template
        v-for="(item, index) in dataStore.data.slice(0, 6)"
        :key="item.id"
      >
        <div
          class="relative my-1 border-t-rose-200 bg-gradient-to-b from-slate-100 via-pink-50 to-rose-100 shadow-sm shadow-rose-200 transition-all duration-200"
          :class="{
            'h-[50px] ease-out': !cardState[index].collapse,
          }"
        >
          <button
            class="z-1 absolute right-2 top-0 text-2xl"
            aria-label="toggle collapse"
            @click="cardState[index].collapse = !cardState[index].collapse"
          >
            <ExpandMore
              class="scale-75 fill-gray-700 transition-all hover:scale-90"
              :class="{ 'rotate-180 ease-in': cardState[index].collapse }"
            />
          </button>
          <div
            class="absolute top-0 z-40 w-full border-t border-rose-200 py-2"
            :class="{ 'shadow-sm shadow-rose-200': !cardState[index].collapse }"
          >
            <h2
              class="z-50 mb-1 cursor-pointer place-self-center justify-self-center text-center text-lg font-semibold text-rose-900 md:col-span-3"
              :class="{
                'border-b border-dashed border-b-rose-900  md:py-1 md:pt-0':
                  cardState[index].collapse,
              }"
              @click="cardState[index].collapse = !cardState[index].collapse"
            >
              {{ `${$d(new Date(item.timestamp), "long")} - ${$t(`daytime.${item.day_time}`)}` }}
            </h2>
          </div>
          <TransitionSlideFadeUp>
            <div
              v-if="cardState[index].collapse"
              class="my-grid my-1 rounded-xl"
            >
              <div class="absolute top-12 -left-2 md:invisible">
                <BaseBubbleButton
                  :icon="Cloudy"
                  :toggle-fn="() => toggleWeather(index)"
                  :active="cardState[index].weather"
                />
              </div>
              <div class="absolute top-24 -left-2 md:invisible">
                <BaseBubbleButton
                  :icon="Edit"
                  :toggle-fn="() => toggleEdit(index)"
                  :active="cardState[index].edit"
                />
              </div>
              <div>
                <!-- leave this because I'm terrible at grid and it works like this -->
              </div>
              <DataValuesCard
                class="justify-self-center md:row-span-1 md:row-start-2 md:justify-self-start md:px-0"
                :index="index"
                :item="item"
                :compare-to="compareTo"
              />
              <TransitionSlideFadeUp>
                <DataWeatherCard
                  v-if="cardState[index].weather || (width && width > 640)"
                  class="z-3 row-start-3 ml-2 mb-2 gap-2 md:col-start-2 md:row-start-2"
                  :weather="item.weather"
                />
              </TransitionSlideFadeUp>
              <TransitionSlideFadeUp>
                <div
                  v-if="cardState[index].edit || (width && width > 900)"
                  class="z-4 row-start-4 grid content-center justify-center justify-items-center gap-2 md:col-start-3 md:row-start-2"
                  :class="{ 'row-start-2': cardState[index].edit && !cardState[index].weather }"
                >
                  <ReadingDeleteButton
                    :item="item"
                    :index="index"
                    @delete-entry="showUndoDialogue"
                  />
                  <BaseIconButton
                    class="justify-self-start bg-rose-200 px-3 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
                    icon="edit"
                    label="modify-entry"
                    color="fill-blue-600"
                    extra-classes="scale-75"
                    :text="$t('header.edit')"
                    @click="setupModify(item, index)"
                  />
                </div>
              </TransitionSlideFadeUp>
            </div>
          </TransitionSlideFadeUp>
        </div>
      </template>
    </TransitionGroup>
    <div class="mb-1 md:mb-0 md:absolute md:top-3 md:left-10 z-50 flex flex-row justify-center gap-1 text-gray-800 md:visible">
      <span>{{ $t("messages.compare_to") }}</span>
      <button
        class="border border-rose-200 px-2 italic text-gray-600 hover:bg-gray-200"
        @click="compareTo === 'last' ? (compareTo = 'dayBefore') : (compareTo = 'last')"
      >
        {{ compareTo === "last" ? $t("messages.last_entry") : $t("messages.day_before") }}
      </button>
    </div>
  </div>
  <div
    v-else
    class="grid grid-cols-1"
  >
    <BaseLoadingSpinner class="justify-self-center" />
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
    grid-template-rows: 38px 1fr;
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
