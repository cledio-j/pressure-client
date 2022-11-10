import vueI18n from "@intlify/vite-plugin-vue-i18n";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n(),
    svgLoader(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: "inline",
      devOptions: { enabled: true, type: "module" },
    }),
  ],
  build: {
    manifest: true,
  },
  base: "/",
});
