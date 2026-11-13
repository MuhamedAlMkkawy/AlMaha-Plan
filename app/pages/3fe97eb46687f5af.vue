<template>
  <div class="min-h-screen w-full grid lg:grid-cols-2 bg-slate-50">
    <!-- Brand panel (right side in RTL) -->
    <aside class="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white p-12 xl:p-16">
      <!-- decorative shapes -->
      <div class="absolute -top-32 -start-32 w-[28rem] h-[28rem] rounded-full bg-indigo-400/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -end-24 w-[32rem] h-[32rem] rounded-full bg-emerald-400/15 blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 opacity-[0.06] pointer-events-none"
           style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>

      <!-- Brand -->
      <NuxtLink to="/" class="relative flex items-center gap-3 w-fit group">
        <div class="w-12 h-12 rounded-xl bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <i class="pi pi-briefcase text-2xl text-indigo-200"></i>
        </div>
        <div>
          <div class="text-xl font-black leading-tight">{{ projectConfig.name }}</div>
          <div class="text-xs text-indigo-200 font-medium">
            بوابة فريق العمل والمبيعات • مخطط رقم {{ projectConfig.planNo }}
          </div>
        </div>
      </NuxtLink>

      <!-- Message -->
      <div class="relative max-w-md">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-4 border border-indigo-400/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          نظام الموظفين المعتمد
        </div>
        <h2 class="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
          بوابة الموظفين
        </h2>
        <p class="mt-4 text-indigo-100/90 leading-relaxed text-sm">
          مرحبًا بك في بوابة الموظفين الخاصة بمشروع مخطط المها. يمكنك الوصول إلى لوحة المبيعات والقطع والعقود وفق الصلاحيات المخصصة لحسابك.
        </p>

        <ul class="mt-8 space-y-3 text-sm">
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
              <i class="pi pi-check text-sm"></i>
            </span>
            <span class="text-indigo-50">تحديث حالات القطع وعروض الأسعار</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
              <i class="pi pi-file-edit text-sm"></i>
            </span>
            <span class="text-indigo-50">تحرير عقود الشراء والإفراغ الفوري</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
              <i class="pi pi-shield text-sm"></i>
            </span>
            <span class="text-indigo-50">تسجيل آمن وتوثيق كامل لكافة العمليات</span>
          </li>
        </ul>
      </div>

      <div class="relative text-xs text-indigo-300/80">
        © {{ new Date().getFullYear() }} {{ projectConfig.name }} • بوابة الموظفين
      </div>
    </aside>

    <!-- Form side -->
    <main class="relative flex items-center justify-center px-5 sm:px-8 py-10">
      <!-- Back to site -->
      <NuxtLink
        to="/"
        class="absolute top-5 end-5 sm:top-6 sm:end-8 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
      >
        <span>العودة للموقع الرئيسي</span>
        <i class="pi pi-arrow-left text-[10px]"></i>
      </NuxtLink>

      <div class="relative w-full max-w-md bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-sm">
        <!-- Brand on mobile -->
        <div class="lg:hidden text-center mb-6">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex items-center justify-center shadow-lg shadow-indigo-900/20 mb-3">
            <i class="pi pi-briefcase text-2xl"></i>
          </div>
          <div class="text-base font-black text-slate-900">{{ projectConfig.name }}</div>
          <div class="text-xs text-slate-500">بوابة الموظفين</div>
        </div>

        <div class="mb-6 text-center lg:text-start">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">تسجيل دخول الموظف</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1.5">أدخل بيانات الاعتماد الممنوحة لك من مدير النظام</p>
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
              <strong class="block font-bold">تعذر تسجيل الدخول</strong>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <!-- Username / Email -->
          <div>
            <label for="emp-username" class="block text-xs font-bold text-slate-700 mb-1.5">
              اسم المستخدم أو البريد
            </label>
            <div class="relative" dir="ltr">
              <span class="absolute inset-y-0 left-0 w-11 flex items-center justify-center text-slate-400 pointer-events-none">
                <i class="pi pi-user text-sm"></i>
              </span>
              <input
                id="emp-username"
                v-model="username"
                type="text"
                required
                autocomplete="username"
                placeholder="اسم المستخدم المعتمد"
                class="w-full h-12 ps-11 pe-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:bg-white focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-600/10 text-left"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="emp-password" class="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور
            </label>
            <div class="relative" dir="ltr">
              <span class="absolute inset-y-0 left-0 w-11 flex items-center justify-center text-slate-400 pointer-events-none">
                <i class="pi pi-lock text-sm"></i>
              </span>
              <input
                id="emp-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full h-12 ps-11 pe-12 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:bg-white focus:border-indigo-600 focus:outline-hidden focus:ring-4 focus:ring-indigo-600/10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 w-12 flex items-center justify-center rounded-e-xl text-slate-400 hover:text-indigo-600 transition-colors"
                tabindex="-1"
              >
                <i :class="['pi text-base', showPassword ? 'pi-eye-slash' : 'pi-eye']"></i>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 mt-2 px-4 rounded-xl bg-gradient-to-l from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 text-white font-bold text-sm shadow-lg shadow-indigo-900/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-sign-in"></i>
            <span>{{ loading ? 'جاري التحقق...' : 'دخول الموظف' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-100 text-center">
          <p class="text-xs text-slate-400">
            إذا نسيت كلمة المرور أو واجهت مشكلة في الدخول، يرجى التواصل مع إدارة النظام.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { projectConfig } from '../config/project';
import { firstAllowedPath } from '../../shared/access';
import type { EmployeePermission } from '../../shared/types/employee';

definePageMeta({ layout: false });

const { refreshAuth } = useAuthSession();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'يرجى إدخال اسم المستخدم وكلمة المرور';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await $fetch<{
      success: boolean;
      user: {
        id: string;
        name: string;
        username: string;
        permissions: string[];
      };
    }>('/api/auth/employee-login', {
      method: 'POST',
      body: {
        username: username.value.trim(),
        password: password.value,
      },
    });

    if (res.success) {
      await refreshAuth();
      await navigateTo(firstAllowedPath((res.user.permissions || []) as EmployeePermission[]));
    }
  } catch (err: any) {
    console.error('Employee login error:', err);
    errorMessage.value =
      err.data?.statusMessage ||
      err.statusMessage ||
      err.message ||
      'اسم المستخدم أو كلمة المرور غير صحيحة';
  } finally {
    loading.value = false;
  }
};
</script>

