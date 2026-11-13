
<template>
  <main
    dir="rtl"
    class="admin-login relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10"
  >
    <!-- Full-screen background -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-[#171023]"></div>

      <!-- Atmospheric lighting -->
      <div
        class="absolute -right-64 -top-64 h-[850px] w-[850px] rounded-full bg-[#7030A0]/30 blur-[170px]"
      ></div>

      <div
        class="absolute -bottom-72 -left-64 h-[850px] w-[850px] rounded-full bg-[#8b45b5]/20 blur-[180px]"
      ></div>

      <div
        class="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffc928]/[0.045] blur-[170px]"
      ></div>

      <!-- Architectural grid -->
      <div class="absolute inset-0 opacity-[0.045]">
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

      <!-- Decorative rings -->
      <div
        class="absolute -right-[350px] top-1/2 h-[850px] w-[850px] -translate-y-1/2 rounded-full border border-white/[0.045]"
      ></div>

      <div
        class="absolute -right-[230px] top-1/2 h-[610px] w-[610px] -translate-y-1/2 rounded-full border border-white/[0.045]"
      ></div>

      <div
        class="absolute -right-[120px] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-white/[0.045]"
      ></div>

      <!-- Edge accents -->
      <div
        class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-transparent via-[#ffc928] to-transparent"
      ></div>

      <div
        class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      ></div>
    </div>

    <!-- Top navigation -->
    <header
      class="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
    >
      <NuxtLink to="/" class="group flex min-w-0 items-center gap-3">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-white shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:border-[#ffc928]/50 group-hover:bg-white/[0.13]"
        >
          <i class="pi pi-building text-xl"></i>
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-black text-white sm:text-base">
            {{ projectConfig.name }}
          </p>

          <p class="mt-1 text-[10px] font-semibold text-white/45 sm:text-xs">
            مخطط رقم {{ projectConfig.planNo }}
          </p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/"
        class="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-2.5 text-xs font-bold text-white/70 backdrop-blur-lg transition-all hover:border-white/20 hover:bg-white/10 hover:text-white sm:px-4"
      >
        <i
          class="pi pi-arrow-up-right text-[10px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        ></i>
        <span>العودة للموقع</span>
      </NuxtLink>
    </header>

    <!-- Main content -->
    <div class="relative z-10 mx-auto w-full max-w-[1380px] pt-16">
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_570px] lg:gap-16 xl:grid-cols-[1fr_590px] xl:gap-24">

        <!-- Brand section -->
        <section class="hidden lg:block">
          <!-- Status -->
          <div
            class="mb-8 inline-flex items-center gap-3 rounded-full border border-[#ffc928]/20 bg-[#ffc928]/[0.07] px-4 py-2.5"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffc928] opacity-40"
              ></span>
              <span
                class="relative inline-flex h-2 w-2 rounded-full bg-[#ffc928]"
              ></span>
            </span>

            <span class="text-[10px] font-extrabold tracking-[0.17em] text-amber-200">
              بوابة الإدارة
            </span>
          </div>

          <!-- Heading -->
          <h1
            class="max-w-[650px] text-5xl font-black leading-[1.55] tracking-tight text-white xl:text-[66px]"
          >
            تحكم كامل.
            <span class="block text-[#ffc928]">
              رؤية أوضح.
            </span>
            <span class="block text-white/90">
              إدارة أذكى.
            </span>
          </h1>

          <p
            class="mt-7 max-w-[510px] text-[15px] leading-[2.2] text-white/55"
          >
            مركز الإدارة الموحد لمتابعة المبيعات وإدارة الأراضي والبلوكات
            والعروض، مع تحكم مباشر في بيانات المشروع وإدارة عملياته.
          </p>

          <!-- Features -->
          <div class="mt-12 grid max-w-[630px] grid-cols-2 gap-4">
            <div
              class="feature-card group flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc928]/30 hover:bg-white/[0.075]"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc928]/10 text-[#ffc928] transition-all group-hover:bg-[#ffc928]/20"
              >
                <i class="pi pi-chart-line text-xl"></i>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-extrabold leading-7 text-white">
                  ذكاء المبيعات
                </p>
                <p class="mt-1 text-[11px] leading-6 text-white/40">
                  إحصائيات ومؤشرات مباشرة
                </p>
              </div>
            </div>

            <div
              class="feature-card group flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc928]/30 hover:bg-white/[0.075]"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300 transition-all group-hover:bg-purple-400/20"
              >
                <i class="pi pi-th-large text-xl"></i>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-extrabold leading-7 text-white">
                  إدارة المخطط
                </p>
                <p class="mt-1 text-[11px] leading-6 text-white/40">
                  القطع والبلوكات والزونات
                </p>
              </div>
            </div>

            <div
              class="feature-card group flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc928]/30 hover:bg-white/[0.075]"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300 transition-all group-hover:bg-blue-400/20"
              >
                <i class="pi pi-file-edit text-xl"></i>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-extrabold leading-7 text-white">
                  العروض والعقود
                </p>
                <p class="mt-1 text-[11px] leading-6 text-white/40">
                  إعداد وإدارة المعاملات
                </p>
              </div>
            </div>

            <div
              class="feature-card group flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc928]/30 hover:bg-white/[0.075]"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 transition-all group-hover:bg-emerald-400/20"
              >
                <i class="pi pi-shield text-xl"></i>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-extrabold leading-7 text-white">
                  تحكم آمن
                </p>
                <p class="mt-1 text-[11px] leading-6 text-white/40">
                  حماية وإدارة الصلاحيات
                </p>
              </div>
            </div>
          </div>

          <!-- Brand footer -->
          <div class="mt-12 flex items-center gap-4">
            <div class="h-px w-12 bg-[#ffc928]/70"></div>
            <p class="text-xs leading-6 text-white/45">
              {{ projectConfig.marketer }}
            </p>
          </div>
        </section>

        <!-- Login panel -->
        <section class="w-full max-w-[590px] justify-self-center">
          <div
            class="admin-card relative overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_40px_120px_rgba(0,0,0,.42)] sm:rounded-[34px]"
          >
            <!-- Top accent -->
            <div class="absolute inset-x-0 top-0 flex h-[5px]">
              <div class="w-[65%] bg-[#7030A0]"></div>
              <div class="flex-1 bg-[#ffc928]"></div>
            </div>

            <div class="p-7 sm:p-10 lg:p-12">
              <!-- Mobile brand -->
              <div class="mb-9 text-center lg:hidden">
                <div
                  class="mx-auto mb-4 flex h-[66px] w-[66px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#7030A0] to-[#45205f] text-white shadow-xl shadow-purple-900/20"
                >
                  <i class="pi pi-building text-2xl"></i>
                </div>

                <h1 class="text-lg font-black leading-8 text-slate-900">
                  {{ projectConfig.name }}
                </h1>

                <p class="mt-1 text-xs leading-6 text-slate-400">
                  بوابة الإدارة
                </p>
              </div>

              <!-- Heading -->
              <div class="mb-9">
                <div class="mb-6 flex items-center justify-between gap-3">
                  <div
                    class="inline-flex items-center gap-2.5 rounded-xl border border-[#7030A0]/10 bg-[#7030A0]/[0.06] px-4 py-2.5"
                  >
                    <i class="pi pi-shield text-xs text-[#7030A0]"></i>
                    <span class="text-[11px] font-extrabold text-[#7030A0]">
                      دخول إداري محمي
                    </span>
                  </div>

                  <div
                    class="flex items-center gap-2 text-[11px] font-semibold text-slate-400"
                  >
                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                    نظام آمن
                  </div>
                </div>

                <p
                  class="mb-3 text-[10px] font-extrabold tracking-[0.2em] text-[#8546ad]"
                >
                  ADMINISTRATOR ACCESS
                </p>

                <h2
                  class="text-[30px] font-black leading-[1.55] tracking-tight text-[#21172c] sm:text-[36px]"
                >
                  تسجيل دخول الإدارة
                </h2>

                <p
                  class="mt-3 max-w-[460px] text-[14px] leading-[2.15] text-slate-500"
                >
                  أدخل بيانات اعتمادك للوصول إلى مركز التحكم وإدارة المشروع
                  ومتابعة جميع العمليات من مساحة عمل موحدة.
                </p>
              </div>

              <!-- Error -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-[-6px] opacity-0"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="errorMessage"
                  role="alert"
                  class="mb-7 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600"
                  >
                    <i class="pi pi-exclamation-circle"></i>
                  </div>

                  <div class="min-w-0 pt-0.5">
                    <strong
                      class="block text-xs font-black leading-6 text-rose-800"
                    >
                      تعذر تسجيل الدخول
                    </strong>

                    <p class="mt-1 text-xs leading-7 text-rose-700">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </Transition>

              <!-- Form -->
              <form
                @submit.prevent="handleLogin"
                class="space-y-7"
                novalidate
              >
                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="mb-3 block text-[13px] font-extrabold leading-7 text-slate-700"
                  >
                    البريد الإلكتروني المعتمد
                    <span class="text-rose-500">*</span>
                  </label>

                  <div class="admin-field relative" dir="ltr">
                    <span
                      class="absolute inset-y-0 left-0 flex w-[58px] items-center justify-center text-slate-400 transition-colors"
                    >
                      <i class="pi pi-envelope text-base"></i>
                    </span>

                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      required
                      autocomplete="username"
                      placeholder="mail@example.com"
                      class="h-[62px] w-full rounded-xl border border-slate-200 bg-[#f8f7fa] pl-[58px] pr-5 text-sm font-semibold leading-7 text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7030A0] focus:bg-white focus:ring-4 focus:ring-[#7030A0]/10"
                    />
                  </div>
                </div>

                <!-- Password -->
                <div>
                  <label
                    for="password"
                    class="mb-3 block text-[13px] font-extrabold leading-7 text-slate-700"
                  >
                    كلمة المرور / الرمز السري
                    <span class="text-rose-500">*</span>
                  </label>

                  <div class="admin-field relative" dir="ltr">
                    <span
                      class="absolute inset-y-0 left-0 flex w-[58px] items-center justify-center text-slate-400 transition-colors"
                    >
                      <i class="pi pi-lock text-base"></i>
                    </span>

                    <input
                      id="password"
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      placeholder="••••••••••••"
                      @keyup="checkCapsLock"
                      @keydown="checkCapsLock"
                      @blur="capsLockOn = false"
                      class="h-[62px] w-full rounded-xl border border-slate-200 bg-[#f8f7fa] pl-[58px] pr-[58px] text-sm font-semibold leading-7 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#7030A0] focus:bg-white focus:ring-4 focus:ring-[#7030A0]/10"
                    />

                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                      :aria-pressed="showPassword"
                      class="absolute inset-y-0 right-0 flex w-[54px] items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-[#7030A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7030A0]"
                    >
                      <i
                        :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        class="text-base"
                      ></i>
                    </button>
                  </div>

                  <Transition
                    enter-active-class="transition duration-150"
                    enter-from-class="opacity-0 -translate-y-1"
                    leave-active-class="transition duration-100"
                    leave-to-class="opacity-0"
                  >
                    <p
                      v-if="capsLockOn"
                      class="mt-3 flex items-center gap-2 text-xs font-semibold leading-6 text-amber-700"
                    >
                      <i class="pi pi-exclamation-triangle"></i>
                      زر Caps Lock مفعّل
                    </p>
                  </Transition>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="admin-submit group relative mt-3 flex h-[64px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-[#7030A0] via-[#64298f] to-[#4d206c] px-5 text-sm font-extrabold leading-7 text-white shadow-[0_10px_25px_rgba(112,48,160,.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_32px_rgba(112,48,160,.32)] active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    class="absolute inset-0 translate-x-full bg-gradient-to-l from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[-100%]"
                  ></span>

                  <i
                    :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
                    class="relative text-base"
                  ></i>

                  <span class="relative">
                    {{ loading ? 'جارٍ التحقق من بياناتك...' : 'دخول إلى لوحة الإدارة' }}
                  </span>

                  <i
                    v-if="!loading"
                    class="pi pi-arrow-left relative text-xs transition-transform duration-300 group-hover:-translate-x-1"
                  ></i>
                </button>
              </form>

              <!-- Security footer -->
              <div
                class="mt-9 flex items-center gap-3 border-t border-slate-100 pt-7"
              >
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7030A0]/[0.08] text-[#7030A0]"
                >
                  <i class="pi pi-shield text-base"></i>
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-extrabold leading-6 text-slate-700">
                    بيئة إدارية خاصة
                  </p>

                  <p class="mt-1 text-[11px] leading-6 text-slate-400">
                    الوصول متاح للمستخدمين الإداريين المعتمدين فقط.
                  </p>
                </div>

                <div
                  class="mr-auto flex shrink-0 items-center gap-1.5 text-[9px] font-extrabold text-emerald-600"
                >
                  <i class="pi pi-lock text-[10px]"></i>
                  SECURE
                </div>
              </div>
            </div>
          </div>

          <!-- Copyright -->
          <footer class="mt-7 text-center">
            <p class="text-[10px] leading-6 text-white/40">
              © {{ new Date().getFullYear() }} {{ projectConfig.name }}
              <span class="mx-1.5 text-white/20">|</span>
              جميع الحقوق محفوظة
            </p>
          </footer>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { projectConfig } from '../config/project';

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

<style scoped>
.admin-login {
  font-family: inherit;
}

.admin-card {
  animation: admin-card-enter 650ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.admin-field:focus-within > span {
  color: #7030a0;
}

.feature-card {
  animation: feature-enter 700ms ease both;
}

.feature-card:nth-child(2) {
  animation-delay: 80ms;
}

.feature-card:nth-child(3) {
  animation-delay: 160ms;
}

.feature-card:nth-child(4) {
  animation-delay: 240ms;
}

@keyframes admin-card-enter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes feature-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1023px) {
  .admin-login {
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-card,
  .feature-card {
    animation: none;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
