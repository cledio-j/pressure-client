<script setup lang="ts">
import { Ref, ref } from "vue";
import BaseInput from "./BaseInput.vue";

const emits = defineEmits<{
  (e: "auth:submit", name: string, pwd: string): void;
}>();

const name: Ref<string> = ref("");
const pwd: Ref<string> = ref("");

function handleSubmit() {
  emits('auth:submit', name.value, pwd.value)
  pwd.value = ''
}
</script>
<template>
  <div class="mt-2 grid grid-rows-3 gap-6 p-2">
    <BaseInput
      v-model="name"
      :labelstr="$t('messages.user_name')"
    ></BaseInput>
    <BaseInput
      v-model="pwd"
      input-type="password"
      :labelstr="$t('messages.password')"
    ></BaseInput>
    <button
      @click="handleSubmit"
      class="w-20 bg-slate-300 shadow-md shadow-gray-600"
    >
      Submit
    </button>
  </div>
</template>
