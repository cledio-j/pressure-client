<script setup lang="ts">
import BaseInput from './BaseInput.vue'
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import type { TokenResponse } from '~/types/api'

const name: Ref<string> = ref('')
const pwd: Ref<string> = ref('')

const router = useRouter()

function getHeader(): HeadersInit {
  return { Authorization: `Basic ${window.btoa(`${name.value}:${pwd.value}`)}` }
}

const { isFetching, error, data, execute } = await useFetch<TokenResponse>(
  'user/get-token',
  {
    immediate: false,
    auth: false,
    method: 'POST',
    headers: getHeader,
  })

async function handleSubmit() {
  await execute()
  if (!error.value && data.value) {
    localStorage.tokenExpiration = data.value.expires
    localStorage.token = data.value.token
    router.push('/')
  }
}
</script>

<template>
  <form>
    {{ error }}
    <BaseInput
      v-model:val="name"
      type="text"
      :label="$t('messages.user_name')"
    />
    <BaseInput
      v-model:val="pwd"
      type="password"
      :label="$t('messages.password')"
    />
    <button
      type="submit"
      class="mt-2 flex flex-row items-center transition-all btn"
      @click.stop.prevent="handleSubmit"
    >
      Submit
      <BaseLoadingSpinner v-if="isFetching" class="ml-2" />
    </button>
  </form>
</template>
