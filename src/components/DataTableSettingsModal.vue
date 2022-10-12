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
  fromDateMinus: number;
  toDatePlus: number;
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
      class="curso my-1 border-b border-dashed border-rose-300 pb-1 text-2xl font-semibold text-red-900"
    >
      {{ $t("messages.settings") }}
    </h1>
    <div>
      <fieldset
        @change="$emit('new-settings', headers)"
        class=""
      >
        <legend class="text-lg font-semibold text-red-900">
          {{ $t("messages.choose_header") }}
        </legend>
        <div class="ml-2 grid grid-cols-2">
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
      :from-date-minus="fromDateMinus"
      :to-date-plus="toDatePlus"
      @interface="getChildInterface"
    >
      <h5 class="text-lg font-semibold text-red-900">
        {{ $t("controls.filter_by_date") }}
      </h5>
    </BaseFromToDatePicker>
    <div class="mt-2 grid grid-cols-3">
      <BaseIconButton
        label="reset-form"
        @click="reset"
        icon="undo"
      ></BaseIconButton>
      <BaseIconButton
        label="submit-form"
        @click="$emit('close')"
        color="fill-green-700 hover:fill-green-500 hover:scale-110 transition-all"
        font-size="text-4xl"
        class="col-start-3 mr-4 justify-self-end"
        icon="check"
      ></BaseIconButton>
    </div>
  </BaseModal>
</template>
