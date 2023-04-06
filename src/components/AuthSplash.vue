<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from './BaseInput.vue'
import { login, useFetch } from '@/composables/fetch'
import { authStore } from '@/store'
import { Notification, useNoteStore } from '@/notifications'

const emits = defineEmits<{
  (e: 'auth:submit', name: string, pwd: string): void
}>()

const { t } = useI18n()

const noteStore = useNoteStore()

const name: Ref<string> = ref('')
const pwd: Ref<string> = ref('')

async function handleSubmit() {
  await login(name.value, pwd.value)
  if (!authStore.authorized)
    noteStore.notes.push(new Notification(t('messages.wrong_pwd'), ''))
  pwd.value = ''
}
</script>

<template>
  <div class="mt-2 grid grid-rows-3 gap-6 p-2">
    <BaseInput
      v-model="name"
      :labelstr="$t('messages.user_name')"
    />
    <BaseInput
      v-model="pwd"
      input-type="password"
      :labelstr="$t('messages.password')"
    />
    <button
      type="submit"
      class="w-20 bg-slate-300 shadow-md shadow-gray-600 hover:shadow-rose-400 focus:shadow-rose-400"
      @click.stop.prevent="handleSubmit"
    >
      Submit
    </button>
  </div>
</template>
