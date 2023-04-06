import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import de from './assets/local/de.json'
import en from './assets/local/en.json'
import { datetimeFormats } from './assets/local/messages'
import './style.css'

const messages = { en, de }

const i18n = createI18n({
  legacy: false,
  locale: 'de', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // @ts-expect-error vuei18n-problem
  datetimeFormats,
})

const pinia = createPinia()
const app = createApp(App)
app.use(i18n)
app.use(pinia)
app.mount('#app')
