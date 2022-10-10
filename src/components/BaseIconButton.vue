<script setup lang="ts">
import { FunctionalComponent } from "vue";
import Paint from "../assets/svg/paint.svg?component";
import Settings from "../assets/svg/settings.svg?component";
import ArrowForward from "../assets/svg/arrow-forward.svg?component";
import Start from "../assets/svg/start.svg?component";
import South from "../assets/svg/south.svg?component";
import Undo from "../assets/svg/undo.svg?component";
import Check from "../assets/svg/check.svg?component";
import Close from "../assets/svg/close.svg?component";
import Delete from "../assets/svg/delete.svg?component";

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
};

const props = withDefaults(
  defineProps<{
    color?: string;
    fontSize?: string;
    extraClasses?: string; //if classes are needed on the inner span
    icon: string;
    text?: string;
  }>(),
  { color: "fill-gray-600 hover:fill-gray-500" }
);
</script>
<template>
  <button
    class="rounded-md p-0 justify-self-start align-middle"
    :class="[fontSize, { 'flex flex-row items-center': text }]"
  >
    <component
      :class="[color, extraClasses]"
      :is="icons[icon]"
    />
    {{ text }}
  </button>
</template>
<style></style>
