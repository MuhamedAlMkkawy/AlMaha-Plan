
<template>
  <footer
    class="relative mt-16 overflow-hidden border-t border-slate-200/80 bg-white print:hidden"
  >
    <!-- Accent line -->
    <div
      class="absolute inset-x-0 top-0 h-[3px]"
      :class="modeStyles.accent"
      aria-hidden="true"
    ></div>

    <!-- Decorative glow -->
    <div
      class="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(80%,42rem)] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
      :class="modeStyles.glow"
      aria-hidden="true"
    ></div>

    <div class="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-3xl flex-col items-center text-center">

        <!-- Brand mark -->
        <div
          class="mb-4 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ring-4 ring-white"
          :class="modeStyles.logo"
          aria-hidden="true"
        >
          <i class="pi pi-building text-xl"></i>
        </div>

        <p class="text-base font-black tracking-tight text-slate-900 sm:text-lg">
          {{ projectConfig.name }}
        </p>

        <p class="mt-1 text-xs font-medium tracking-wide text-slate-500">
          مخطط معتمد برقم {{ projectConfig.planNo }}
        </p>

        <p class="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
          منظومة مبيعات وعروض أسعار متكاملة لمشروع مخطط المها (مها الشرق)،
          لخدمة العملاء وفريق المبيعات وتسهيل استعراض الأراضي وإصدار عروض الأسعار.
        </p>

        <!-- Project information -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs shadow-sm shadow-slate-900/[0.03]"
          >
            <i
              class="pi pi-briefcase text-[11px]"
              :class="modeStyles.icon"
              aria-hidden="true"
            ></i>
            <span class="font-semibold text-slate-600">
              الجهة المالكة / البائع
            </span>
            <span class="text-slate-400">{{ projectConfig.seller }}</span>
          </div>

          <div
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs shadow-sm shadow-slate-900/[0.03]"
          >
            <i
              class="pi pi-megaphone text-[11px]"
              :class="modeStyles.icon"
              aria-hidden="true"
            ></i>
            <span class="font-semibold text-slate-600">المسوق الحصري</span>
            <span class="text-slate-400">{{ projectConfig.marketer }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-9 border-t border-slate-100 pt-5">
        <div
          class="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start"
        >
          <!-- Copyright -->
          <p class="text-[11px] leading-5 text-slate-400">
            جميع الحقوق محفوظة © {{ currentYear }} — {{ projectConfig.marketer }}
          </p>

          <!-- User mode indicator -->
          <div
            class="inline-flex max-w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 shadow-sm transition-all duration-200"
            :class="modeStyles.card"
          >
            <!-- Mode icon -->
            <div
              class="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm shadow-sm"
              :class="modeStyles.iconBox"
            >
              <i :class="modeStyles.modeIcon" aria-hidden="true"></i>
            </div>

            <!-- Mode details -->
            <div class="min-w-0 text-start">
              <p
                class="text-[9px] font-bold uppercase tracking-[0.13em]"
                :class="modeStyles.caption"
              >
                CURRENT ACCESS MODE
              </p>

              <p
                class="truncate text-xs font-extrabold"
                :class="modeStyles.title"
              >
                {{ modeStyles.label }}
              </p>
            </div>

            <!-- Status -->
            <div
              class="ms-2 flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1"
              :class="modeStyles.status"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="modeStyles.dot"
                aria-hidden="true"
              ></span>
              <span class="text-[10px] font-bold">
                نشط
              </span>
            </div>
          </div>

          <!-- System identity -->
          <div
            class="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200/70"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="modeStyles.systemDot"
              aria-hidden="true"
            ></span>
            <span>بوابة مبيعات مخطط المها</span>
            <span class="text-slate-300">•</span>
            <span>إصدار الإنتاج المعتمد</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { projectConfig } from '../../config/project';

const { user: authUser, isAdmin } = useAuthSession();

const isEmployee = computed(
  () => !isAdmin.value && authUser.value?.role === 'employee',
);

const isAdministrator = computed(() => isAdmin.value);

const modeStyles = computed(() => {
  if (isAdministrator.value) {
    return {
      label: 'مدير النظام',
      accent: 'bg-gradient-to-r from-purple-300 via-[#7030A0] to-purple-300',
      glow: 'bg-purple-300',
      logo: 'bg-gradient-to-br from-[#8546ad] to-[#57227f] shadow-purple-900/15',
      icon: 'text-[#7030A0]',
      modeIcon: 'pi pi-shield',
      iconBox: 'bg-purple-100 text-[#7030A0]',
      card: 'border-purple-200 bg-gradient-to-r from-purple-50 to-white',
      caption: 'text-purple-500',
      title: 'text-purple-950',
      status: 'bg-purple-100',
      dot: 'bg-purple-600',
      systemDot: 'bg-purple-500',
    };
  }

  if (isEmployee.value) {
    return {
      label: 'موظف',
      accent: 'bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300',
      glow: 'bg-indigo-300',
      logo: 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-900/15',
      icon: 'text-indigo-600',
      modeIcon: 'pi pi-briefcase',
      iconBox: 'bg-indigo-100 text-indigo-700',
      card: 'border-indigo-200 bg-gradient-to-r from-indigo-50 to-white',
      caption: 'text-indigo-500',
      title: 'text-indigo-950',
      status: 'bg-indigo-100',
      dot: 'bg-indigo-600',
      systemDot: 'bg-indigo-500',
    };
  }

  return {
    label: 'زائر',
    accent: 'bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300',
    glow: 'bg-emerald-300',
    logo: 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-900/15',
    icon: 'text-emerald-600',
    modeIcon: 'pi pi-user',
    iconBox: 'bg-emerald-100 text-emerald-700',
    card: 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-white',
    caption: 'text-emerald-600',
    title: 'text-emerald-950',
    status: 'bg-emerald-100',
    dot: 'bg-emerald-600',
    systemDot: 'bg-emerald-500',
  };
});

const currentYear = new Date().getFullYear();
</script>
