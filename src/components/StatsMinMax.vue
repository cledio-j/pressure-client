<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
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

const data: Ref<MinMaxResult | undefined> = ref();
const meta: Ref<{ from: string; to: string } | undefined> = ref();
const modalData: Ref<Reading | undefined> = ref();
const showModal = ref(false);

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
    <div class="grid md:grid-cols-6 grid-cols-1">
      <BaseFromToDatePicker
        class="align-middle col-span-2"
        @new-date="(newVal, field) => updateDate(newVal, field)"
        :buttonVals="[7, 30, 365]"
        :from-date-minus="7"
        :to-date-plus="0"
      ></BaseFromToDatePicker>
      <div class="grid grid-cols-3 content-center justify-items-center">
        <span class="material-symbols-sharp text-4xl col-start-2 align-middle my-2"
          ><BaseIconButton
            class="cursor-default"
            :icon="isMobile() ? 'south' : 'start'"
            color="fill-gray-800"
          ></BaseIconButton
        ></span>
      </div>
      <table
        class="col-span-2"
        v-if="data"
      >
        <thead>
          <th class="border"></th>
          <th class="p-1 border cursor-default">{{ $t("header.systolic_bp") }}</th>
          <th class="p-1 border cursor-default">{{ $t("header.diastolic_bp") }}</th>
        </thead>
        <tbody>
          <tr>
            <th class="p-1 border cursor-default">max</th>
            <td
              class="p-1 border cursor-pointer w-24 hover:font-semibold hover:bg-rose-100"
              @click="makeModal(data?.max_systolic_bp)"
            >
              {{ data.max_systolic_bp.systolic_bp }}
            </td>
            <td
              class="p-1 border cursor-pointer w-24 hover:font-semibold hover:bg-rose-100"
              @click="makeModal(data?.max_diastolic_bp)"
            >
              {{ data.max_diastolic_bp.diastolic_bp }}
            </td>
          </tr>
          <tr>
            <th class="p-1 border cursor-default">min</th>
            <td
              class="p-1 border cursor-pointer w-24 hover:font-semibold hover:bg-rose-100"
              @click="makeModal(data?.min_systolic_bp)"
            >
              {{ data.min_systolic_bp.systolic_bp }}
            </td>
            <td
              @click="makeModal(data?.min_diastolic_bp)"
              class="p-1 border cursor-pointer w-24 hover:font-semibold hover:bg-rose-100"
            >
              {{ data.min_diastolic_bp.diastolic_bp }}
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
          :data="modalData"
          :edit="false"
        ></ReadingCard
      ></BaseModal>
    </div>
  </div>
</template>
