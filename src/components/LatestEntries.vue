<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import { getStr } from "../utils/tableFuncs";
import { useI18n } from "vue-i18n";
import TablePagination from "./TablePagination.vue";
const { t } = useI18n();
const { d } = useI18n();

const apiUrl = inject("apiUrl");
const token = inject<Ref<string>>("token");
const authorized = inject<Ref<boolean>>("authorized");

const hasData = ref(false);
const data: Ref<Reading[] | undefined> = ref();
const headers: Ref<string[] | undefined> = ref();
const currentPage = ref(1);
const totalPages: Ref<number | undefined> = ref();

async function getNewest(page: number = 1) {
  if (!authorized || !token) {
    setTimeout(getNewest, 1000);
    return;
  }
  const result = await fetch(apiUrl + "readings/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token.value,
    },
    body: JSON.stringify({ per_page: 10, page: page, order: "desc" }),
  }).catch((error) => {
    console.log(error);
  });
  if (!result || !result.ok) {
    console.log("something wrong", result ? result.status : "Very wrong, even.");
    return;
  }
  const response = await result.json();
  data.value = response.data as Reading[];
  currentPage.value = response.meta.page;
  totalPages.value = response.meta.total_pages;
  headers.value = Object.keys(data.value[0]) as string[];
  headers.value = headers.value.filter((e) => {
    return e != "user_id" && e != "timestamp" && e != "id";
  });
  headers.value.unshift("date", "time");
  hasData.value = true;
}

function tryGetData() {
  if (token && token.value) {
    getNewest();
  } else {
    setTimeout(tryGetData, 1000);
  }
}

onMounted(() => {
  tryGetData();
});
</script>
<template>
  <div class="grid grid-cols-1">
    <table v-if="hasData">
      <thead>
        <template v-for="item in headers">
          <th v-if="item != 'weather'">{{ $t("header." + item) }}</th></template
        >
      </thead>
      <tbody>
        <template v-for="item in data">
          <tr>
            <template v-for="(value, index) in headers">
              <td
                class="border"
                v-if="value != 'weather' && value != 'user_id'"
              >
                {{ getStr(value as HeaderKey, item, t, d) }}
              </td></template
            >
          </tr></template
        >
      </tbody>
    </table>
    <TablePagination
      class="justify-self-center mt-1"
      :current-page="currentPage"
      :totalPages="totalPages ? totalPages : 1"
      :getter="getNewest"
    ></TablePagination>
  </div>
</template>
