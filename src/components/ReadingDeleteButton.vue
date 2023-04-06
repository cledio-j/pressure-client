<script setup lang="ts">
import { type Ref, inject } from 'vue'
import { useDataStore } from '../store'
import { deleteReading } from '../utils/apiFuncs'
import BaseIconButton from './BaseIconButton.vue'
import { useFetch } from '@/composables/fetch'

const props = defineProps<{ item: Reading; index: number }>()

const emits = defineEmits<{ (e: 'deleteEntry', data: Reading, index: number): void }>()

const dataStore = useDataStore()

async function handleDelete(item: Reading, index: number) {
  // errors here should be handled in the serviceWorker
  const response = await useFetch(
    'reading/delete' + `?id=${item.id}`, { method: 'DELETE', auth: true })
  emits('deleteEntry', props.item, props.index)
  if (response && response.ok)
    dataStore.data.splice(index, 1)
}
</script>

<template>
  <BaseIconButton
    icon="close"
    class="justify-self-start bg-rose-200 px-2 shadow-sm shadow-gray-500 hover:scale-105 hover:bg-rose-300"
    label="delete-entry"
    color="fill-red-600"
    extra-classes="scale-75"
    :text="$t('controls.delete_entry')"
    @click="handleDelete(item, index)"
  />
</template>
