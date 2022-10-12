<script setup lang="ts">
import BaseModal from "./BaseModal.vue";
import BaseIconButton from "./BaseIconButton.vue";

const props = defineProps<{ error: ErrorObj }>();
const emits = defineEmits<{
  (e: "user-responded"): void;
}>();

const attrsForAction = {
  retry: { icon: "refresh", color: "text-blue-900 hover:text-blue-500" },
  cancel: { icon: "cancel", color: "text-red-900 hover:text-red-700" },
};

function doErrorAction(error: ErrorAction) {
  emits("user-responded");
  error.func();
}
</script>
<template>
  <BaseModal :showing="error.active">
    <h1
      class="curso my-1 border-b border-dashed border-rose-300 pb-1 align-middle text-2xl font-semibold text-red-900"
    >
      <span
        v-if="error.severity == 'fatal'"
        class="material-symbols-outlined pb-1 align-middle text-3xl text-red-600"
        >error</span
      >
      <span
        v-else-if="error.severity == 'warn'"
        class="material-symbols-outlined pb-1 align-middle text-3xl text-yellow-400"
        >warning</span
      >
      <span
        v-else
        class="material-symbols-outlined pb-1 align-middle text-3xl text-blue-600"
        >info</span
      >
      {{ error.title }}
    </h1>
    <p class="ml-1">{{ error.message }}</p>
    {{ error.details }}
    <div class="mt-2 flex flex-row">
      <template v-for="item in error.options"
        ><BaseIconButton
          :icon="attrsForAction[item.name].icon"
          :text="$t('controls.' + item.name)"
          class="border bg-rose-100 px-2 shadow-sm shadow-gray-200 hover:bg-rose-200"
          :color="attrsForAction[item.name].color"
          extra-classes="pr-1 pb-0.5"
          font-size="text-2xl"
          :label="item.name"
          @click.stop.prevent="doErrorAction(item)"
        ></BaseIconButton>
      </template></div
  ></BaseModal>
</template>
