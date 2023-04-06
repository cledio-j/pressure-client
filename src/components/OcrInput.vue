<script setup lang="ts">
import { type Ref, inject, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FsIcon from '../assets/svg/fullscreen-exit.svg?component'
import LightIcon from '../assets/svg/highlight.svg?component'
import CheckIcon from '../assets/svg/check.svg?component'
import { authStore } from '@/store'
import { pushImage } from '@/utils/apiFuncs'

const emits = defineEmits<{ (e: 'hasResult', result: ImageResult): void }>()

const { t } = useI18n()

const player: Ref<HTMLVideoElement | undefined> = ref()
const playerDiv: Ref<HTMLDivElement | undefined> = ref()
const videoAvailable = ref(false)
const inFullscreen = ref(false)
const can: Ref<HTMLCanvasElement | undefined> = ref()
const track = ref<MediaStreamTrack | undefined>()
const lightOn = ref(false)

onMounted(async () => {
  const deviceList = await navigator.mediaDevices.enumerateDevices()
  if (deviceList.some(device => device.kind === 'videoinput')) {
    videoAvailable.value = true
    nextTick(() => getVideo())
  }
  else { videoAvailable.value = false }
})

const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: { ideal: 720 * 2 },
    height: { ideal: 480 * 2 },
  },
}

async function getVideo() {
  if (!player.value || !playerDiv.value)
    return
  const video = await navigator.mediaDevices.getUserMedia(constraints)
  track.value = video.getVideoTracks()[0]
  player.value.srcObject = video
  goFullscreen()
  toggleLight()
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    inFullscreen.value = false
    document.exitFullscreen()
  }
}

async function goFullscreen() {
  if (!playerDiv.value)
    return
  await playerDiv.value.requestFullscreen({ navigationUI: 'show' })
  inFullscreen.value = true
}

function fsChange() {
  // this makes sure inFullscreen gets updated when user manually exits (broswer nav) FS
  if (!document.fullscreenElement)
    inFullscreen.value = false

  else if (document.fullscreenElement === null)
    inFullscreen.value = false

  else
    inFullscreen.value = true
}

async function sendFile(data: Blob | null) {
  if (!data)
    return
  const result = await pushImage(authStore.token, data)
  if (!result)
    return
  if (lightOn.value)
    toggleLight()
  emits('hasResult', result)
}

function handleSubmit() {
  if (!can.value || !player.value)
    return
  const ctx = can.value.getContext('2d')
  ctx?.drawImage(player.value, 0, 0, can.value.width, can.value.height)
  can.value.toBlob(d => sendFile(d), 'image/webp')
}

function getUnavailableString() {
  if (navigator.onLine)
    return t('messages.no_video_input')

  else if (!navigator.onLine)
    return t('messages.no_video_offline')

  else
    return t('messages.video_unavaiable')
}

function toggleLight() {
  if (!track.value)
    return
  track.value.applyConstraints({
    // @ts-expect-error :: torch is a real setting, no idea why TS complains
    advanced: [{ torch: !lightOn.value }],
  })
  lightOn.value = !lightOn.value
}
</script>

<template>
  <div class="h-full">
    <div
      v-if="videoAvailable"
      ref="playerDiv"
      :class="{ 'grid grid-cols-3': !inFullscreen }"
      @fullscreenchange="fsChange"
    >
      <video
        ref="player"
        class="col-start-2"
        autoplay
      />
      <div
        :class="{
          'fixed right-1 top-5 w-12  gap-4 flex flex-col rounded-lg bg-blue-200 bg-opacity-25 pb-1': inFullscreen,
          'col-start-3 flex flex-col': !inFullscreen,
        }"
      >
        <button @click="inFullscreen ? exitFullscreen() : goFullscreen()">
          <FsIcon class="fill-white" viewBox="0 0 32 32" />
        </button>
        <button @click="toggleLight">
          <LightIcon
            class="fill-white" :class="{ 'fill-yellow-500': lightOn }"
            viewBox="0 0 32 32"
          />
        </button>
        <button>
          <CheckIcon class="fill-green-600" viewBox="0 0 32 32" @click="handleSubmit" />
        </button>
      </div>
      <button
        v-if="inFullscreen"
        class="fixed text-2xl text-rose-900 font-semibold bottom-0 w-full h-24 bg-rose-100 opacity-50 "
      >
        {{ $t('controls.confirm') }}
      </button>
    </div>
    <span v-if="!videoAvailable" class="col-start-2">{{ getUnavailableString() }}</span>
    <!-- <button @click="handleSubmit">
      <span class="text-4xl">SEND</span>
    </button> -->
    <canvas
      id="canvas"
      ref="can"
      style="display: none"
      height="720"
      width="480"
    />
  </div>
</template>
