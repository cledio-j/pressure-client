<script setup lang="ts">
import { type Ref, computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { xDaysAgo, xDaysFromNow } from '../utils/dateUtils'
import BaseFromToDatePicker from './BaseFromToDatePicker.vue'
import BaseLoadingSpinner from './BaseLoadingSpinner.vue'
import BaseModal from './BaseModal.vue'
import ReadingCard from './ReadingCard.vue'
import BaseIconButton from './BaseIconButton.vue'
import { useFetch } from '@/composables/fetch'
import { authStore } from '@/store'
import { Notification, useNoteStore } from '@/notifications'

const from: Ref<number | Date> = ref(7)
const to: Ref<number | Date> = ref(1)

const { t } = useI18n()

const noteStore = useNoteStore()

const data = ref() as Ref<MinMaxResult> // because v-if='data' doesn't correctly narrow this
const meta: Ref<{ from: string; to: string } | undefined> = ref()
const modalData: Ref<Reading | undefined> = ref()
const showModal = ref(false)
const minMax: Ref<'min' | 'max'> = ref('max')
const showMin = computed(() => {
  return minMax.value !== 'max'
})

async function getMinMax() {
  if (typeof from.value == 'number')
    from.value = xDaysAgo(from.value)

  if (typeof to.value == 'number')
    to.value = xDaysFromNow(to.value)

  try {
    const response = await useFetch(
      `readings/get-min-max?from=${from.value.toISOString()}&to=${to.value.toISOString()}`,
      { auth: true, method: 'GET' })
    const result = (await response?.json()) as MinMaxApiResponse
    data.value = result.data
    meta.value = result.meta
  }
  catch (error) {
    if (error === 404) {
      noteStore.notes.push(
        new Notification(t('messages.network_error_title'), t('messages.network_error_info')))
    }
    else if (error === 401) {
      noteStore.notes.push(new Notification(t('messages.unauthorized'), '',
        [{
          name: 'new_login',
          action: () => {
            authStore.authorized = false
            authStore.token = ''
          },
        }]))
    }
  }
}

function updateDate(newVal: string, field: string) {
  if (field === 'from')
    from.value = new Date(newVal)

  else if (field === 'to')
    to.value = new Date(newVal)

  getMinMax()
}

function tryGet() {
  if (authStore.authorized)
    getMinMax()
  else setTimeout(tryGet, 2000)
}

function isMobile() {
  return screen.availWidth <= 600
}

onMounted(() => {
  tryGet()
})

function makeModal(data: Reading | undefined) {
  if (!data)
    return
  showModal.value = true
  modalData.value = data
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-6">
      <BaseFromToDatePicker
        class="col-span-2 align-middle"
        :button-vals="[7, 30, 365]"
        :from-date-minus="7"
        :to-date-plus="0"
        @new-date="(newVal, field) => updateDate(newVal, field)"
      />
      <div class="grid grid-cols-3 content-center justify-items-center">
        <span class="material-symbols-sharp col-start-2 my-2 align-middle text-4xl"><BaseIconButton
          label="disabled"
          class="cursor-default"
          :icon="isMobile() ? 'south' : 'start'"
          color="fill-gray-800"
        /></span>
      </div>
      <table
        v-if="data"
        class="col-span-2"
      >
        <thead>
          <th class="cursor-default border border-r-2 border-r-gray-400 p-1">
            <BaseIconButton
              id="toggleMinMax"
              :icon="showMin ? 'toggle_on' : 'toggle_off'"
              label="Toggle-min-max"
              @click="showMin ? (minMax = 'max') : (minMax = 'min')"
            />
          </th>
          <th class="cursor-default border p-1">
            {{ $t("header.systolic_bp") }}
          </th>
          <th class="cursor-default border p-1">
            {{ $t("header.diastolic_bp") }}
          </th>
        </thead>
        <tbody>
          <template v-for="item in (['morning', 'lunch', 'evening'] as DayTimeStr[])" :key="item">
            <tr class="hover:bg-gray-50">
              <th class="cursor-default border border-r-2 border-r-gray-400 p-1">
                {{ $t(`daytime.${item}`) }}
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
      <BaseLoadingSpinner v-else />
      <BaseModal
        v-if="modalData"
        :showing="showModal"
        @close="showModal = false"
      >
        <ReadingCard
          :frozen="true"
          :data="modalData"
          :edit="false"
          :index="0"
        />
      </BaseModal>
    </div>
  </div>
</template>
