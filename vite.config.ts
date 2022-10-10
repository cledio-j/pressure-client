import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueI18n(), svgLoader()],
  build: {
    manifest: true,
  },
  base: "/static/",
});
