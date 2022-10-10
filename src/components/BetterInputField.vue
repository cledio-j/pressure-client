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
  <div class="grid grid-cols-3 mb-2 gap-2 justify-items-center">
    <label
      class="relative text-md font-medium text-gray-900 p-2 justify-self-end"
      for="sysInput"
      >{{ name }}
      <span
        v-if="validated == 'error'"
        class="absolute top-2 md:-right-44 -right-56 material-symbols-outlined text-red-800"
        >warning</span
      ></label
    >
    <input
      :value="modelValue"
      id="sysInput"
      type="number"
      class="p-1 border border-gray-300 rounded-lg bg-gray-50 w-full justify-self-center col-start-2 col-span-2 lg:col-span-1"
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
