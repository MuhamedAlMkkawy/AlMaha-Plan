<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased" dir="rtl">
    <LayoutHeader />

    <main class="flex-1 max-w-7xl w-full mx-auto py-8 print:p-0 print:m-0 print:max-w-none">
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
</script>
