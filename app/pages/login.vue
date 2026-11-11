<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 space-y-6">
      <!-- Brand Icon & Header -->
      <div class="text-center">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7030A0] to-[#532277] text-white flex items-center justify-center text-2xl font-bold shadow-md mb-4">
          <i class="pi pi-lock text-3xl"></i>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          تسجيل دخول الإدارة
        </h1>
        <!-- <p class="text-xs text-slate-500 mt-1">
          بوابة الإدارة المركزية لمخطط المها (مها الشرق)
        </p> -->
      </div>

      <!-- Alert on Error -->
      <div v-if="errorMessage" class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
        <i class="pi pi-exclamation-circle text-rose-600 mt-0.5 shrink-0"></i>
        <div>
          <strong class="block font-bold">غير مصرح بالدخول</strong>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني المعتمد</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              placeholder="mail@example.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm dir-ltr text-start"
            />
          </div>
          <!-- <p class="text-2xs text-slate-400 mt-1">
            يجب أن يكون البريد مسجلاً ضمن قائمة ADMIN_EMAILS المعتمدة.
          </p> -->
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">كلمة المرور / الرمز السري</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#7030A0] text-sm"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 rounded-xl bg-[#7030A0] hover:bg-[#532277] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-sign-in"></i>
          <span>{{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}</span>
        </button>
      </form>

      <!-- Quick Demo Login Hint -->
      <!-- <div class="pt-4 border-t border-slate-100 text-center">
        <div class="text-2xs text-slate-400 mb-2">للتجربة السريعة كمسؤول نظام:</div>
        <button
          @click="email = 'admin@example.com'"
          type="button"
          class="text-xs text-[#7030A0] font-bold hover:underline"
        >
          استخدام البريد الافتراضي: admin@example.com
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await $fetch<{ success: boolean; user: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: {
          email: email.value.trim(),
          password: password.value,
        },
      }
    );

    if (res.success) {
      await navigateTo('/admin');
    }
  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || err.message || 'فشل تسجيل الدخول';
  } finally {
    loading.value = false;
  }
};
</script>

