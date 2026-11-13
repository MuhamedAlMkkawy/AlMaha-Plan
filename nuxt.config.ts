// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import { createHash } from "node:crypto";

// Hashed login routes from environment or defaults
const loginPath = (process.env.LOGIN_ROUTE_SECRET || "/c66dc3312779fefa").startsWith("/")
  ? process.env.LOGIN_ROUTE_SECRET || "/c66dc3312779fefa"
  : "/" + (process.env.LOGIN_ROUTE_SECRET || "c66dc3312779fefa");

const employeeLoginPath = (process.env.EMPLOYEE_LOGIN_ROUTE_SECRET || "/3fe97eb46687f5af").startsWith("/")
  ? process.env.EMPLOYEE_LOGIN_ROUTE_SECRET || "/3fe97eb46687f5af"
  : "/" + (process.env.EMPLOYEE_LOGIN_ROUTE_SECRET || "3fe97eb46687f5af");

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  runtimeConfig: {
    googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || "",
    sheetId: process.env.SHEET_ID || "1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A",
    sheetTabFinal: process.env.SHEET_TAB_FINAL || "Final",
    adminEmails: process.env.ADMIN_EMAILS || "admin@example.com",
    authSecret: process.env.AUTH_SECRET || "maha-plan-secret-key-change-in-production",
    revalidateSecret: process.env.REVALIDATE_SECRET || "maha-revalidate-secret",
    public: {
      siteName: "مخطط المها / مها الشرق",
      planNo: "4047",
      publicShowPrices: true,
      loginPath, // hashed admin login route
      employeeLoginPath, // hashed employee login route
    },
  },

  // Rewrite login pages to hashed paths
  hooks: {
    "pages:extend"(pages) {
      const login = pages.find((p) => p.file?.endsWith("/pages/login.vue"));
      if (login) login.path = loginPath;
      const empLogin = pages.find((p) => p.file?.endsWith("/pages/employee-login.vue"));
      if (empLogin) empLogin.path = employeeLoginPath;
    },
  },

  ssr: false,

  sourcemap: {
    server: false,
    client: false,
  },

  nitro: {
    minify: false,
    sourceMap: false,
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      title: "مخطط المها / مها الشرق - بوابة المبيعات وعروض الأسعار",
      htmlAttrs: { lang: "ar", dir: "rtl" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "بوابة مبيعات وعروض أسعار مخطط المها / مها الشرق - رقم 4047" },
        { name: "robots", content: "noindex, nofollow" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap",
        },
      ],
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
    defaultLocale: "ar",
  },

  css: [
    "@/assets/scss/tailwind.css",
    "@/assets/scss/main.scss",
    "primeicons/primeicons.css",
  ],

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