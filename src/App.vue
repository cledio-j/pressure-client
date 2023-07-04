<script setup lang="ts">
import { onBeforeMount, onMounted, provide, reactive, ref, watch, watchEffect } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import NewEntry from './components/TheNewEntry.vue'
import NavSlice from './components/TheNavSlice.vue'
import AuthSplash from './components/AuthSplash.vue'
import ErrorModal from './components/ErrorModal.vue'
import { authStore, errorStore } from './store'
import { useBreakpoints } from './composables/breakpoints'

import { apiUrl } from './utils/apiFuncs'
import ErrorNotification from './components/ErrorNotification.vue'
import { Notification, useNoteStore } from './notifications'

const noteStore = useNoteStore()

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

watch(needRefresh, (newVal, oldVal) => {
  if (newVal) {
    noteStore.notes.push(new Notification(
      'Update',
      'Neue Version verfügbar',
      [{ name: 'reload', action: updateServiceWorker }],
    ))
    needRefresh.value = false
  }
})

const { width, breakpoint } = useBreakpoints()
const token = ref('')

// const isMobile = computed(
//   () => {
//     if (navigator.maxTouchPoints > 0) {
//     }
//   })

let theNewEntryCollapse: () => void

provide('token', token)
provide('apiUrl', apiUrl)
provide('width', width)
provide('breakpoint', breakpoint)

function getToken() {
  if (localStorage.token && new Date(localStorage.tokenExpiration) > new Date()) {
    authStore.authorized = true
    authStore.token = localStorage.token
    return localStorage.token
  }
  return false
}

function logout() {
  authStore.authorized = false
  localStorage.token = ''
}

onMounted(async () => {
  history.pushState({ botPanel: 'latest' }, '', '/#latest')
  getToken()
})
</script>

<template>
  <div class="container mx-auto h-full max-w-screen-lg px-1">
    <!-- <button @click="logout()">
      LOGout
    </button> -->
    <!-- <BaseLocaleChanger></BaseLocaleChanger> -->
    <ErrorNotification />
    <ErrorModal
      :error="errorStore.error"
      @close="errorStore.toggleActive()"
      @user-responded="errorStore.toggleActive()"
    />
    <Transition name="fade">
      <div v-if="authStore.authorized">
        <NewEntry @interface:collapse="(fn) => (theNewEntryCollapse = fn)" />
        <NavSlice @did-navigation="() => theNewEntryCollapse()" />
      </div>
      <AuthSplash
        v-else
        class="absolute md:right-1/2"
      />
    </Transition>
  </div>
</template>

<style>
.fade-enter-active {
  transition: all 1.2s ease-out;
}
.fade-leave-active {
  transition: all 0s ease-out;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
