<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  name: string;
  modelValue: number;
}>();

const emits = defineEmits<{
  (e: "interface", fn: () => void): void;
  (e: "update:modelValue", neVal: number): void;
}>();

const validated = ref("initial");

function validate(newVal: number) {
  if (newVal == null || newVal <= 0 || newVal == 0) {
    validated.value = "error";
    return false;
  } else if (newVal < 40 || newVal > 200) {
    validated.value = "warn";
    return true;
  } else {
    validated.value = "yes";
    return true;
  }
}

function checkStuff(e: Event) {
  const target = e.target as HTMLInputElement;
  if (validate(parseInt(target.value) ? parseInt(target.value) : 0)) {
    emits("update:modelValue", parseInt(target.value));
  } else {
    emits("update:modelValue", 0);
  }
}

function reset() {
  validated.value = "initial";
}

onMounted(() => {
  emits("interface", reset);
});
</script>
<template>
  <div class="mb-2 grid grid-cols-3 justify-items-center gap-2">
    <label
      class="text-md relative justify-self-end p-2 font-medium text-gray-900"
      :for="name"
      >{{ name }}
      <span
        v-if="validated == 'error'"
        class="material-symbols-outlined absolute top-2 -right-56 text-red-800 md:-right-44"
        >warning</span
      ></label
    >
    <input
      :value="modelValue"
      :id="name"
      type="number"
      class="col-span-2 col-start-2 w-full justify-self-center rounded-lg border border-gray-300 bg-gray-50 p-1 lg:col-span-1"
      :class="{
        'bg-red-300': validated == 'error',
        'bg-green-200': validated == 'yes',
        'bg-yellow-200': validated == 'warn',
        'bg-gray-50': validated == 'initial',
      }"
      @input="(e) => checkStuff(e)"
    />
  </div>
</template>
