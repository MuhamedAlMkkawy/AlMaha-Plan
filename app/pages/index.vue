
<template>
  <main
    dir="rtl"
    class="relative min-h-screen overflow-hidden bg-slate-50"
  >
    <!-- Background decoration -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#126B58]/[0.06] blur-3xl"
      ></div>

      <div
        class="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"
      ></div>

      <div
        class="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-[#126B58]/[0.04] blur-3xl"
      ></div>
    </div>
    

    <!-- Authenticated dashboard -->
    <Transition
      name="dashboard-transition"
      mode="out-in"
    >
      <section
        v-if="canViewDashboard"
        key="authenticated"
        class="relative z-10 min-h-screen"
      >
        <div
          class="transition-all duration-300 hover:shadow-none"
        >
          <DashboardAuthenticatedDashboard />
        </div>
      </section>

      <!-- Public landing page -->
      <section
        v-else-if="loaded && !user"
        key="public"
        class="relative z-10 min-h-screen"
      >
        <LandingPublicLandingPage />
      </section>

      <!-- Loading / permission resolution -->
      <section
        v-else
        key="loading"
        class="relative z-10 flex min-h-[75vh] items-center justify-center px-5 py-16"
      >
        <div
          class="group relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-9 text-center shadow-[0_15px_50px_-20px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#126B58]/30 hover:shadow-[0_25px_65px_-25px_rgba(18,107,88,0.25)] sm:p-12"
        >
          <!-- Top accent -->
          <div
            class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#126B58] via-emerald-400 to-[#126B58]"
          ></div>

          <!-- Decorative circles -->
          <div
            class="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#126B58]/[0.04] transition-transform duration-700 group-hover:scale-150"
          ></div>

          <div
            class="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-emerald-100/50 transition-transform duration-700 group-hover:scale-150"
          ></div>

          <!-- Loading icon -->
          <div class="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center">
            <div
              class="absolute inset-0 animate-ping rounded-[1.7rem] bg-[#126B58]/10"
            ></div>

            <div
              class="absolute inset-1 rounded-[1.5rem] border border-[#126B58]/15 bg-[#126B58]/[0.06]"
            ></div>

            <div
              class="relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#126B58] to-[#0D5144] text-white shadow-lg shadow-[#126B58]/25 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
            >
              <i class="pi pi-shield text-2xl"></i>
            </div>
          </div>

          <!-- Loading text -->
          <div class="relative space-y-3">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-[#126B58]/15 bg-[#126B58]/[0.06] px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-[#126B58]"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"
                ></span>
                <span
                  class="relative inline-flex h-2 w-2 rounded-full bg-[#126B58]"
                ></span>
              </span>
              التحقق الأمني
            </span>

            <h2
              class="text-xl font-black tracking-tight text-slate-800 sm:text-2xl"
            >
              جاري التحقق من الصلاحيات
            </h2>

            <p
              class="mx-auto max-w-xs text-sm font-medium leading-7 text-slate-500"
            >
              يرجى الانتظار لحظات، نقوم بتجهيز الصفحة والتحقق من مستوى الوصول المسموح به لحسابك.
            </p>
          </div>

          <!-- Loading progress -->
          <div class="relative mt-8">
            <div
              class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            >
              <div
                class="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-l from-[#126B58] to-emerald-400"
              ></div>
            </div>

            <div
              class="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400"
            >
              <span>تأمين الجلسة</span>
              <span>يرجى الانتظار...</span>
            </div>
          </div>
        </div>
      </section>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthSession } from '../composables/useAuthSession';

const { user, isAdmin, can, loaded } = useAuthSession();

// Only administrators and employees with view_stats
// are allowed to access the authenticated dashboard.
const canViewDashboard = computed(() => {
  if (!loaded.value || !user.value) return false;

  if (isAdmin.value) return true;

  return can('view_stats');
});
</script>

<style scoped>
/* Smooth page transitions */
.dashboard-transition-enter-active,
.dashboard-transition-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.dashboard-transition-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.dashboard-transition-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Loading progress animation */
@keyframes loading-bar {
  0% {
    transform: translateX(120%);
  }

  100% {
    transform: translateX(-320%);
  }
}

.animate-loading-bar {
  animation: loading-bar 1.6s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-transition-enter-active,
  .dashboard-transition-leave-active,
  .animate-loading-bar,
  .animate-ping {
    animation: none !important;
    transition: none !important;
  }
}
</style>
