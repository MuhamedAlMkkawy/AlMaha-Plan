<template>
  <div class="space-y-10">
    <!-- Top Hero / Welcome Banner -->
    <div class="relative isolate overflow-hidden rounded-[2rem] bg-[#3b1259] p-7 sm:p-10 text-white shadow-[0_28px_56px_-24px_rgba(83,34,119,0.6)] ring-1 ring-white/10">
      <!-- Background layers -->
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_100%_0%,#7030A0_0%,#4c1d73_45%,#2e0d47_100%)]"></div>
      <div
        class="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style="background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: linear-gradient(to left, black, transparent 65%); mask-image: linear-gradient(to left, black, transparent 65%);"
      ></div>
      <div class="pointer-events-none absolute -left-20 -bottom-28 -z-10 w-96 h-96 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-28 -bottom-28 -z-10 w-80 h-80 rounded-full border border-white/10"></div>
      <div class="pointer-events-none absolute -left-14 -bottom-14 -z-10 w-52 h-52 rounded-full border border-white/10"></div>
      <!-- Gold hairline -->
      <div class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-l from-transparent via-amber-300/60 to-transparent"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10">
        <!-- Title block -->
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-purple-100 text-xs font-semibold">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            <span>مخطط معتمد برقم {{ projectConfig.planNo }}</span>
          </div>

          <h1 class="mt-5 text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            {{ projectConfig.name }}
          </h1>
          <div class="mt-5 h-px w-24 bg-gradient-to-l from-amber-300/80 to-transparent"></div>

          <!-- <p class="mt-4 text-sm sm:text-base leading-relaxed text-purple-100/90">
            لوحة الإحصائيات والمتابعة الحية لمبيعات الأراضي السكنية والتجارية والمرافق. البيانات متصلة مباشرة بجدول Google Sheets الرسمي.
          </p> -->
        </div>

        <!-- Actions: one primary, one secondary, one utility -->
        <div class="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full md:w-auto">
          <NuxtLink
            to="/quote"
            class="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/35 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b1259]"
          >
            <span class="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 blur-sm -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-[450%] group-hover:opacity-100 motion-reduce:hidden"></span>
            <i class="pi pi-file-edit text-xs transition-transform duration-300 group-hover:-rotate-6"></i>
            <span class="relative">إنشاء عرض سعر</span>
            <i class="pi pi-arrow-left text-[10px] opacity-60 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100"></i>
          </NuxtLink>

          <NuxtLink
            to="/plots"
            class="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/25 text-white font-semibold text-sm transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-white hover:text-[#5b2686] hover:ring-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b1259]"
          >
            <i class="pi pi-th-large text-xs transition-transform duration-300 group-hover:scale-110"></i>
            <span>استعراض جدول القطع</span>
          </NuxtLink>

          <button
            type="button"
            @click="refreshData"
            :disabled="refreshing"
            class="group self-center sm:self-auto inline-flex items-center justify-center gap-2 h-12 px-5 lg:px-0 lg:w-12 rounded-full bg-transparent ring-1 ring-white/25 text-white/90 text-sm font-medium transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-white/15 hover:text-white hover:ring-white/50 active:scale-95 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b1259]"
            title="تحديث البيانات"
            aria-label="تحديث البيانات"
          >
            <i :class="['pi pi-sync text-sm transition-transform duration-500', refreshing ? 'pi-spin' : 'group-hover:rotate-180']"></i>
            <span class="lg:hidden">تحديث</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending && !stats" class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div v-for="i in 8" :key="i" class="h-36 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse"></div>
    </div>

    <div v-else-if="stats" class="space-y-10">
      <!-- ================= KPI CARDS ================= -->


<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

  <!-- Total Plots: Purple Spotlight -->
  <NuxtLink
    to="/plots"
    class="group relative isolate overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#7030A0]/40 hover:shadow-[0_22px_45px_-16px_rgba(112,48,160,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
  >
    <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#7030A0] to-[#a35bd1]"></span>

    <div class="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-purple-500 opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-30"></div>
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-[#7030A0] via-[#7936a6] to-[#a35bd1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 transition-colors duration-300 group-hover:text-white/85">إجمالي القطع</span>
      <div class="w-10 h-10 rounded-2xl bg-purple-50 text-[#7030A0] flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white">
        <i class="pi pi-map-marker"></i>
      </div>
    </div>

    <div class="mt-4 text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-white">
      {{ formatInteger(stats.totalPlots) }}
    </div>

    <div class="mt-1 text-xs text-slate-400 font-medium transition-colors duration-300 group-hover:text-white/75">
      موزعة على {{ stats.blocksCount }} بلك • {{ stats.zonesCount }} زون
    </div>

    <div class="mt-4 flex items-center justify-between">
      <span class="text-[10px] font-bold text-[#7030A0] transition-colors duration-300 group-hover:text-white">استعراض القطع</span>
      <i class="pi pi-arrow-left text-[10px] text-[#7030A0] transition-all duration-300 group-hover:-translate-x-1 group-hover:text-white"></i>
    </div>
  </NuxtLink>

  <!-- Total Area: Blue Light Sweep -->
  <div
    class="group relative isolate overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_22px_45px_-16px_rgba(37,99,235,0.3)]"
  >
    <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-blue-500 to-sky-400"></span>

    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 to-sky-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

    <!-- Diagonal light sweep -->
    <div class="pointer-events-none absolute -left-1/2 top-0 -z-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[120%]"></div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 transition-colors duration-300 group-hover:text-white/85">إجمالي المساحة</span>
      <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white">
        <i class="pi pi-compass"></i>
      </div>
    </div>

    <div class="mt-4 text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-white">
      {{ formatCurrencyNumber(stats.totalArea) }}
    </div>

    <div class="mt-1 text-xs text-slate-400 font-medium transition-colors duration-300 group-hover:text-white/75">
      متر مربع (م²) مساحة الأراضي
    </div>

    <div class="mt-4 h-[18px]"></div>
  </div>

  <!-- Total Value: Emerald Glow -->
  <div
    class="group relative isolate overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-[0_22px_45px_-16px_rgba(16,185,129,0.3)]"
  >
    <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-emerald-500 to-teal-400"></span>

    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600 to-teal-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

    <div class="absolute -bottom-16 -left-12 -z-10 h-40 w-40 rounded-full bg-teal-300 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"></div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 transition-colors duration-300 group-hover:text-white/85">القيمة الإجمالية</span>
      <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
        <i class="pi pi-wallet"></i>
      </div>
    </div>

    <div class="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-white">
      {{ formatCurrencyNumber(stats.totalLandValue) }}
    </div>

    <div class="mt-1 text-xs text-slate-400 font-medium transition-colors duration-300 group-hover:text-white/75">
      ريال سعودي (بدون الضريبة والسعي)
    </div>

    <div class="mt-4 h-[18px]"></div>
  </div>

  <!-- Average Price: Amber Animated Accent -->
  <div
    class="group relative isolate overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_22px_45px_-16px_rgba(245,158,11,0.3)]"
  >
    <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-amber-400 to-orange-300"></span>

    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500 to-orange-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

    <div class="absolute inset-x-0 bottom-0 h-1 origin-right scale-x-0 bg-gradient-to-l from-white/20 via-white/80 to-white/20 transition-transform duration-700 group-hover:scale-x-100"></div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 transition-colors duration-300 group-hover:text-white/85">متوسط سعر المتر</span>
      <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white">
        <i class="pi pi-chart-line"></i>
      </div>
    </div>

    <div class="mt-4 text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-white">
      {{ formatCurrencyNumber(stats.averagePricePerM2) }}
    </div>

    <div class="mt-1 text-xs text-slate-400 font-medium transition-colors duration-300 group-hover:text-white/75">
      ر.س / م² متوسط لكامل المخطط
    </div>

    <div class="mt-4 h-[18px]"></div>
  </div>

</div>




      <!-- ================= SALES STATUS ================= -->
      <section class="relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 sm:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div class="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#7030A0]/[0.05] blur-3xl"></div>

        <div class="relative flex items-start justify-between gap-4 mb-6">
          <div>
            <span class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#7030A0]">
              <span class="w-6 h-px bg-[#7030A0]/50"></span>
              المبيعات
            </span>
            <h2 class="mt-1.5 text-xl font-black text-slate-900 tracking-tight">حالة المبيعات</h2>
            <p class="text-xs text-slate-400 mt-1">اضغط على أي جزء من الرسم أو على البطاقة لعرض القطع</p>
          </div>
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-3xl font-black text-[#7030A0] leading-none">{{ formatPercent(soldPercent) }}</span>
            <span class="text-[11px] text-slate-400 mt-1">نسبة المباع من المخطط</span>
          </div>
        </div>

        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Doughnut -->
          <div class="relative h-72 w-full max-w-sm mx-auto">
            <div class="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-100"></div>
            <canvas ref="statusCanvas" class="relative"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-[11px] text-slate-400 font-semibold tracking-wide">إجمالي القطع</span>
              <span class="text-5xl font-black text-slate-900 leading-none mt-1.5 tracking-tight">{{ formatInteger(stats.totalPlots) }}</span>
              <span class="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {{ formatInteger(stats.soldCount) }} مباعة
              </span>
            </div>
          </div>

          <!-- Status rows -->
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="s in statusCards"
              :key="s.status"
              :to="`/plots?status=${encodeURIComponent(s.status)}`"
              class="group relative flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 ps-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/30"
              :style="{ '--c': s.color }"
            >
              <span class="absolute inset-y-0 start-0 w-1.5" :style="{ backgroundColor: s.color }"></span>
              <span class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :style="{ background: `linear-gradient(to left, transparent, ${s.color}0D)` }"></span>

              <div class="relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105" :style="{ backgroundColor: s.color + '1A', color: s.color }">
                <i :class="['pi text-lg', s.icon]"></i>
              </div>

              <div class="relative flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-bold text-slate-900 text-sm">{{ s.status }}</span>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full" :style="{ backgroundColor: s.color + '1A', color: s.color }">
                    {{ formatPercent(s.percent) }}
                  </span>
                </div>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-2xl font-black text-slate-900">{{ formatInteger(s.count) }}</span>
                  <span class="text-xs font-medium text-slate-400">قطعة</span>
                </div>
                <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700" :style="{ width: Math.max(s.percent, 1.5) + '%', background: `linear-gradient(to left, ${s.color}, ${s.color}B3)` }"></div>
                </div>
              </div>

              <i class="relative pi pi-arrow-left text-[11px] text-slate-300 transition-all duration-300 group-hover:text-slate-700 group-hover:-translate-x-1"></i>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ================= USAGE x STATUS ANALYTICS ================= -->
      <section class="space-y-6">
        <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <!-- Title -->
          <div>
            <span class="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#7030A0]">
              <span class="w-6 h-px bg-[#7030A0]/50"></span>
              التحليلات
            </span>
            <h2 class="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              التحليل حسب الاستخدام والحالة
            </h2>
            <p class="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5">
              <i :class="['pi text-[10px]', anyHidden ? 'pi-filter-fill text-[#7030A0]' : 'pi-filter']"></i>
              <span v-if="!anyHidden">اضغط على الحالة لإظهارها أو إخفائها في جميع الرسوم</span>
              <span v-else>
                يتم عرض <strong class="text-slate-700">{{ visibleStatuses.length }}</strong> من {{ STATUSES.length }} حالات في الرسوم
              </span>
            </p>
          </div>

          <!-- Toolbar -->
          <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-[1.25rem] bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] self-start xl:self-auto">
            <!-- Status filter chips -->
            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="تصفية حسب الحالة">
              <button
                v-for="st in STATUSES"
                :key="st"
                type="button"
                @click="toggleStatus(st)"
                :aria-pressed="!hidden[st]"
                :aria-disabled="isLastVisible(st)"
                :title="isLastVisible(st) ? 'يجب إبقاء حالة واحدة على الأقل ظاهرة' : (hidden[st] ? 'إظهار ' + st : 'إخفاء ' + st)"
                class="group inline-flex items-center gap-2 ps-3 pe-2 py-2 rounded-full border text-xs font-semibold transition-all duration-300 ease-out motion-reduce:transition-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                :class="[
                  hidden[st]
                    ? 'bg-slate-50 border-dashed border-slate-300 text-slate-400 hover:bg-white hover:border-slate-400 hover:text-slate-600'
                    : 'text-slate-800 hover:shadow-sm',
                  isLastVisible(st) ? 'cursor-not-allowed' : 'cursor-pointer'
                ]"
                :style="hidden[st] ? {} : { backgroundColor: STATUS_COLORS[st] + '14', borderColor: STATUS_COLORS[st] + '55' }"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  :class="hidden[st] ? 'ring-0' : 'ring-4'"
                  :style="{ backgroundColor: hidden[st] ? '#cbd5e1' : STATUS_COLORS[st], '--tw-ring-color': STATUS_COLORS[st] + '33' }"
                ></span>
                <span :class="hidden[st] ? 'line-through decoration-slate-300' : ''">{{ st }}</span>
                <span
                  class="min-w-6 px-1.5 py-0.5 rounded-full text-[10px] leading-none text-center font-bold tabular-nums transition-colors duration-300"
                  :class="hidden[st] ? 'bg-slate-200/70 text-slate-400' : 'bg-white text-slate-700 shadow-sm'"
                >{{ formatInteger(statusCount(st)) }}</span>
                <i
                  :class="[
                    'pi text-[10px] transition-all duration-300',
                    isLastVisible(st) ? 'pi-lock text-slate-400' : (hidden[st] ? 'pi-eye-slash text-slate-400' : 'pi-eye text-slate-400 group-hover:text-slate-700')
                  ]"
                ></i>
              </button>

              <!-- Reset (only when something is hidden) -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-90"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0 scale-90"
              >
                <button
                  v-if="anyHidden"
                  type="button"
                  @click="resetFilter"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-[#7030A0] hover:bg-purple-50 transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                >
                  <i class="pi pi-refresh text-[10px]"></i>
                  <span>إظهار الكل</span>
                </button>
              </Transition>
            </div>

            <span class="hidden sm:block w-px h-6 bg-slate-200 mx-1"></span>

            <!-- Stacked / grouped toggle -->
            <div class="inline-flex items-center p-1 rounded-full bg-slate-100 ring-1 ring-slate-200/60" role="tablist" aria-label="نمط الأعمدة">
              <button
                v-for="m in modeOptions"
                :key="String(m.value)"
                type="button"
                role="tab"
                :aria-selected="stackMode === m.value"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
                :class="stackMode === m.value
                  ? 'bg-white text-[#7030A0] shadow-sm ring-1 ring-slate-200/70'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'"
                @click="stackMode = m.value"
              >
                <i :class="['pi text-[10px]', m.icon]"></i>
                <span>{{ m.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <!-- Area -->
          <div class="group rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.18)]">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><i class="pi pi-expand text-sm"></i></span>
                <div>
                  <h3 class="text-sm font-black text-slate-900">المساحة حسب الاستخدام والحالة</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">متر مربع (م²)</p>
                </div>
              </div>
              <div class="text-end">
                <div class="text-lg font-black text-slate-900 leading-none">{{ compact(stats.totalArea) }}</div>
                <div class="text-[10px] text-slate-400 mt-1">إجمالي م²</div>
              </div>
            </div>
            <div class="mt-5 h-72"><canvas ref="areaCanvas"></canvas></div>
          </div>

          <!-- Value -->
          <div class="group rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.18)]">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><i class="pi pi-wallet text-sm"></i></span>
                <div>
                  <h3 class="text-sm font-black text-slate-900">القيمة الإجمالية حسب الاستخدام والحالة</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">ريال سعودي (ر.س)</p>
                </div>
              </div>
              <div class="text-end">
                <div class="text-lg font-black text-slate-900 leading-none">{{ compact(stats.totalLandValue) }}</div>
                <div class="text-[10px] text-slate-400 mt-1">إجمالي ر.س</div>
              </div>
            </div>
            <div class="mt-5 h-72"><canvas ref="valueCanvas"></canvas></div>
          </div>

          <!-- Usage share -->
          <div class="group rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.18)]">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl bg-purple-50 text-[#7030A0] flex items-center justify-center"><i class="pi pi-chart-pie text-sm"></i></span>
                <div>
                  <h3 class="text-sm font-black text-slate-900">توزيع المساحة حسب الاستخدام</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">النسبة من إجمالي مساحة المخطط</p>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div class="relative h-56 w-full max-w-[14rem] mx-auto">
                <canvas ref="usageCanvas"></canvas>
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-2xl font-black text-slate-900 leading-none">{{ compact(stats.totalArea) }}</span>
                  <span class="text-[10px] text-slate-400 mt-1">م² إجمالي</span>
                </div>
              </div>

              <ul class="space-y-3">
                <li v-for="u in usageRows" :key="u.name">
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="inline-flex items-center gap-2 font-bold text-slate-800">
                      <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: u.color }"></span>
                      {{ u.name }}
                    </span>
                    <span class="font-black" :style="{ color: u.color }">{{ formatPercent(u.percent) }}</span>
                  </div>
                  <div class="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700" :style="{ width: Math.max(u.percent, 1.5) + '%', backgroundColor: u.color }"></div>
                  </div>
                  <div class="mt-1 text-[10px] text-slate-400">{{ formatCurrencyNumber(u.area) }} م²</div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Avg price -->
          <div class="group rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.18)]">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><i class="pi pi-chart-line text-sm"></i></span>
                <div>
                  <h3 class="text-sm font-black text-slate-900">متوسط سعر المتر حسب الاستخدام والحالة</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">ر.س / م²</p>
                </div>
              </div>
              <div class="text-end">
                <div class="text-lg font-black text-slate-900 leading-none">{{ formatCurrencyNumber(stats.averagePricePerM2) }}</div>
                <div class="text-[10px] text-slate-400 mt-1">المتوسط العام</div>
              </div>
            </div>
            <div class="mt-5 h-72"><canvas ref="priceCanvas"></canvas></div>
          </div>
        </div>
      </section>

      <!-- Full data table kept (collapsed) so no figure is lost -->
      <details class="group bg-white rounded-3xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        <summary class="p-6 cursor-pointer flex items-center justify-between list-none hover:bg-slate-50/70 transition-colors">
          <div>
            <h2 class="text-base font-black text-slate-900">جدول التفاصيل (تقرير الاستخدام × الحالة)</h2>
            <p class="text-xs text-slate-400 mt-1">
              مطابق لتقرير Rep في ملف الإكسل الأصلي — آخر مزامنة: {{ stats.lastUpdated }}
            </p>
          </div>
          <span class="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center transition-colors group-hover:bg-purple-50 group-hover:text-[#7030A0]">
            <i class="pi pi-chevron-down text-xs group-open:rotate-180 transition-transform"></i>
          </span>
        </summary>

        <div class="overflow-x-auto border-t border-slate-100">
          <table class="w-full text-center border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th class="px-4 py-3 text-start">الاستخدام</th>
                <th class="px-4 py-3">حالة البيع</th>
                <th class="px-4 py-3">عدد القطع</th>
                <th class="px-4 py-3">المساحة الإجمالية (م²)</th>
                <th class="px-4 py-3">متوسط سعر المتر (ر.س)</th>
                <th class="px-4 py-3">القيمة الإجمالية (ر.س)</th>
                <th class="px-4 py-3">النسبة من المساحة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in stats.matrix"
                :key="idx"
                class="hover:bg-purple-50/40 transition-colors cursor-pointer"
                @click="navigateTo(`/plots?usage=${encodeURIComponent(row.usage)}&status=${encodeURIComponent(row.status)}`)"
              >
                <td class="px-4 py-3 text-start font-bold text-slate-900">
                  <span
                    :class="[
                      'inline-block px-2.5 py-0.5 rounded-full text-xs',
                      row.usage === 'سكنى' ? 'bg-blue-50 text-blue-700' :
                      row.usage === 'تجارى' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                    ]"
                  >
                    {{ row.usage }}
                  </span>
                </td>
                <td class="px-4 py-3"><PlotsStatusBadge :status="row.status" /></td>
                <td class="px-4 py-3 font-bold text-slate-900">{{ formatInteger(row.count) }}</td>
                <td class="px-4 py-3 font-medium">{{ formatCurrencyNumber(row.area) }}</td>
                <td class="px-4 py-3 font-medium text-slate-600">{{ formatCurrencyNumber(row.avgPrice) }}</td>
                <td class="px-4 py-3 font-bold text-slate-900">{{ formatCurrencyNumber(row.value) }}</td>
                <td class="px-4 py-3 font-semibold text-[#7030A0]">{{ formatPercent(row.sharePercent) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-purple-50/80 font-black text-slate-900 border-t-2 border-purple-200">
                <td colspan="2" class="px-4 py-3.5 text-start font-black text-sm">المجموع الكلي للمخطط</td>
                <td class="px-4 py-3.5 font-black text-sm">{{ formatInteger(stats.totalPlots) }}</td>
                <td class="px-4 py-3.5 font-black">{{ formatCurrencyNumber(stats.totalArea) }} م²</td>
                <td class="px-4 py-3.5 font-black">{{ formatCurrencyNumber(stats.averagePricePerM2) }}</td>
                <td class="px-4 py-3.5 font-black text-[#7030A0]">{{ formatCurrencyNumber(stats.totalLandValue) }} ر.س</td>
                <td class="px-4 py-3.5 font-black">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      <!-- Quick Exploration Shortcuts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <NuxtLink
          to="/blocks"
          class="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 flex items-center justify-between shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7030A0]/30 hover:shadow-[0_20px_40px_-16px_rgba(112,48,160,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 text-[#7030A0] flex items-center justify-center text-lg transition-all duration-300 group-hover:bg-[#7030A0] group-hover:text-white group-hover:scale-105">
              <i class="pi pi-objects-column"></i>
            </div>
            <div>
              <h3 class="font-black text-slate-900 text-base group-hover:text-[#7030A0] transition-colors duration-300">
                استعراض البلوكات ({{ stats.blocksCount }} بلك)
              </h3>
              <p class="text-xs text-slate-400 mt-1">تصفح البلوكات كبطاقات مرئية مع نسب المبيعات وحالة كل قطعة</p>
            </div>
          </div>
          <i class="pi pi-arrow-left text-xs text-slate-300 transition-all duration-300 group-hover:text-[#7030A0] group-hover:-translate-x-1"></i>
        </NuxtLink>

        <NuxtLink
          to="/zones"
          class="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 flex items-center justify-between shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_20px_40px_-16px_rgba(16,185,129,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105">
              <i class="pi pi-map"></i>
            </div>
            <div>
              <h3 class="font-black text-slate-900 text-base group-hover:text-emerald-700 transition-colors duration-300">
                استعراض الزونات ({{ stats.zonesCount }} زون)
              </h3>
              <p class="text-xs text-slate-400 mt-1">توزيع القطع حسب المناطق والزونات A1, A2, B1, B2</p>
            </div>
          </div>
          <i class="pi pi-arrow-left text-xs text-slate-300 transition-all duration-300 group-hover:text-emerald-700 group-hover:-translate-x-1"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chart as ChartType } from 'chart.js';
import { projectConfig } from '../config/project';
import { formatCurrencyNumber, formatInteger, formatPercent } from '../../lib/format';
import type { PlotStatistics } from '../../shared/types/plot';

const { data: statsResponse, pending, refresh } = await useFetch<{ success: boolean; data: PlotStatistics }>('/api/stats');
const stats = computed(() => statsResponse.value?.data);

const refreshing = ref(false);
const refreshData = async () => {
  refreshing.value = true;
  await refresh();
  refreshing.value = false;
};

/* ---------- Constants ---------- */
const STATUSES = ['متاح للبيع', 'محجوز', 'مباع'] as const;
const STATUS_COLORS: Record<string, string> = {
  'متاح للبيع': '#10b981',
  'محجوز': '#f59e0b',
  'مباع': '#f43f5e',
};
// Matches the usage badges in the details table
const usageColor = (name: string, i: number) => {
  if (name === 'سكنى') return '#3b82f6';
  if (name === 'تجارى') return '#7030A0';
  return ['#10b981', '#f59e0b', '#64748b', '#06b6d4'][i % 4];
};

/* ---------- UI state: status filter + stacked/grouped ---------- */
const hidden = reactive<Record<string, boolean>>({});
const visibleStatuses = computed(() => STATUSES.filter((s) => !hidden[s]));
const anyHidden = computed(() => STATUSES.some((s) => hidden[s]));

// the only status still visible can't be hidden (keeps the charts from going empty)
const isLastVisible = (st: string) => !hidden[st] && visibleStatuses.value.length === 1;

const statusCount = (st: string) => {
  const s = stats.value;
  if (!s) return 0;
  if (st === 'متاح للبيع') return s.availableCount;
  if (st === 'محجوز') return s.reservedCount;
  return s.soldCount;
};

const toggleStatus = (st: string) => {
  if (isLastVisible(st)) return;
  hidden[st] = !hidden[st];
};

const resetFilter = () => {
  STATUSES.forEach((s) => { hidden[s] = false; });
};

const stackMode = ref<boolean>(true);
const modeOptions = [
  { value: true, label: 'مجمّع', icon: 'pi-align-justify' },
  { value: false, label: 'متجاور', icon: 'pi-chart-bar' },
];

/* ---------- Derived data ---------- */
const soldPercent = computed(() => {
  const s = stats.value;
  return s && s.totalPlots ? (s.soldCount / s.totalPlots) * 100 : 0;
});

const statusCards = computed(() => {
  const s = stats.value;
  if (!s) return [];
  const total = s.totalPlots || 1;
  return [
    { status: 'متاح للبيع', count: s.availableCount, color: STATUS_COLORS['متاح للبيع'], percent: (s.availableCount / total) * 100, icon: 'pi-check-circle' },
    { status: 'محجوز', count: s.reservedCount, color: STATUS_COLORS['محجوز'], percent: (s.reservedCount / total) * 100, icon: 'pi-bookmark' },
    { status: 'مباع', count: s.soldCount, color: STATUS_COLORS['مباع'], percent: (s.soldCount / total) * 100, icon: 'pi-tag' },
  ];
});

const usages = computed(() => Array.from(new Set((stats.value?.matrix ?? []).map((r) => r.usage))));

const metricByUsageStatus = (metric: 'area' | 'value' | 'avgPrice' | 'count', status: string) =>
  usages.value.map((u) => {
    const row = stats.value?.matrix.find((r) => r.usage === u && r.status === status);
    return row ? Number(row[metric]) || 0 : 0;
  });

const areaByUsage = computed(() =>
  usages.value.map((u) =>
    (stats.value?.matrix ?? []).filter((r) => r.usage === u).reduce((sum, r) => sum + (Number(r.area) || 0), 0)
  )
);

const usageRows = computed(() => {
  const total = areaByUsage.value.reduce((a, b) => a + b, 0) || 1;
  return usages.value.map((name, i) => ({
    name,
    area: areaByUsage.value[i],
    percent: (areaByUsage.value[i] / total) * 100,
    color: usageColor(name, i),
  }));
});

const compact = (v: number | string) =>
  new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(v));

/* ---------- Chart.js (client only) ---------- */
const statusCanvas = ref<HTMLCanvasElement | null>(null);
const areaCanvas = ref<HTMLCanvasElement | null>(null);
const valueCanvas = ref<HTMLCanvasElement | null>(null);
const usageCanvas = ref<HTMLCanvasElement | null>(null);
const priceCanvas = ref<HTMLCanvasElement | null>(null);

let charts: ChartType[] = [];
let ChartCtor: typeof ChartType | null = null;
let buildToken = 0;

const destroyCharts = () => {
  charts.forEach((c) => c.destroy());
  charts = [];
};

const hexToRgba = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Vertical gradient that follows the chart area (rich at the top, soft at the base)
const gradientFill = (color: string) => (context: any) => {
  const { ctx, chartArea } = context.chart;
  if (!chartArea) return color;
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, hexToRgba(color, 0.55));
  g.addColorStop(1, color);
  return g;
};

const tooltipBase = {
  rtl: true,
  textDirection: 'rtl' as const,
  titleAlign: 'right' as const,
  bodyAlign: 'right' as const,
  footerAlign: 'right' as const,
  backgroundColor: 'rgba(15, 23, 42, 0.96)',
  padding: 12,
  cornerRadius: 14,
  boxPadding: 5,
  usePointStyle: true,
  caretSize: 6,
  titleFont: { weight: 'bold' as const, size: 13 },
  bodyFont: { size: 12 },
  footerFont: { weight: 'bold' as const, size: 12 },
};

const baseOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeOutQuart' as const },
});

const barScales = () => ({
  x: {
    reverse: true,
    grid: { display: false },
    border: { display: false },
    ticks: { color: '#334155', font: { weight: 600 as const, size: 12 }, padding: 8 },
  },
  y: {
    position: 'right' as const,
    beginAtZero: true,
    grid: { color: '#eef2f7' },
    border: { display: false, dash: [4, 4] },
    ticks: { color: '#94a3b8', font: { size: 11 }, padding: 10, callback: (v: any) => compact(v) },
  },
});

const makeBar = (canvas: HTMLCanvasElement, metric: 'area' | 'value' | 'avgPrice', stacked: boolean) => {
  const scales: any = barScales();
  scales.x.stacked = stacked;
  scales.y.stacked = stacked;

  return new ChartCtor!(canvas, {
    type: 'bar',
    data: {
      labels: usages.value,
      datasets: visibleStatuses.value.map((s) => ({
        label: s,
        data: metricByUsageStatus(metric, s),
        backgroundColor: gradientFill(STATUS_COLORS[s]),
        hoverBackgroundColor: STATUS_COLORS[s],
        borderRadius: 10,
        borderSkipped: false,
        borderColor: '#ffffff',
        borderWidth: stacked ? 2 : 0,
        maxBarThickness: stacked ? 56 : 34,
        categoryPercentage: stacked ? 0.7 : 0.8,
        barPercentage: 0.9,
      })),
    },
    options: {
      ...baseOptions(),
      interaction: { mode: 'index', intersect: false },
      scales,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipBase,
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: ${formatCurrencyNumber(ctx.parsed.y as number)}`,
            footer: (items: any[]) => {
              if (!stacked || items.length < 2 || metric === 'avgPrice') return '';
              const sum = items.reduce((a, i) => a + (i.parsed.y || 0), 0);
              return `الإجمالي: ${formatCurrencyNumber(sum)}`;
            },
          },
        },
      },
    } as any,
  });
};

const makeDoughnut = (
  canvas: HTMLCanvasElement,
  labels: string[],
  data: number[],
  colors: string[],
  cutout: string,
  label: (v: number, total: number) => string,
  onClick?: (index: number) => void,
) => {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  return new ChartCtor!(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 0,
        borderRadius: 12,
        spacing: 4,
        hoverOffset: 8,
      }],
    },
    options: {
      ...baseOptions(),
      cutout,
      layout: { padding: 8 },
      onClick: onClick ? (_e: any, els: any[]) => { if (els.length) onClick(els[0].index); } : undefined,
      onHover: (e: any, els: any[]) => {
        const t = e.native?.target as HTMLElement | undefined;
        if (t) t.style.cursor = onClick && els.length ? 'pointer' : 'default';
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipBase,
          callbacks: { label: (ctx: any) => ` ${label(ctx.parsed as number, total)}` },
        },
      },
    } as any,
  });
};

const buildCharts = async () => {
  if (!import.meta.client || !stats.value) return;
  const token = ++buildToken;
  await nextTick();

  if (!ChartCtor) {
    const mod = await import('chart.js/auto');
    ChartCtor = mod.Chart as unknown as typeof ChartType;
    ChartCtor.defaults.font.family = getComputedStyle(document.body).fontFamily || 'inherit';
    ChartCtor.defaults.color = '#475569';
  }
  if (token !== buildToken) return;
  destroyCharts();

  const s = stats.value;

  // 1) Status doughnut (click → filtered plots)
  if (statusCanvas.value) {
    charts.push(
      makeDoughnut(
        statusCanvas.value,
        [...STATUSES],
        [s.availableCount, s.reservedCount, s.soldCount],
        STATUSES.map((st) => STATUS_COLORS[st]),
        '78%',
        (v, total) => `${formatInteger(v)} قطعة (${formatPercent((v / total) * 100)})`,
        (i) => navigateTo(`/plots?status=${encodeURIComponent(STATUSES[i])}`),
      ),
    );
  }

  // 2) Area  3) Value  — stacked or grouped
  if (areaCanvas.value) charts.push(makeBar(areaCanvas.value, 'area', stackMode.value));
  if (valueCanvas.value) charts.push(makeBar(valueCanvas.value, 'value', stackMode.value));

  // 4) Area share by usage
  if (usageCanvas.value) {
    charts.push(
      makeDoughnut(
        usageCanvas.value,
        usages.value,
        areaByUsage.value,
        usageRows.value.map((u) => u.color),
        '72%',
        (v, total) => `${formatCurrencyNumber(v)} م² (${formatPercent((v / total) * 100)})`,
      ),
    );
  }

  // 5) Avg price per m² (always grouped: stacking averages is meaningless)
  if (priceCanvas.value) charts.push(makeBar(priceCanvas.value, 'avgPrice', false));
};

onMounted(buildCharts);
watch([stats, stackMode, visibleStatuses], buildCharts);
onBeforeUnmount(() => {
  buildToken++;
  destroyCharts();
});
</script>