<script setup lang="ts">
import { computed, watch } from "vue";
import ReadingInputForm from "./ReadingInputForm.vue";
import BaseIconButton from "./BaseIconButton.vue";

const emits = defineEmits<{
  (e: "reset", data: Reading): void;
  (e: "modify"): void;
  (e: "delete-entry"): void;
}>();

const props = defineProps<{ data: Reading; edit: boolean }>();
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
</script>
<template>
  <div class="p-1">
    <h1 class="text-red-900 text-xl font-semibold border-b border-rose-300 border-dashed pb-1 my-1">
      {{ $t("messages.reading_from") + " " + $d(new Date(data.timestamp), "long") }}
    </h1>
    <h2 class="text-lg text-red-900 font-semibold">{{ $t("messages.values") }}</h2>
    <ReadingInputForm
      :modified="modified"
      @interface:reset="getChildResetter"
      :data="data"
    ></ReadingInputForm>
    <details>
      <summary>{{ $t("header.weather") }}</summary>
      <div class="ml-2">
        <p v-for="(value, key) in data.weather">{{ key + ": " + value }}</p>
      </div>
    </details>
    <transition name="slide-fade">
      <div
        v-if="edit && modified"
        class="border border-dashed border-rose-300 p-2 bg-rose-50"
      >
        <h2 class="text-lg text-red-900 font-semibold">{{ $t("messages.edit_reading") }}</h2>
        <div class="grid grid-cols-2 mt-1">
          <BaseIconButton
            @click="reset"
            class="shadow-sm shadow-rose-400 hover:bg-rose-200 bg-rose-100 text-gray-900 hover:text-black hover:scale-105 pt-1 hover:font-semibold px-1"
            icon="undo"
            :text="$t('controls.reset')"
            color="text-red-900 hover:text-red-800"
          ></BaseIconButton>
          <BaseIconButton
            @click="$emit('modify')"
            class="shadow-sm shadow-rose-400 hover:bg-rose-200 bg-rose-100 text-gray-900 hover:text-black hover:scale-105 pt-1 hover:font-semibold px-1 justify-self-end"
            icon="check"
            :text="$t('controls.confirm')"
            color="fill-green-700"
          ></BaseIconButton>
        </div></div
    ></transition>
    <div class="mt-2 pt-1 grid grid-cols-1">
      <BaseIconButton
        icon="delete"
        @click="$emit('delete-entry')"
        class="shadow-sm shadow-rose-400 hover:bg-rose-200 bg-rose-100 text-gray-900 hover:text-black hover:scale-105 pt-1 hover:font-semibold px-1 text-lg font-semibold justify-self-center"
        :extra-classes="'scale-75'"
        :text="$t('controls.delete_entry')"
        color="fill-red-700"
      ></BaseIconButton>
    </div>
  </div>
</template>
<style>
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
