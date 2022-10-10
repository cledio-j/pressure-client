<script setup lang="ts">
import { nextTick, onMounted, Ref, ref } from "vue";

const player: Ref<HTMLVideoElement | undefined> = ref();
const playerDiv: Ref<HTMLDivElement | undefined> = ref();
const videoAvailable = ref(false);
const inFullscreen = ref(false);

onMounted(async () => {
  const deviceList = await navigator.mediaDevices.enumerateDevices();
  if (deviceList.some((device) => device.kind === "videoinput")) {
    videoAvailable.value = true;
    nextTick(() => getVideo());
  } else videoAvailable.value = false;
});

const constraints = {
  audio: false,
  video: {
    facingMode: "environment",
    width: { ideal: window.screen.width * 1.735 },
    height: { ideal: window.screen.width },
  },
};

async function getVideo() {
  if (!player.value || !playerDiv.value) return;
  const video = await navigator.mediaDevices.getUserMedia(constraints);
  player.value.srcObject = video;
  const fs = await playerDiv.value.requestFullscreen({ navigationUI: "show" });
  inFullscreen.value = true;
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    inFullscreen.value = false;
    document.exitFullscreen();
  }
}

function fsChange() {
  //this makes sure inFullscreen gets updated when user manually exits (broswer nav) FS
  if (!document.fullscreenElement) {
    inFullscreen.value = false;
  } else {
    inFullscreen.value = true;
  }
}
</script>
<template>
  <div class="h-full">
    <div
      v-if="videoAvailable"
      :class="{ 'grid grid-cols-3': !inFullscreen }"
      ref="playerDiv"
      @fullscreenchange="fsChange"
    >
      <video
        class="col-start-2"
        ref="player"
        autoplay
      ></video>
      <div
        :class="{
          'fixed right-1 top-5 grid grid-rows-2 bg-blue-200 bg-opacity-25 rounded-lg': inFullscreen,
          'col-start-3 flex flex-col': !inFullscreen,
        }"
      >
        <button @click="exitFullscreen">
          <span class="material-symbols-outlined text-6xl text-blue-100">fullscreen_exit</span>
        </button>
        <button>
          <span class="material-symbols-outlined text-6xl text-blue-100">highlight</span>
        </button>
      </div>
    </div>
    <span
      v-else
      class="col-start-2"
      >No video input!</span
    >
    <canvas
      id="canvas"
      style="display: none"
    ></canvas>
  </div>
</template>
