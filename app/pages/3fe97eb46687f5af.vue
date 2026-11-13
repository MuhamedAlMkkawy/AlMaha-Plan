
<template>
  <main
    dir="rtl"
    class="employee-login relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
  >
    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-[#101329]"></div>

      <!-- Architectural background lines -->
      <div class="absolute inset-0 opacity-[0.055]">
        <div
          class="absolute inset-0"
          style="
            background-image:
              linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px);
            background-size: 76px 76px;
          "
        ></div>
      </div>

      <!-- Ambient lighting -->
      <div
        class="absolute -right-40 -top-48 h-[620px] w-[620px] rounded-full bg-indigo-600/20 blur-[150px]"
      ></div>

      <div
        class="absolute -bottom-56 -left-40 h-[650px] w-[650px] rounded-full bg-violet-700/20 blur-[160px]"
      ></div>

      <div
        class="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.07] blur-[130px]"
      ></div>

      <!-- Decorative rings -->
      <div
        class="absolute -right-24 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full border border-white/[0.045]"
      ></div>

      <div
        class="absolute -right-12 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-white/[0.045]"
      ></div>

      <div
        class="absolute -left-32 bottom-[-100px] h-[400px] w-[400px] rounded-full border border-white/[0.04]"
      ></div>

      <!-- Top and bottom highlights -->
      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
      ></div>

      <div
        class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
      ></div>
    </div>

    <!-- Main layout -->
    <div class="relative z-10 mx-auto w-full max-w-[470px]">
      <!-- Brand -->
      <header class="mb-8 text-center">
        <div class="relative mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center">
          <div
            class="absolute inset-0 rounded-[25px] bg-indigo-500/25 blur-xl"
          ></div>

          <div
            class="relative flex h-[68px] w-[68px] items-center justify-center rounded-[23px] border border-white/15 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-[0_12px_40px_rgba(79,70,229,.35)]"
          >
            <i class="pi pi-building text-[28px] text-white"></i>
          </div>

          <span
            class="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#101329] bg-emerald-400"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
          </span>
        </div>

        <p class="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-300/80">
          EMPLOYEE WORKSPACE
        </p>

        <h1 class="mt-3 text-3xl font-black tracking-tight text-white sm:text-[34px]">
          بوابة الموظفين
        </h1>

        <p class="mt-2 text-sm text-slate-400">
          {{ projectConfig.name }}
        </p>
      </header>

      <!-- Login card -->
      <section
        class="login-card relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#fdfdff] shadow-[0_35px_100px_rgba(0,0,0,.42)]"
      >
        <!-- Card accent -->
        <div
          class="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-l from-violet-500 via-indigo-500 to-blue-400"
        ></div>

        <div class="p-6 sm:p-9">
          <!-- Card heading -->
          <div class="mb-8">
            <div class="mb-5 flex items-center justify-between gap-3">
              <div
                class="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-extrabold text-indigo-700"
              >
                <i class="pi pi-lock text-xs"></i>
                منطقة دخول محمية
              </div>

              <div class="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                نظام آمن
              </div>
            </div>

            <h2 class="text-[27px] font-black tracking-tight text-[#171a32]">
              أهلًا بعودتك
            </h2>

            <p class="mt-2 text-[13px] leading-7 text-slate-500">
              سجّل الدخول باستخدام بيانات حسابك للوصول إلى أدوات العمل
              ولوحة الموظف.
            </p>
          </div>

          <!-- Error message -->
          <Transition name="error">
            <div
              v-if="errorMessage"
              role="alert"
              class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
            >
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100"
              >
                <i class="pi pi-exclamation-circle"></i>
              </div>

              <div class="min-w-0 pt-1 leading-6">
                {{ errorMessage }}
              </div>
            </div>
          </Transition>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Username -->
            <div>
              <label
                for="username"
                class="mb-2.5 block text-[12px] font-extrabold text-slate-700"
              >
                اسم المستخدم
                <span class="text-red-500">*</span>
              </label>

              <div class="login-input relative">
                <div
                  class="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors"
                >
                  <i class="pi pi-user text-sm"></i>
                </div>

                <input
                  id="username"
                  v-model="username"
                  type="text"
                  autocomplete="username"
                  placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                  required
                  class="h-[54px] w-full rounded-xl border border-slate-200 bg-[#f8f9fc] pr-[62px] pl-4 text-[13px] font-semibold text-slate-800 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-[4px] focus:ring-indigo-500/[0.09]"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="mb-2.5 flex items-center justify-between gap-3">
                <label
                  for="password"
                  class="text-[12px] font-extrabold text-slate-700"
                >
                  كلمة المرور
                  <span class="text-red-500">*</span>
                </label>
              </div>

              <div class="login-input relative">
                <div
                  class="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors"
                >
                  <i class="pi pi-key text-sm"></i>
                </div>

                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  required
                  class="h-[54px] w-full rounded-xl border border-slate-200 bg-[#f8f9fc] pr-[62px] pl-[52px] text-[13px] font-semibold text-slate-800 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-[4px] focus:ring-indigo-500/[0.09]"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                  class="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <i
                    :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                    class="text-sm"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="login-submit group relative mt-3 flex h-[55px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-[#4f46e5] via-[#5145cf] to-[#673ab7] px-5 text-sm font-extrabold text-white shadow-[0_9px_24px_rgba(79,70,229,.23)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_13px_30px_rgba(79,70,229,.34)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                class="absolute inset-0 translate-x-full bg-gradient-to-l from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[-100%]"
              ></span>

              <i
                :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
                class="relative text-sm"
              ></i>

              <span class="relative">
                {{ loading ? 'جارٍ التحقق من بياناتك...' : 'تسجيل الدخول إلى حسابي' }}
              </span>

              <i
                v-if="!loading"
                class="pi pi-arrow-left relative text-xs transition-transform duration-300 group-hover:-translate-x-1"
              ></i>
            </button>
          </form>

          <!-- Security information -->
          <div
            class="mt-7 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5"
          >
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            >
              <i class="pi pi-shield text-sm"></i>
            </div>

            <div>
              <p class="text-[11px] font-extrabold text-slate-700">
                حماية بيانات حسابك
              </p>
              <p class="mt-1 text-[10px] leading-5 text-slate-400">
                يتم تأمين الوصول وفق صلاحيات الموظف المعتمدة.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-7 text-center">
        <div class="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <i class="pi pi-lock text-[10px] text-indigo-300"></i>
          <span>بوابة داخلية مخصصة للموظفين</span>
        </div>

        <p class="mt-3 text-[10px] text-slate-500">
          © {{ new Date().getFullYear() }} {{ projectConfig.name }}
          <span class="mx-1.5 text-slate-600">·</span>
          جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  </main>
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

      await navigateTo(
        firstAllowedPath(
          (res.user.permissions || []) as EmployeePermission[],
        ),
      );
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

<style scoped>
.employee-login {
  font-family: inherit;
}

.login-card {
  animation: card-enter 650ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.login-input:focus-within > div {
  background: #eef2ff;
  color: #4f46e5;
}

.error-enter-active,
.error-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card {
    animation: none;
  }

  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}
</style>
