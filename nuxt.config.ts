import vuetify from "vite-plugin-vuetify";
import path from "path";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["vuetify/lib/styles/main.sass", "~/assets/variables.scss"],
  modules: ["@pinia/nuxt", "@kevinmarrec/nuxt-pwa"],
  imports: {
    autoImport: true,
    dirs: ["store/**", "provide/**", "composables/**", "components/**", "plugins/**"],
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins?.push(vuetify());
    },
  },
  alias: {
    "@vue/devtools-api": "@vue/devtools-api",
    "@common-ui": path.resolve(__dirname, "../kennect-common-ui-v3/"),
  },
  ssr: true,
  app: {
    head: {
      titleTemplate: "%s - Nuxt 3 Template Project",
      title: "Nuxt 3 Template Project",
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "Nuxt 3 Template Project" }, { name: "format-detection", content: "telephone=no" }],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  pwa: {
    workbox: {
      // enabled: true,
    },
    manifest: {
      lang: "en",
      start_url: "/",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: [".."],
      },
    },
  },
  runtimeConfig: {
    public: {},
  },
  typescript: {
    shim: false,
  },
});
