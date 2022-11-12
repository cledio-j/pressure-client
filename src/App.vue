<script setup lang="ts">
import { onMounted, provide, reactive, ref } from "vue";
import NewEntry from "./components/TheNewEntry.vue";
import NavSlice from "./components/TheNavSlice.vue";
import ErrorModal from "./components/ErrorModal.vue";
import BaseLocaleChanger from "./components/BaseLocaleChanger.vue";
import AuthSplash from "./components/AuthSplash.vue";
import { networkError, notAuthorized } from "./utils/errors";
import { useI18n } from "vue-i18n";

import { errorStore } from "./store";

import { apiUrl } from "./utils/apiFuncs";

const { t } = useI18n();
const authorized = ref(false);
const token = ref("");

let theNewEntryCollapse: () => void;

const errorInfo: ErrorObj = reactive({
  severity: "info",
  active: false,
  title: "",
  message: "",
  options: [],
  details: "",
});

provide("token", token);
provide("authorized", authorized);
provide("apiUrl", apiUrl);

async function checkStorage() {
  console.log(localStorage.tokenExpiration);
  if (!localStorage.tokenExpiration) {
    authorized.value = false;
  } else {
    const expiration = new Date(localStorage.tokenExpiration);
    if (expiration <= new Date()) {
      authorized.value = false;
    } else {
      token.value = localStorage.token;
      authorized.value = true;
    }
  }
}

async function getNewToken(name: string, pwd: string) {
  try {
    const response = await fetch(apiUrl + "user/get-token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + window.btoa(`${name}:${pwd}`),
      },
    });
    if (response && !response.ok) {
      if (response.status == 401) {
        authorized.value = false;
        // handleError(notAuthorized(t, getNewToken, response));
        return;
      }
    }
    const data = await response.json();
    if (data) {
      token.value = data.token;
      localStorage.tokenExpiration = data.expires;
      localStorage.token = data.token;
      authorized.value = true;
    } else {
      console.log("auth error");
      authorized.value = false;
    }
  } catch (error) {
    authorized.value = false;
    // handleError(networkError(t, () => getNewToken(name, pwd)));
  }
}

onMounted(async () => {
  history.pushState({ botPanel: "latest" }, "", `/latest`);
  checkStorage();
});

function handleError(err: ErrorObj) {
  Object.assign(errorInfo, err);
}
</script>

<template>
  <div class="container mx-auto h-full max-w-screen-lg px-1">
    <!-- <BaseLocaleChanger></BaseLocaleChanger> -->
    <!-- <ErrorModal
      :error="errorStore.error"
      @close="errorStore.toggleActive()"
      @user-responded="errorStore.toggleActive()"
    ></ErrorModal> -->
    <div v-if="authorized">
      <NewEntry @interface:collapse="(fn) => (theNewEntryCollapse = fn)"></NewEntry>
      <NavSlice @did-navigation="() => theNewEntryCollapse()"></NavSlice>
    </div>
    <AuthSplash
      v-else
      @auth:submit="(name, pwd) => getNewToken(name, pwd)"
    ></AuthSplash>
  </div>
</template>

<style></style>
