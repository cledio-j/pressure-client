<script setup lang="ts">
defineProps<{
  titles: Readonly<string[]>
  subTitles: Readonly<string[]>
  localTitlePrefix: string
  localSubTitlePrefix: string
}>()
</script>

<template>
  <thead>
    <tr>
      <th
        scope="col"
        class="border-0 border-r-2 border-primary-dark"
      />
      <th
        v-for="title in titles"
        :key="title"
        colspan="3"
        class="border-2 border-t-0 border-primary-dark font-semibold text-primary"
        scope="col"
      >
        {{ $t(`${localTitlePrefix}.${title}`) }}
      </th>
    </tr>
    <tr>
      <th
        class="border-2 border-primary-dark px-1 font-semibold text-primary"
        scope="col"
      >
        {{ $t("header.date") }}
      </th>
      <template v-for="_i in 3" :key="_i">
        <th
          v-for="subTitle in subTitles"
          :key="subTitle"
          class="border border-b-2 border-t-0 border-primary-dark px-1 text-xs font-semibold text-tx"
          scope="col"
        >
          {{ $t(`${localSubTitlePrefix}.${subTitle}`) }}
        </th>
      </template>
    </tr>
  </thead>
</template>

<style scoped>
th:nth-child(3n-2){
  border-right: 2px solid var(--c-primary-dark);
}
</style>
