<script setup lang="ts">
import type { CardState } from '~/types'
import type { Reading, ValueKey } from '~/types/api'

const props = defineProps<{
  item: Reading
  state: CardState
  comparison?: Reading
}>()

defineEmits<{
  (e: 'edit', reading: Reading): void
  (e: 'delete', reading: Reading): void
}>()

const thisReading = ref<Reading>({ ...props.item })

const vals: ValueKey[] = ['systolic_bp', 'diastolic_bp', 'heart_rate']

const hasChanged = computed(() => {
  return vals.some(v => props.item[v] !== thisReading.value[v])
})

const comparisonResult = computed<Record<ValueKey, number>>(() => {
  return {
    systolic_bp: !props.comparison ? 0 : props.item.systolic_bp - props.comparison.systolic_bp,
    diastolic_bp: !props.comparison ? 0 : props.item.diastolic_bp - props.comparison.diastolic_bp,
    heart_rate: !props.comparison ? 0 : props.item.heart_rate - props.comparison.heart_rate,
  }
})
</script>

<template>
  <table class="ml-2 flex flex-row border-collapse justify-center transition-all">
    <tbody class="mb-1 mt-2">
      <tr
        v-for="val in vals"
        :key="val"
        class="h-8 w-full flex flex-row items-center p-0"
        :class="{ 'border-b border-gray-400': val !== 'heart_rate' }"
      >
        <td class="min-w-5rem">
          {{ `${$t(`header.${val}`)}: ` }}
        </td>
        <input
          v-model="thisReading[val]"
          type="number" class="max-w-5rem" :disabled="!state.edit"
        >
        <td class="grid grid-cols-2 min-h-2rem min-w-4rem place-items-center">
          <span class="">{{ comparisonResult[val] }}</span>
          <div
            class="i-ms-south"
            :class="[{
                       'rotate-180': comparisonResult[val] > 0,
                       'rotate-270': comparisonResult[val] === 0,
                     },
                     comparisonResult[val] > 0 ? 'text-error' : 'text-success',
            ]"
          />
        </td>
      </tr>
    </tbody>
    <div v-if="state.edit" class="ml-3 flex flex-col justify-center gap-2 text-2xl">
      <button
        v-if="hasChanged"
        class="round-btn"
        @click="$emit('edit', thisReading)"
      >
        <div class="i-ms-check text-success" />
      </button>
      <button
        v-if="hasChanged"
        class="round-btn"
        @click="thisReading = { ...item }"
      >
        <div class="i-ms-undo text-warning" />
      </button>
      <button
        v-else
        class="mb-2 round-btn"
        @click="$emit('delete')"
      >
        <div class="i-ms-delete" />
      </button>
    </div>
  </table>
</template>

<style scoped>
input[type="number"]:disabled, textarea {

  background-color : rgba(255, 255, 255, 0);

}
input[type="number"]:enabled, textarea {

  outline: 1px solid var(--c-primary);

}
</style>
