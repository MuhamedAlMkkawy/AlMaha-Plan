<template>
  <NuxtLayout>
    <NuxtPage />
    <Toast />
    <FeaturesLoading v-if="loading" />
  </NuxtLayout>
</template>

<script setup>
  import Toast from "primevue/toast";

  // import the locales from i18n to handle the direction based on the lang used
  const { locale } = useI18n();
  const currentDir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

  const { loading } = useApiMethods();

  useHead({
    htmlAttrs: {
      lang: locale,
      dir: currentDir,
    },
  });
</script>

<!-- <style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    /* transform: scale(0.7) rotate(4deg); */
    transform: translateX(15px);
  }
</style> -->
