<script setup lang="ts">
import * as c from '../const'

const { reset, settings } = useSettings()
</script>

<template>
  <div class="mt-1">
    <h1 class="px-2 pt-1 text-xl font-semibold text-tx-title">
      {{ $t('messages.settings') }}
    </h1>
    <SettingsSection
      class="mb-1 ml-2 mt-2 px-1" :title="$t('header.general')"
      :section-description="$t('settings.generalDescription')"
    >
      <div class="flex flex-col">
        <SettingsSelectItem :title="$t('settings.language')">
          <BaseSelect
            v-model="settings.language"
            :options="c.LOCAL_OPTIONS.map((v) => { return { local: $t(`settings.${v}`), value: v } })"
          />
        </SettingsSelectItem>
        <button type="button" class="flex flex-row items-center self-center gap-1 btn" @click="reset()">
          <div class="i-ms-device-reset scale-125 text-primary" />
          {{ $t('settings.reset') }}
        </button>
      </div>
    </SettingsSection>
    <SettingsSection
      class="mb-1 ml-2 mt-2 px-1" :title="$t('header.data')"
      :section-description="$t('settings.tableDescription')"
    >
      <BaseCheckbox
        v-model="settings.table.color"
        class="my-2 ml-1 text-sm text-tx accent-primary" :label="$t('settings.color')"
      />
      <SettingsSelectItem :title="$t('settings.tableDefaultView')">
        <BaseSelect
          v-model="settings.table.defaultView"
          class="w-full"
          :options="c.ALL_TABLE_VIEWS.map((v) => { return { local: $t(`header.${v}`), value: v } })"
        />
      </SettingsSelectItem>
      <SettingsSelectItem :title="$t('settings.tablePerPage')">
        <BaseSelect
          v-model="settings.table.perPage" :no-local="true"
          :options="c.PER_PAGE_OPTS.map((o) => { return { local: o.toString(), value: o } })"
        />
      </SettingsSelectItem>
      <SettingsSelectItem :title="$t('settings.initialFetch')">
        <BaseSelect
          v-model="settings.table.initialFetch" :no-local="true"
          :options="c.INITIAL_FETCH_OPTS.map((o) => { return { local: o.toString(), value: o } })"
        />
      </SettingsSelectItem>
    </SettingsSection>
    <SettingsSection
      class="ml-2 px-1"
      :title="$t('settings.tableColumns')"
      :section-description="$t('settings.tableColumnsDescription')"
    >
      <template v-for="(_val, prop) in settings.table.headers" :key="prop">
        <BaseToggle v-model:toggled="settings.table.headers[prop]" :name="$t(`header.${prop}`)" />
      </template>
    </SettingsSection>
    <SettingsSection
      class="ml-2 px-1"
      :title="$t('settings.latest')"
      :section-description="$t('settings.latestDescription')"
    >
      <SettingsSelectItem :title="$t('settings.latestCount')">
        <BaseSelect
          v-model="settings.latest.numEntries" :no-local="true"
          :options="c.LATEST_COUNTS.map((o) => { return { local: o.toString(), value: o } })"
        />
      </SettingsSelectItem>
      <SettingsSelectItem :title="$t('settings.latestExpanded')">
        <BaseSelect
          v-model="settings.latest.numExpanded" :no-local="true"
          :options="c.LATEST_EXPANDED.map((o) => { return { local: o.toString(), value: o } })"
        />
      </SettingsSelectItem>
      <SettingsSelectItem :title="$t('messages.compare_to')">
        <BaseSelect
          v-model="settings.latest.comparison"
          :options="Object.keys(c.ComparisonType).map(
            (o) => { return { local: $t(`messages.${o}`), value: o } })"
        />
      </SettingsSelectItem>
    </SettingsSection>
  </div>
</template>
