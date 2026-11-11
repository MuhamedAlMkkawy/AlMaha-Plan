// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      // apiBase: "http://127.0.0.1:3000/api/",
      // secretKey : "9e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a6a72f384a1d3bcb40c012"
    },
  },
  // const config = useRuntimeConfig()

  // console.log(config.public.apiBase)

  ssr: false,

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      title: "مخطط المها",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Website Name" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo.ico" }],
    },
  },

  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vee-validate/nuxt",
    "nuxt-yup",
  ],

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      ErrorMessage: "VeeErrorMessage",
    },
  },

  // components: true,

  imports: {
    dirs: ["stores", "composables", "helpers", "schemas"],
    presets: [
      {
        from: "vee-validate",
        imports: ["Field", "Form", "ErrorMessage", "useField", "useForm"],
      },
    ],
  },

  primevue: {
    autoImport: true,
    options: {
      // unstyled: true,
      zIndex: {
        modal: 3000,
      },
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: ".dark",
          cssLayer: true,
        },
      },
    },
  },

  i18n: {
    detectBrowserLanguage: false,
    locales: [
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
        name: "English",
        dir: "ltr",
      },
      {
        code: "ar",
        iso: "ar-SA",
        file: "ar.json",
        name: "العربية",
        dir: "rtl",
      },
    ],
    langDir: "../app/locales/",
    defaultLocale: "en",
  },

  css: ["@/assets/scss/main.scss", "primeicons/primeicons.css"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/scss/_variables.scss" as *;
          @use "@/assets/scss/_mixins.scss" as *;
        `,
        },
      },
    },
  },
});
