<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import BaseIconButton from "./BaseIconButton.vue";
import BaseModal from "./BaseModal.vue";
import { useI18n } from "vue-i18n";
import BaseFromToDatePicker from "./BaseFromToDatePicker.vue";

const { t } = useI18n();
const { d } = useI18n();
let childInterface: () => void;
const props = defineProps<{
  showing: boolean;
}>();

const initialHeaders = [
  { name: "date", show: true },
  { name: "time", show: true },
  { name: "timestamp", show: false },
  { name: "systolic_bp", show: true },
  { name: "diastolic_bp", show: true },
  { name: "heart_rate", show: true },
  { name: "day_time", show: true },
  { name: "user_id", show: false },
  { name: "id", show: false },
  { name: "weather", show: false },
];
Object.freeze(initialHeaders);

const headers = ref(structuredClone(initialHeaders));

const emits = defineEmits<{
  (e: "new-settings", headers: any): void;
  (e: "close"): void;
}>();

// watch(
//   () => props.showing,
//   (newVal, oldVal) => {
//     if (oldVal && !newVal) emits("new-settings", headers.value);
//   }
// );

function reset() {
  headers.value = structuredClone(initialHeaders);
  childInterface();
  emits("new-settings", headers.value);
}
function getChildInterface(resetFn: () => void) {
  //grabbing child method
  childInterface = resetFn;
}
onMounted(() => {
  emits("new-settings", headers.value);
});
</script>
<template>
  <BaseModal
    @close="$emit('close')"
    :showing="showing"
  >
    <h1
      class="text-red-900 text-2xl curso font-semibold border-b border-rose-300 border-dashed pb-1 my-1"
    >
      {{ $t("messages.settings") }}
    </h1>
    <div>
      <fieldset
        @change="$emit('new-settings', headers)"
        class=""
      >
        <legend class="text-lg text-red-900 font-semibold">
          {{ $t("messages.choose_header") }}
        </legend>
        <div class="grid grid-cols-2 ml-2">
          <template v-for="item in headers"
            ><div>
              <input
                :id="'input-' + item.name"
                type="checkbox"
                class="accent-red-400"
                v-model="item.show"
              />
              <label
                class="pl-1"
                :for="'input-' + item.name"
                >{{ $t("header." + item.name) }}</label
              >
            </div>
          </template>
        </div>
      </fieldset>
    </div>
    <BaseFromToDatePicker
      class="my-1"
      v-bind="$attrs"
      @interface="getChildInterface"
    >
      <h5 class="text-lg text-red-900 font-semibold">
        {{ $t("controls.filter_by_date") }}
      </h5>
    </BaseFromToDatePicker>
    <div class="grid grid-cols-3 mt-2">
      <BaseIconButton
        aria-label="reset"
        @click="reset"
        icon="undo"
      ></BaseIconButton>
      <BaseIconButton
        aria-label="confirm"
        @click="$emit('close')"
        color="fill-green-700 hover:fill-green-500 hover:scale-110 transition-all"
        font-size="text-4xl"
        class="col-start-3 justify-self-end mr-4"
        icon="check"
      ></BaseIconButton>
    </div>
  </BaseModal>
</template>
