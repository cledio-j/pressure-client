import { createApp } from "vue";
import { createI18n, useI18n } from "vue-i18n";
import App from "./App.vue";
import { datetimeFormats, messages } from "./assets/local/messages";
import "./style.css";

// 2. Create i18n instance with options

const i18n = createI18n({
  legacy: false,
  locale: "de", // set locale
  fallbackLocale: "en", // set fallback locale
  messages, // set locale messages
  //@ts-expect-error
  datetimeFormats,
});

const app = createApp(App);
app.use(i18n);
app.mount("#app");
