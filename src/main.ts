import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import routes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import en from './assets/locales/en.json'
import de from './assets/locales/de.json'
import { datetimeFormats } from './assets/locales/datetime'

const i18n = createI18n({
  locale: 'de',
  messages: { en, de },
  fallbackLocale: 'en',
  legacy: false,
  // @ts-expect-error vuei18n-problem
  datetimeFormats,
})

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
