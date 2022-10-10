<script setup lang="ts">
import { onMounted, provide, reactive, ref } from "vue";
import NewEntry from "./components/TheNewEntry.vue";
import NavSlice from "./components/TheNavSlice.vue";
import ErrorModal from "./components/ErrorModal.vue";
import BaseLocaleChanger from "./components/BaseLocaleChanger.vue";

const apiUrl = "http://192.168.178.11:5000/api/";
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

onMounted(async () => {
  history.pushState({ botPanel: "latest" }, "", `/static/latest`);
  const response = await fetch(apiUrl + "get-token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa("Wilfried:123"),
    },
  });
  const j = await response.json();
  console.log(j);
  if (j) {
    token.value = j.token;
    authorized.value = true;
  } else {
    console.log("auth error");
    authorized.value = false;
  }
});

function handleError(err: ErrorObj) {
  Object.assign(errorInfo, err);
}
</script>

<template>
  <div class="container mx-auto px-1 max-w-screen-lg h-full">
    <BaseLocaleChanger></BaseLocaleChanger>
    <ErrorModal
      :error="errorInfo"
      @close="errorInfo.active = false"
      @user-responded="errorInfo.active = false"
    ></ErrorModal>
    <NewEntry
      @report-error="(err) => handleError(err)"
      @interface:collapse="(fn) => (theNewEntryCollapse = fn)"
    ></NewEntry>
    <NavSlice @did-navigation="() => theNewEntryCollapse()"></NavSlice>
  </div>
</template>

<style></style>
