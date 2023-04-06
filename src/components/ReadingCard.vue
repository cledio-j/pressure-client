<script setup lang="ts">
import { type Ref, computed, inject } from 'vue'
import { modifyReading } from '../utils/apiFuncs'
import ReadingInputForm from './ReadingInputForm.vue'
import BaseIconButton from './BaseIconButton.vue'
import DataWeatherCard from './DataWeatherCard.vue'
import ReadingDeleteButton from './ReadingDeleteButton.vue'
import { useFetch } from '@/composables/fetch'

const props = defineProps<{ data: Reading; edit: boolean; index: number }>()

const emits = defineEmits<{
  (e: 'reset', data: Reading): void
  (e: 'modify', data: Reading, index: number): void
  (e: 'deleteEntry', data: Reading, index: number): void
}>()

const initialData: Reading = { ...props.data }
Object.freeze(initialData)

const modified = computed(() => {
  // checks if the initial Reading data has been changed
  return !Object.keys(initialData).every(
    key => initialData[key as keyof Reading] === props.data[key as keyof Reading],
  )
})

let resetForm: () => void
function getChildResetter(resetFn: () => void) {
  resetForm = resetFn
}

function reset() {
  resetForm()
  emits('reset', initialData)
}

async function handleModify() {
  await useFetch('reading/modify' + `?id=${props.data.id}`,
    { method: 'POST', auth: true, body: JSON.stringify(props.data) })
  emits('modify', props.data, props.index)
}
</script>

<template>
  <div class="p-1">
    <h1 class="my-1 border-b border-dashed border-rose-300 pb-1 text-xl font-semibold text-red-900">
      {{ `${$t("messages.reading_from")} ${$d(new Date(data.timestamp), "long")}` }}
    </h1>
    <h2 class="text-lg font-semibold text-red-900">
      {{ $t("messages.values") }}
    </h2>
    <ReadingInputForm
      :frozen="!edit"
      :modified="modified"
      :data="data"
      @interface:reset="getChildResetter"
    />
    <DataWeatherCard
      v-if="data.weather"
      :weather="data.weather"
    />
    <transition name="slide-fade">
      <div
        v-if="edit && modified"
        class="border border-dashed border-rose-300 bg-rose-50 p-2"
      >
        <h2 class="text-lg font-semibold text-red-900">
          {{ $t("messages.edit_reading") }}
        </h2>
        <div class="mt-1 grid grid-cols-2">
          <BaseIconButton
            class="bg-rose-100 px-1 pt-1 text-gray-900 shadow-sm shadow-rose-400 hover:scale-105 hover:bg-rose-200 hover:font-semibold hover:text-black"
            icon="undo"
            label="reset form"
            :text="$t('controls.reset')"
            color="text-red-900 hover:text-red-800"
            @click="reset"
          />
          <BaseIconButton
            label="submit form"
            class="justify-self-end bg-rose-100 px-1 pt-1 text-gray-900 shadow-sm shadow-rose-400 hover:scale-105 hover:bg-rose-200 hover:font-semibold hover:text-black"
            icon="check"
            :text="$t('controls.confirm')"
            color="fill-green-700"
            @click="handleModify"
          />
        </div>
      </div>
    </transition>
    <div
      v-if="edit"
      class="mt-2 grid grid-cols-1 pt-1"
    >
      <ReadingDeleteButton
        class="justify-self-center"
        :item="data"
        :index="index"
        @delete-entry="(data, index) => $emit('deleteEntry', data, index)"
      />
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
