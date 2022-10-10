<script setup lang="ts">
import { inject, onMounted, reactive, Ref, ref } from "vue";
import { getDayTime, getTodayIsoStr } from "../utils/dateUtils";
import { invalidResponse, networkError } from "../utils/errors";
import { useI18n } from "vue-i18n";
import OcrInput from "./OcrInput.vue";
import BaseLoadingSpinner from "./BaseLoadingSpinner.vue";
import ReadingInputForm from "./ReadingInputForm.vue";
import TransitionSlideFadeUp from "./TransitionSlideFadeUp.vue";

import camera from "../assets/svg/camera.svg?component";
import expand_more from "../assets/svg/expand-more.svg?component";
import BaseIconButton from "./BaseIconButton.vue";

const { t } = useI18n();
const { d } = useI18n();

const token = inject<Ref<string>>("token");
const authorized = inject<Ref<boolean>>("authorized");
const apiUrl = inject("apiUrl");

const input: ReadingInput = reactive(getInitial());

const reset = ref(false);
const collapsed = ref(false);
const waitingForFetch = ref(false);
const angryButton = ref(false);
const animatingSymbol = ref(false);
const needValidation = ref(false);
const wantOcr = ref(false);
const entryForm = ref() as Ref<HTMLFormElement>;

function getInitial() {
  return {
    systolic_bp: 0,
    diastolic_bp: 0,
    heart_rate: 0,
    timestamp: getTodayIsoStr(),
    day_time: getDayTime(),
  };
}

function makeRequestBody() {
  return {
    timestamp: input.timestamp,
    systolic_bp: input.systolic_bp,
    diastolic_bp: input.diastolic_bp,
    heart_rate: input.heart_rate,
    day_time: input.day_time,
  };
}

function validateReadings() {
  const allValid = [input.diastolic_bp, input.systolic_bp, input.heart_rate].every((e) => {
    if (e == null || e <= 0) return false;
    else return true;
  });
  return allValid;
}

async function handleSubmit() {
  console.log("submitting");
  if (!authorized || !token) {
    console.log("not authorized");
    return;
  }
  if (validateReadings()) {
    waitingForFetch.value = true;
    const res = await fetch(apiUrl + "reading/put", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify(makeRequestBody()),
    }).catch((_error) => {
      console.log(_error);
      emits("report-error", networkError(t, handleSubmit));
    });
    if (res && !res.ok) {
      emits("report-error", invalidResponse(t, handleSubmit, res));
    }
  } else {
    angryButton.value = true;
    needValidation.value = true;
    setTimeout(() => (angryButton.value = false), 500);
    return;
  }
  waitingForFetch.value = false;
}

function switchOcr() {
  if (collapsed.value && !wantOcr.value) collapsed.value = false;
  wantOcr.value = !wantOcr.value;
  animatingSymbol.value = true;
  setTimeout(() => {
    animatingSymbol.value = false;
  }, 300);
}

const emits = defineEmits<{
  (e: "report-error", errorInfo: ErrorObj): void;
  (e: "interface:collapse", fn: () => void): void;
}>();

function collapse() {
  collapsed.value = true;
}
onMounted(() => {
  emits("interface:collapse", collapse);
});
</script>
<template>
  <div
    class="container bg-gradient-to-l from-rose-100 via-rose-50 to-rose-100 shadow-md shadow-gray-300 mt-1 transition-all duration-300"
    :class="{ 'do-magic ease-out': collapsed, 'h-22-5 ease-in': !collapsed }"
  >
    <div class="grid grid-cols-4 justify-items-center py-2">
      <h1 class="text-2xl ml-2 col-span-2 lg:col-span-1 justify-self-start lg:justify-self-end">
        Neuer Eintrag
      </h1>
      <button
        class="material-symbols-outlined justify-self-center text-3xl hover:text-gray-700"
        :class="{
          'fill-blue-800 hover:fill-blue-600 animate-pulse': wantOcr,
          shake: animatingSymbol,
        }"
        @click="switchOcr()"
      >
        <camera class="scale-75" />
      </button>
      <button
        class="material-symbols-outlined justify-self-end mr-2 text-2xl"
        @click="collapsed = !collapsed"
      >
        <expand_more
          class="transition-all"
          :class="{ 'rotate-180 ease-in': !collapsed }"
        />
      </button>
    </div>

    <TransitionSlideFadeUp>
      <div v-if="!collapsed">
        <form
          method="dialog"
          ref="entryForm"
          class="w-full p-2 grid justify-center"
          v-if="!wantOcr"
          @submit.prevent="handleSubmit"
        >
          <ReadingInputForm
            :data="input"
            :modified="false"
          ></ReadingInputForm>
          <div class="grid grid-cols-3 my-2">
            <button class="h-10 rounded-md p-0 justify-self-start ml-4">
              <BaseIconButton
                @click.prevent="
                  Object.assign(input, getInitial());
                  reset = !reset;
                "
                icon="undo"
              ></BaseIconButton>
            </button>
            <button
              type="submit"
              class="h-10 w-32 px-4 rounded-md bg-rose-200 text-lg font-semibold hover:bg-rose-300 justify-self-end mr-1"
              :class="{ 'be-angry': angryButton }"
            >
              <span v-if="!waitingForFetch">{{ $t("controls.enter") }}</span>
              <span v-else><BaseLoadingSpinner></BaseLoadingSpinner></span>
            </button>
          </div>
        </form>
        <OcrInput v-else></OcrInput>
      </div>
    </TransitionSlideFadeUp>
  </div>
</template>
<style scoped>
.do-magic {
  height: 50px;
}
.h-22-5 {
  height: 22.5rem;
}
.shake {
  animation: shake 0.22s ease-out;
}

@keyframes shake {
  50% {
    transform: scale(1.25, 1.25);
  }
}
@keyframes be-angry {
  50% {
    transform: scale(1.25, 1.25);
    background-color: red;
  }
  75% {
    transform: scale(1.1, 1.1);
    background-color: rgb(252, 130, 130);
  }
}

.be-angry {
  transition: all;
  animation: be-angry 0.22s ease-out;
}
</style>
