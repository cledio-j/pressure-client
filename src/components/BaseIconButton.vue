<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import Settings from '../assets/svg/settings.svg?component'
import ArrowForward from '../assets/svg/arrow-forward.svg?component'
import Start from '../assets/svg/start.svg?component'
import South from '../assets/svg/south.svg?component'
import Undo from '../assets/svg/undo.svg?component'
import Check from '../assets/svg/check.svg?component'
import Close from '../assets/svg/close.svg?component'
import Delete from '../assets/svg/delete.svg?component'
import Edit from '../assets/svg/edit.svg?component'
import Refresh from '../assets/svg/refresh.svg?component'
import Cancel from '../assets/svg/cancel.svg?component'
import Error from '../assets/svg/error.svg?component'
import ToggleOn from '../assets/svg/toggle_on.svg?component'
import ToggleOff from '../assets/svg/toggle_off.svg?component'
import Paint from '@/assets/svg/paint.svg?component'

const props = withDefaults(
  defineProps<{
    color?: string
    fontSize?: string
    extraClasses?: string // if classes are needed on the inner span
    icon: string
    text?: string
    label?: string
  }>(),
  { color: 'fill-gray-600 hover:fill-gray-500' },
)

const icons: { [index: string]: FunctionalComponent } = {
  paint: Paint,
  settings: Settings,
  arrowForward: ArrowForward,
  start: Start,
  south: South,
  undo: Undo,
  check: Check,
  close: Close,
  delete: Delete,
  edit: Edit,
  refresh: Refresh,
  cancel: Cancel,
  error: Error,
  toggle_on: ToggleOn,
  toggle_off: ToggleOff,
}
</script>

<template>
  <button
    class="justify-self-start rounded-md p-0 align-middle"
    :aria-label="label"
    :class="[fontSize, { 'flex flex-row items-center': text }]"
  >
    <component
      :is="icons[icon]"
      :class="[color, extraClasses]"
    />
    {{ text }}
  </button>
</template>

<style></style>
