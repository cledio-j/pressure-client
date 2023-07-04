<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type Ref, inject, reactive, ref, watch } from 'vue'
import { decideColor, getStr } from '../utils/tableFuncs'

import South from '../assets/svg/south.svg?component'
import { useDataStore } from '../store'
import { addReading } from '../utils/apiFuncs'
import ReadingCard from './ReadingCard.vue'
import BaseModal from './BaseModal.vue'
import BaseInfoSlider from './BaseInfoSlider.vue'

import TablePaginationClient from './TablePaginationClient.vue'
import { useBreakpoints } from '@/composables/breakpoints'
const props = defineProps<{
  headers: { name: string; show: boolean }[] | undefined
  color: boolean
}>()
const emits = defineEmits<{
  (e: 'update', data: Reading, index: number): void
  (e: 'moreData'): void
  (e: 'requestSort', sort_by: string, order: 'asc' | 'desc'): void
}>()
const { t } = useI18n()
const { d } = useI18n()

const tableData = reactive({
  currentPage: 1,
  perPage: 15,
})

const dataStore = useDataStore()
const { width } = useBreakpoints()

const sort = reactive({ sort_by: 'timestamp', order: 'desc' })

const firstRow = ref(0)

watch(firstRow, (newVal) => {
  if (
    newVal > dataStore.data.length - tableData.perPage
    && dataStore.data.length < dataStore.totalAvailable
  )
    emits('moreData')
})

const token = inject<Ref<string>>('token')

const viewCard = ref(false)
const cardIndex = ref() as Ref<number>
const cardData: Ref<Reading | undefined> = ref()

function showCard(item: Reading, index: number) {
  cardData.value = { ...item }
  cardIndex.value = index
  viewCard.value = true
}

function handleSort(name: string) {
  if (name === 'date' || name === 'time')
    name = 'timestamp'

  if (name === 'day_time')
    return
  if (sort.sort_by === name) {
    const order: 'asc' | 'desc' = sort.order === 'asc' ? 'desc' : 'asc'
    sort.order = order
    emits('requestSort', name, order)
  }
  else {
    sort.sort_by = name
    sort.order = 'desc'
    emits('requestSort', name, 'desc')
  }
}

function isSortedBy(name: string) {
  if (sort.sort_by === name)
    return true

  else if ((name === 'time' || name === 'date') && sort.sort_by === 'timestamp')
    return true

  return false
}

function reset(data: Reading) {
  cardData.value = { ...data }
}

// for undo dialogue
const showUndo = ref(false)
const lastDeleted: Ref<Reading | undefined> = ref()
const lastIndex: Ref<number | undefined> = ref()

function showUndoDialogue(item: Reading, index: number) {
  viewCard.value = false
  lastDeleted.value = item
  lastIndex.value = index
  showUndo.value = true
}

function addDeleted() {
  if (!token || !lastDeleted.value)
    return
  dataStore.addReading(lastDeleted.value, lastIndex.value)
  addReading(lastDeleted.value, token.value)
  showUndo.value = false
}
</script>

<template>
  <div class="max-h-screen">
    <table class="w-full border-collapse">
      <thead>
        <template v-for="item in headers">
          <th
            v-if="item.show"
            :key="item.name"
            scope="col"
            class="relative cursor-default border border-gray-400 px-2 py-2 font-semibold text-rose-700"
            :class="{ 'text-black': isSortedBy(item.name) }"
            @click="handleSort(item.name)"
          >
            <div class="flex flex-row">
              <span>{{ $t(`header.${item.name}`) }}</span>
              <South
                v-if="isSortedBy(item.name)"
                class="absolute right-0 fill-gray-600 transition-all hover:fill-gray-500"
                :class="{ 'rotate-180': sort.order === 'asc' }"
                viewBox="-5 -5 44 44"
                :height="22"
                :width="22"
              />
            </div>
          </th>
        </template>
      </thead>
      <tbody>
        <template
          v-for="(item, index) in dataStore.data.slice(firstRow, firstRow + tableData.perPage)"
          :key="index"
        >
          <tr
            class="cursor-pointer hover:bg-gray-200"
            @click="showCard(item, index)"
          >
            <template v-for="value in headers" :key="value.name">
              <td
                v-if="value.show"
                :scope="value.name === 'date' ? 'row' : ''"
                class="border border-gray-400 px-2 transition-colors duration-300"
                :class="{ 'font-mono font-semibold': value.name === 'date' }"
                :style="{
                  backgroundColor: color ? decideColor(value.name, item) : '',
                }"
              >
                {{ getStr(value.name as HeaderKey, item, t, d, width < 400) }}
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <BaseInfoSlider
      :show="showUndo"
      :info-text="$t('messages.deleted_entry')"
      :action-text="$t('messages.undo')"
      @close="showUndo = false"
      @action="addDeleted"
    />
    <BaseModal
      :showing="viewCard"
      @close="viewCard = false"
    >
      <ReadingCard
        v-if="viewCard && cardData"
        :data="cardData"
        :edit="true"
        :index="cardIndex"
        @reset="reset"
        @modify="viewCard = false"
        @delete-entry="showUndoDialogue"
      />
    </BaseModal>
    <TablePaginationClient
      v-model:current-page="tableData.currentPage"
      v-model:per-page="tableData.perPage"
      v-model:first-row="firstRow"
      :real-total="dataStore.totalAvailable"
      :total-rows="dataStore.data.length"
    />
  </div>
</template>
