<template>
  <div class="min-h-screen w-full grid lg:grid-cols-2 bg-white">
    <!-- Brand panel (right side in RTL) -->
    <aside class="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#7030A0] via-[#5f2790] to-[#3b1659] text-white p-12 xl:p-16">
      <!-- decorative shapes -->
      <div class="absolute -top-32 -start-32 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -end-24 w-[32rem] h-[32rem] rounded-full bg-amber-300/15 blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 opacity-[0.07] pointer-events-none"
           style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>

      <!-- Brand -->
      <NuxtLink to="/" class="relative flex items-center gap-3 w-fit group">
        <div class="w-12 h-12 rounded-xl bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <i class="pi pi-building text-2xl"></i>
        </div>
        <div>
          <div class="text-xl font-black leading-tight">{{ projectConfig.name }}</div>
          <div class="text-xs text-purple-200 font-medium">
            مخطط رقم {{ projectConfig.planNo }} • {{ projectConfig.marketer }}
          </div>
        </div>
      </NuxtLink>

      <!-- Message -->
      <div class="relative max-w-md">
        <h2 class="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
          بوابة الإدارة
        </h2>
        <p class="mt-4 text-purple-100 leading-relaxed">
          تابع مبيعات القطع، وحدّث الحالات، وأصدر عروض الأسعار من مكان واحد، مباشرة من جدول البيانات الرسمي.
        </p>

        <ul class="mt-8 space-y-3 text-sm">
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <i class="pi pi-chart-bar text-sm"></i>
            </span>
            <span class="text-purple-50">إحصائيات ومخططات حية للمبيعات</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <i class="pi pi-th-large text-sm"></i>
            </span>
            <span class="text-purple-50">إدارة القطع والبلوكات والزونات</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <i class="pi pi-file-edit text-sm"></i>
            </span>
            <span class="text-purple-50">إنشاء عروض الأسعار بسهولة</span>
          </li>
        </ul>
      </div>

      <div class="relative text-xs text-purple-200/80">
        © {{ new Date().getFullYear() }} {{ projectConfig.name }}
      </div>
    </aside>

    <!-- Form side -->
    <main class="relative flex items-center justify-center px-5 sm:px-8 py-10 bg-slate-50 lg:bg-white">
      <!-- soft background for mobile/tablet -->
      <div class="absolute inset-0 pointer-events-none lg:hidden" aria-hidden="true">
        <div class="absolute -top-24 -start-24 w-80 h-80 rounded-full bg-[#7030A0]/10 blur-3xl"></div>
        <div class="absolute -bottom-24 -end-24 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl"></div>
      </div>

      <!-- Back to site -->
      <NuxtLink
        to="/"
        class="absolute top-5 end-5 sm:top-6 sm:end-8 text-xs font-semibold text-slate-500 hover:text-[#7030A0] transition-colors flex items-center gap-1.5"
      >
        <span>العودة للموقع</span>
        <i class="pi pi-arrow-left text-[10px]"></i>
      </NuxtLink>

      <div class="relative w-full max-w-md">
        <!-- Mobile brand -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#7030A0] to-[#532277] text-white flex items-center justify-center shadow-lg shadow-purple-900/20 mb-4">
            <i class="pi pi-building text-3xl"></i>
          </div>
          <div class="text-lg font-black text-slate-900">{{ projectConfig.name }}</div>
        </div>

        <div class="mb-8 text-center lg:text-start">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">تسجيل دخول الإدارة</h1>
          <p class="text-sm text-slate-500 mt-2">أدخل بياناتك للمتابعة إلى لوحة التحكم</p>
        </div>

        <!-- Error alert -->
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0"
        >
          <div
            v-if="errorMessage"
            role="alert"
            class="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5"
          >
            <i class="pi pi-exclamation-circle text-rose-600 mt-0.5 shrink-0"></i>
            <div>
              <strong class="block font-bold">غير مصرح بالدخول</strong>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          <!-- Email -->
          <div>
            <label for="email" class="block text-xs font-bold text-slate-700 mb-1.5">
              البريد الإلكتروني المعتمد
            </label>
            <div class="relative" dir="ltr">
              <span class="absolute inset-y-0 left-0 w-11 flex items-center justify-center text-slate-400 pointer-events-none">
                <i class="pi pi-envelope text-sm"></i>
              </span>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="username"
                placeholder="mail@example.com"
                class="w-full h-12 ps-11 pe-4 rounded-xl border border-slate-200 bg-white lg:bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:bg-white focus:border-[#7030A0] focus:outline-hidden focus:ring-4 focus:ring-[#7030A0]/10"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور / الرمز السري
            </label>
            <div class="relative" dir="ltr">
              <span class="absolute inset-y-0 left-0 w-11 flex items-center justify-center text-slate-400 pointer-events-none">
                <i class="pi pi-lock text-sm"></i>
              </span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                @keyup="checkCapsLock"
                @keydown="checkCapsLock"
                @blur="capsLockOn = false"
                class="w-full h-12 ps-11 pe-12 rounded-xl border border-slate-200 bg-white lg:bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:bg-white focus:border-[#7030A0] focus:outline-hidden focus:ring-4 focus:ring-[#7030A0]/10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                :aria-pressed="showPassword"
                :title="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                class="absolute inset-y-0 right-0 w-12 flex items-center justify-center rounded-e-xl text-slate-400 hover:text-[#7030A0] focus-visible:outline-hidden focus-visible:text-[#7030A0] transition-colors"
              >
                <i :class="['pi text-base', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
              </button>
            </div>

            <p v-if="capsLockOn" class="mt-1.5 text-xs text-amber-700 flex items-center gap-1.5">
              <i class="pi pi-exclamation-triangle text-xs"></i>
              <span>زر Caps Lock مفعّل</span>
            </p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 px-4 rounded-xl bg-gradient-to-l from-[#7030A0] to-[#5b2688] hover:from-[#5b2688] hover:to-[#532277] text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-sign-in"></i>
            <span>{{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}</span>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { projectConfig } from '../config/project';

// Render this page without the default layout (no header / footer)
definePageMeta({ layout: false });

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const capsLockOn = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const checkCapsLock = (e: KeyboardEvent) => {
  capsLockOn.value = e.getModifierState?.('CapsLock') ?? false;
};

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        password: password.value,
      },
    });

    if (res.success) {
      await navigateTo('/admin');
    }
  } catch (err: any) {
    console.error('Login error:', err);

    errorMessage.value =
      err.data?.statusMessage ||
      err.statusMessage ||
      err.message ||
      'فشل تسجيل الدخول';
  } finally {
    loading.value = false;
  }
};
</script>