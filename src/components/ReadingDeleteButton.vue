<script setup lang="ts">
import BaseIconButton from "./BaseIconButton.vue";

import { deleteReading } from "../utils/apiFuncs";
import { dataStore } from "../store";
import { inject, ref, Ref } from "vue";

const props = defineProps<{ item: Reading; index: number }>();
const emits = defineEmits<{ (e: "delete-entry", data: Reading, index: number): void }>();

const token = inject<Ref<string>>("token");

async function handleDelete(item: Reading, index: number) {
  if (!token) {
    //todo: handle unauthorized
    console.log("not authorized");
    return;
  }
  //errors here should be handled in the serviceWorker
  const response = await deleteReading(item.id, token.value);
  emits("delete-entry", props.item, props.index);
  if (response && response.ok) {
    dataStore.deleteReading(index);
  }
}
</script>
<template>
  <BaseIconButton
    icon="close"
    class="justify-self-start bg-rose-200 px-2 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
    label="delete-entry"
    color="fill-red-600"
    :extra-classes="'scale-75'"
    :text="$t('controls.delete_entry')"
    @click="handleDelete(item, index)"
  ></BaseIconButton>
</template>
