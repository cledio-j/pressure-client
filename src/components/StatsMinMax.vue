<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref } from "vue";
import { xDaysAgo, xDaysFromNow } from "../utils/dateUtils";
import BaseFromToDatePicker from "./BaseFromToDatePicker.vue";
import BaseLoadingSpinner from "./BaseLoadingSpinner.vue";
import BaseModal from "./BaseModal.vue";
import ReadingCard from "./ReadingCard.vue";
import BaseIconButton from "./BaseIconButton.vue";

const apiURL = inject("apiUrl");
const token = inject<Ref<string>>("token");

const from: Ref<number | Date> = ref(7);
const to: Ref<number | Date> = ref(1);

const data = ref() as Ref<MinMaxResult>; //because v-if='data' doesn't correctly narrow this
const meta: Ref<{ from: string; to: string } | undefined> = ref();
const modalData: Ref<Reading | undefined> = ref();
const showModal = ref(false);
const minMax: Ref<"min" | "max"> = ref("max");
const showMin = computed(() => {
  return minMax.value == "max" ? false : true;
});

async function getMinMax() {
  if (typeof from.value == "number") {
    from.value = xDaysAgo(from.value);
  }
  if (typeof to.value == "number") {
    to.value = xDaysFromNow(to.value);
  }
  const response = await fetch(
    apiURL +
      "readings/get-min-max" +
      `?from=${from.value.toISOString()}` +
      `&to=${to.value.toISOString()}`,
    { method: "GET", headers: { Authorization: "Bearer " + token?.value } }
  ).catch((error) => {
    console.log("network error", error);
    return;
  });
  if (!response || !response.ok) {
    console.log("something went wrong", response?.status);
    return;
  }
  const result = (await response?.json()) as MinMaxApiResponse;
  data.value = result.data;
  meta.value = result.meta;
}

function updateDate(newVal: string, field: string) {
  if (field == "from") {
    from.value = new Date(newVal);
  } else if (field == "to") {
    to.value = new Date(newVal);
  }
  getMinMax();
}

function tryGet() {
  if (token && token.value) getMinMax();
  else setTimeout(tryGet, 1000);
}

function isMobile() {
  return screen.availWidth <= 600;
}

onMounted(() => {
  tryGet();
});

function makeModal(data: Reading | undefined) {
  if (!data) return;
  showModal.value = true;
  modalData.value = data;
}
</script>
<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-6">
      <BaseFromToDatePicker
        class="col-span-2 align-middle"
        @new-date="(newVal, field) => updateDate(newVal, field)"
        :buttonVals="[7, 30, 365]"
        :from-date-minus="7"
        :to-date-plus="0"
      ></BaseFromToDatePicker>
      <div class="grid grid-cols-3 content-center justify-items-center">
        <span class="material-symbols-sharp col-start-2 my-2 align-middle text-4xl"
          ><BaseIconButton
            label="disabled"
            class="cursor-default"
            :icon="isMobile() ? 'south' : 'start'"
            color="fill-gray-800"
          ></BaseIconButton
        ></span>
      </div>
      <BaseIconButton
        :icon="showMin ? 'toggle_on' : 'toggle_off'"
        @click="showMin ? (minMax = 'max') : (minMax = 'min')"
        label="Toggle-min-max"
      ></BaseIconButton>
      <table
        class="col-span-2"
        v-if="data"
      >
        <thead>
          <th class="cursor-default border border-r-2 border-r-gray-400 p-1"></th>
          <th class="cursor-default border p-1">{{ $t("header.systolic_bp") }}</th>
          <th class="cursor-default border p-1">{{ $t("header.diastolic_bp") }}</th>
        </thead>
        <tbody>
          <template v-for="item in (['morning', 'lunch', 'evening'] as DayTimeStr[])">
            <tr class="hover:bg-gray-50">
              <th class="cursor-default border border-r-2 border-r-gray-400 p-1">
                {{ $t("daytime." + item) }}
              </th>
              <td
                class="w-24 cursor-pointer border p-1 hover:bg-rose-100 hover:font-semibold"
                @click="makeModal(data[`${item}_${minMax}_systolic_bp`])"
              >
                {{ data[`${item}_${minMax}_systolic_bp`].systolic_bp }}
              </td>
              <td
                class="w-24 cursor-pointer border p-1 hover:bg-rose-100 hover:font-semibold"
                @click="makeModal(data[`${item}_${minMax}_diastolic_bp`])"
              >
                {{ data[`${item}_${minMax}_diastolic_bp`].diastolic_bp }}
              </td>
            </tr>
          </template>
          <tr class="broder-t border-t-2 border-t-gray-400">
            <th class="cursor-default border border-r-2 border-r-gray-400 p-1">
              {{ $t("messages.total") }}
            </th>
            <td
              class="w-24 cursor-pointer border p-1 font-semibold hover:bg-rose-100 hover:font-bold"
              @click="makeModal(data[`total_${minMax}_systolic_bp`])"
            >
              {{ data[`total_${minMax}_systolic_bp`].systolic_bp }}
            </td>
            <td
              class="w-24 cursor-pointer border p-1 font-semibold hover:bg-rose-100 hover:font-bold"
              @click="makeModal(data[`total_${minMax}_diastolic_bp`])"
            >
              {{ data[`total_${minMax}_diastolic_bp`].diastolic_bp }}
            </td>
          </tr>
        </tbody>
      </table>
      <BaseLoadingSpinner v-else></BaseLoadingSpinner>
      <BaseModal
        @close="showModal = false"
        v-if="modalData"
        :showing="showModal"
        ><ReadingCard
          :frozen="true"
          :data="modalData"
          :edit="false"
        ></ReadingCard
      ></BaseModal>
    </div>
  </div>
</template>
