<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div class="mx-auto w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
        <i class="pi pi-lock text-xl"></i>
      </div>
      <h1 class="text-xl font-black text-slate-900">لا توجد صلاحيات كافية</h1>
      <p class="mt-2 text-sm text-slate-500 leading-relaxed">
        حسابك مفعّل، لكن المدير لم يمنحك صلاحية استخدام هذا الجزء من المنصة.
        اطلب من الإدارة تفعيل الصلاحيات المناسبة لحسابك.
      </p>
      <button
        type="button"
        class="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#7030A0] text-white text-sm font-bold"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out text-xs"></i>
        تسجيل الخروج
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { clearAuth } = useAuthSession();

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    clearAuth();
    await navigateTo('/');
  }
};
</script>
