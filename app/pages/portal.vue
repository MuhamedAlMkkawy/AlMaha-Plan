<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="text-center space-y-4">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
      <p class="text-sm font-semibold text-slate-600">جاري التحويل لبوابة دخول الموظفين...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

onMounted(() => {
  navigateTo('/3fe97eb46687f5af');
});
</script>
