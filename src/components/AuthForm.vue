<script setup lang="ts">
import BaseInput from './BaseInput.vue'

const name: Ref<string> = ref('')
const pwd: Ref<string> = ref('')

async function handleSubmit() {
  const { error, data } = await useFetch('user/get-token',
    {
      immediate: true,
      auth: false,
      method: 'POST',
      headers: { Authorization: `Basic ${window.btoa(`${name.value}:${pwd.value}`)}` },
    })
  // eslint-disable-next-line no-console
  console.info(error, data)
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
      class=""
      @click.stop.prevent="handleSubmit"
    >
      Submit
    </button>
  </form>
</template>
