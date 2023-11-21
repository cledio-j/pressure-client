<script setup lang="ts">
import type { TokenResponse } from '~/types/api'

const name: Ref<string> = ref('')
const pwd: Ref<string> = ref('')

const router = useRouter()
const isFetching = ref(false)

function getHeader(): HeadersInit {
  return { Authorization: `Basic ${window.btoa(`${name.value}:${pwd.value}`)}` }
}

async function submit() {
  isFetching.value = true
  const { data, error } = await useFetch<TokenResponse>(
    'user/get-token',
    { immediate: true, auth: false, method: 'POST', headers: getHeader })
  if (error.value || !data.value) {
    // error handling
    return
  }
  const response = await data.value
  isFetching.value = false
  localStorage.tokenExpiration = response?.expires
  localStorage.token = response?.token
  router.push('/').then(() => location.reload())
}
</script>

<template>
  <form>
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
      @click.stop.prevent="submit"
    >
      Submit
      <BaseLoadingSpinner v-if="isFetching" class="ml-2" />
    </button>
  </form>
</template>
