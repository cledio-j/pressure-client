<script setup lang="ts">
import { computed, inject, Ref, watch } from "vue";
import ReadingInputForm from "./ReadingInputForm.vue";
import BaseIconButton from "./BaseIconButton.vue";
import DataWeatherCard from "./DataWeatherCard.vue";
import ReadingDeleteButton from "./ReadingDeleteButton.vue";
import { modifyReading } from "../utils/apiFuncs";
import { dataStore } from "../store";

const emits = defineEmits<{
  (e: "reset", data: Reading): void;
  (e: "modify"): void;
  (e: "delete-entry", data: Reading, index: number): void;
}>();

const token = inject<Ref<string>>("token");

const props = defineProps<{ data: Reading; edit: boolean; index: number }>();
const initialData: Reading = { ...props.data };
Object.freeze(initialData);

const modified = computed(() => {
  //checks if the initial Reading data has been changed
  return !Object.keys(initialData).every(
    (key) => initialData[key as keyof Reading] == props.data[key as keyof Reading]
  );
});

let resetForm: () => void;
function getChildResetter(resetFn: () => void) {
  resetForm = resetFn;
}

function reset() {
  resetForm();
  emits("reset", initialData);
}

async function handleModify() {
  if (!token) {
    console.log("not authorized");
    return;
  }
  const response = modifyReading(props.data.id, token.value, props.data);
  dataStore.updateReading(props.data, props.index);
  emits("modify");
}
</script>
<template>
  <div class="p-1">
    <h1 class="my-1 border-b border-dashed border-rose-300 pb-1 text-xl font-semibold text-red-900">
      {{ $t("messages.reading_from") + " " + $d(new Date(data.timestamp), "long") }}
    </h1>
    <h2 class="text-lg font-semibold text-red-900">{{ $t("messages.values") }}</h2>
    <ReadingInputForm
      :frozen="!edit"
      :modified="modified"
      @interface:reset="getChildResetter"
      :data="data"
    ></ReadingInputForm>
    <DataWeatherCard
      v-if="data.weather"
      :weather="data.weather"
    ></DataWeatherCard>
    <transition name="slide-fade">
      <div
        v-if="edit && modified"
        class="border border-dashed border-rose-300 bg-rose-50 p-2"
      >
        <h2 class="text-lg font-semibold text-red-900">{{ $t("messages.edit_reading") }}</h2>
        <div class="mt-1 grid grid-cols-2">
          <BaseIconButton
            @click="reset"
            class="bg-rose-100 px-1 pt-1 text-gray-900 shadow-sm shadow-rose-400 hover:scale-105 hover:bg-rose-200 hover:font-semibold hover:text-black"
            icon="undo"
            label="reset form"
            :text="$t('controls.reset')"
            color="text-red-900 hover:text-red-800"
          ></BaseIconButton>
          <BaseIconButton
            @click="handleModify"
            label="submit form"
            class="justify-self-end bg-rose-100 px-1 pt-1 text-gray-900 shadow-sm shadow-rose-400 hover:scale-105 hover:bg-rose-200 hover:font-semibold hover:text-black"
            icon="check"
            :text="$t('controls.confirm')"
            color="fill-green-700"
          ></BaseIconButton>
        </div></div
    ></transition>
    <div
      v-if="edit"
      class="mt-2 grid grid-cols-1 pt-1"
    >
      <ReadingDeleteButton
        class="justify-self-center"
        @delete-entry="(data, index) => $emit('delete-entry', data, index)"
        :item="data"
        :index="index"
      ></ReadingDeleteButton>
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
