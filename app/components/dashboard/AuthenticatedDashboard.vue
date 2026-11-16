
<template>
  <div class="dashboard-page space-y-10" dir="rtl">

    <!-- ================= HERO / WELCOME ================= -->
    <section class="hero-banner relative isolate overflow-hidden rounded-[2rem] bg-[#174A40] p-7 sm:p-10 text-white shadow-xl">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_100%_0%,#126B58_0%,#174A40_50%,#0D5143_100%)]"></div>

      <div
        class="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style="background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 24px 24%;"
      ></div>

      <div class="pointer-events-none absolute -left-20 -bottom-28 -z-10 h-96 w-96 rounded-full bg-[#B89A68]/20 blur-3xl"></div>
      <div class="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-l from-transparent via-[#D8C5A0]/70 to-transparent"></div>

      <div class="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#D8C5A0] ring-1 ring-white/20 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            <span>مخطط معتمد برقم {{ projectConfig.planNo }}</span>
          </div>

          <h1 class="mt-5 text-3xl font-black leading-relaxed tracking-tight sm:text-5xl">
            {{ projectConfig.name }}
          </h1>

          <div class="mt-4 h-[3px] w-24 rounded-full bg-gradient-to-l from-[#B89A68] to-transparent"></div>
        </div>

        <div class="flex w-full flex-col items-stretch gap-3 sm:flex-row md:w-auto md:flex-col lg:flex-row lg:items-center">
          <NuxtLink
            to="/quote"
            class="hero-primary-button group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#D8C5A0] to-[#B89A68] px-7 py-3.5 text-sm font-black text-[#174A40] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
          >
            <i class="pi pi-file-edit text-xs"></i>
            <span>إنشاء عرض سعر</span>
            <i class="pi pi-arrow-left text-[10px] opacity-60 transition-transform group-hover:-translate-x-1"></i>
          </NuxtLink>

          <NuxtLink
            to="/plots"
            class="hero-secondary-button group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white/10 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#174A40] active:scale-[0.98]"
          >
            <i class="pi pi-th-large text-xs transition-transform group-hover:scale-110"></i>
            <span>استعراض جدول القطع</span>
          </NuxtLink>

          <button
            type="button"
            @click="refreshData"
            :disabled="refreshing"
            class="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/25 transition-all duration-300 hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 lg:w-12 lg:px-0"
            title="تحديث البيانات"
            aria-label="تحديث البيانات"
          >
            <i :class="['pi pi-sync text-sm transition-transform duration-500', refreshing ? 'pi-spin' : 'group-hover:rotate-180']"></i>
            <span class="lg:hidden">تحديث البيانات</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ================= LOADING ================= -->
    <div v-if="pending && !stats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="i in 8"
        :key="i"
        class="h-36 animate-pulse rounded-3xl border border-[#E5E9E5] bg-white"
      ></div>
    </div>

    <div v-else-if="stats" class="space-y-10">

      <!-- ================= KPI CARDS ================= -->
      <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Total Plots -->
        <NuxtLink
          to="/plots"
          class="dashboard-card kpi-card group relative isolate overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300"
        >
          <span class="absolute inset-x-0 top-0 h-1 bg-[#126B58]"></span>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#718078]">إجمالي القطع</span>
            <div class="kpi-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5EEE9] text-[#126B58]">
              <i class="pi pi-map-marker text-lg"></i>
            </div>
          </div>

          <div class="mt-5 text-3xl font-black tracking-tight text-[#293B36] tabular-nums">
            {{ formatInteger(stats.totalPlots) }}
          </div>

          <p class="mt-2 text-xs font-medium text-[#718078]">
            موزعة على {{ stats.blocksCount }} بلك • {{ stats.zonesCount }} زون
          </p>

          <div class="mt-5 flex items-center justify-between border-t border-[#E5E9E5] pt-4">
            <span class="text-xs font-black text-[#126B58]">استعراض القطع</span>
            <i class="pi pi-arrow-left text-[11px] text-[#126B58] transition-transform duration-300 group-hover:-translate-x-1"></i>
          </div>
        </NuxtLink>

        <!-- Total Area -->
        <div class="dashboard-card kpi-card group relative isolate overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
          <span class="absolute inset-x-0 top-0 h-1 bg-[#71998A]"></span>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#718078]">إجمالي المساحة</span>
            <div class="kpi-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5EEE9] text-[#126B58]">
              <i class="pi pi-compass text-lg"></i>
            </div>
          </div>

          <div class="mt-5 text-3xl font-black tracking-tight text-[#293B36] tabular-nums">
            {{ formatCurrencyNumber(stats.totalArea) }}
          </div>

          <p class="mt-2 text-xs font-medium text-[#718078]">
            متر مربع (م²) مساحة الأراضي
          </p>

          <div class="mt-5 h-[37px] border-t border-[#E5E9E5] pt-4"></div>
        </div>

        <!-- Total Value -->
        <div class="dashboard-card kpi-card group relative isolate overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
          <span class="absolute inset-x-0 top-0 h-1 bg-[#B89A68]"></span>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#718078]">القيمة الإجمالية</span>
            <div class="kpi-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F1E8] text-[#B89A68]">
              <i class="pi pi-wallet text-lg"></i>
            </div>
          </div>

          <div class="mt-5 text-2xl font-black tracking-tight text-[#293B36] tabular-nums sm:text-3xl">
            {{ formatCurrencyNumber(stats.totalLandValue) }}
          </div>

          <p class="mt-2 text-xs font-medium text-[#718078]">
            ريال سعودي (صافي الأراضي)
          </p>

          <div class="mt-5 h-[37px] border-t border-[#E5E9E5] pt-4"></div>
        </div>

        <!-- Average Price -->
        <div class="dashboard-card kpi-card group relative isolate overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
          <span class="absolute inset-x-0 top-0 h-1 bg-[#174A40]"></span>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#718078]">متوسط سعر المتر</span>
            <div class="kpi-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5EEE9] text-[#126B58]">
              <i class="pi pi-chart-line text-lg"></i>
            </div>
          </div>

          <div class="mt-5 text-3xl font-black tracking-tight text-[#293B36] tabular-nums">
            {{ formatCurrencyNumber(stats.averagePricePerM2) }}
          </div>

          <p class="mt-2 text-xs font-medium text-[#718078]">
            ر.س / م² متوسط لكامل المخطط
          </p>

          <div class="mt-5 h-[37px] border-t border-[#E5E9E5] pt-4"></div>
        </div>
      </section>

      <!-- ================= SALES STATUS ================= -->
      <section class="dashboard-panel relative overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm sm:p-8">

        <div class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span class="inline-flex items-center gap-2 text-[11px] font-black tracking-wide text-[#126B58]">
              <span class="h-px w-6 bg-[#126B58]/50"></span>
              المبيعات
            </span>

            <h2 class="mt-2 text-xl font-black tracking-tight text-[#293B36] sm:text-2xl">
              حالة مبيعات المخطط
            </h2>

            <p class="mt-1.5 text-xs text-[#718078]">
              اضغط على أي تصنيف لتصفية القطع مباشرة
            </p>
          </div>

          <div class="hidden rounded-2xl border border-[#E5E9E5] bg-[#FAF9F5] px-5 py-3 text-center sm:block">
            <span class="block text-3xl font-black leading-none text-[#126B58] tabular-nums">
              {{ formatPercent(soldPercent) }}
            </span>
            <span class="mt-2 block text-[11px] font-semibold text-[#718078]">
              نسبة القطع المباعة
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">

          <!-- Sales Doughnut -->
          <div class="chart-surface relative mx-auto h-72 w-full max-w-sm">
            <canvas ref="statusCanvas"></canvas>

            <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-bold text-[#718078]">إجمالي القطع</span>
              <span class="mt-1.5 text-4xl font-black leading-none text-[#293B36] tabular-nums">
                {{ formatInteger(stats.totalPlots) }}
              </span>
              <span class="mt-3 inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-700">
                {{ formatInteger(stats.soldCount) }} مباعة
              </span>
            </div>
          </div>

          <!-- Sales Status Rows -->
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="s in statusCards"
              :key="s.status"
              :to="`/plots?status=${encodeURIComponent(s.status)}`"
              class="status-row group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#E5E9E5] bg-white p-4 ps-5 transition-all duration-300"
            >
              <span class="absolute inset-y-0 start-0 w-1.5" :style="{ backgroundColor: s.color }"></span>

              <div
                class="status-icon relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300"
                :style="{ backgroundColor: s.color + '18', color: s.color }"
              >
                <i :class="['pi text-lg', s.icon]"></i>
              </div>

              <div class="relative min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-black text-[#293B36]">{{ s.status }}</span>
                  <span
                    class="rounded-full px-2.5 py-1 text-[10px] font-black"
                    :style="{ backgroundColor: s.color + '15', color: s.color }"
                  >
                    {{ formatPercent(s.percent) }}
                  </span>
                </div>

                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-2xl font-black text-[#293B36] tabular-nums">
                    {{ formatInteger(s.count) }}
                  </span>
                  <span class="text-xs font-medium text-[#718078]">قطعة</span>
                </div>

                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E9E5]">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :style="{ width: Math.max(s.percent, 1.5) + '%', backgroundColor: s.color }"
                  ></div>
                </div>
              </div>

              <i class="relative pi pi-arrow-left text-[11px] text-slate-300 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#126B58]"></i>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ================= DETAILED ANALYTICS ================= -->
      <section class="space-y-6">

        <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span class="inline-flex items-center gap-2 text-[11px] font-black tracking-wide text-[#126B58]">
              <span class="h-px w-6 bg-[#126B58]/50"></span>
              التحليلات التفصيلية
            </span>

            <h2 class="mt-2 text-2xl font-black tracking-tight text-[#293B36] sm:text-3xl">
              التحليل حسب نوع الاستخدام والحالة
            </h2>

            <p class="mt-2 text-xs text-[#718078]">
              تحليل تفصيلي للمساحات والقيم ومتوسط الأسعار
            </p>
          </div>

          <!-- Chart Toolbar -->
          <div class="flex flex-col gap-3 rounded-2xl border border-[#E5E9E5] bg-white p-3 shadow-sm">

            <!-- Status Filters -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-full text-[10px] font-black text-[#718078] sm:w-auto">
                تصفية الحالات:
              </span>

              <button
                v-for="st in STATUSES"
                :key="st"
                type="button"
                @click="toggleStatus(st)"
                :aria-pressed="!hidden[st]"
                class="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-all duration-200"
                :class="hidden[st]
                  ? 'border-slate-200 bg-slate-50 text-slate-400'
                  : 'text-[#293B36] shadow-sm'"
                :style="hidden[st]
                  ? {}
                  : {
                      backgroundColor: STATUS_COLORS[st] + '12',
                      borderColor: STATUS_COLORS[st] + '50'
                    }"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: hidden[st] ? '#cbd5e1' : STATUS_COLORS[st] }"
                ></span>

                <span>{{ st }}</span>

                <span class="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-[#718078]">
                  {{ formatInteger(statusCount(st)) }}
                </span>
              </button>
            </div>

            <div class="h-px bg-[#E5E9E5]"></div>

            <!-- Chart Mode -->
            <div class="flex flex-wrap items-center justify-between gap-3">
              <span class="text-[10px] font-black text-[#718078]">
                طريقة عرض البيانات:
              </span>

              <div class="inline-flex items-center rounded-xl bg-[#F5F1E8] p-1">
                <button
                  v-for="m in modeOptions"
                  :key="String(m.value)"
                  type="button"
                  class="rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200"
                  :class="stackMode === m.value
                    ? 'bg-[#174A40] text-white shadow-sm'
                    : 'text-[#718078] hover:bg-white hover:text-[#126B58]'"
                  @click="stackMode = m.value"
                >
                  {{ m.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <!-- Area Chart -->
          <div class="chart-card group rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
            <div class="mb-5 flex flex-col items-center justify-center gap-2 text-center">
              <div>
                <h3 class="text-base font-black text-[#174A40]">
                  المساحة حسب الاستخدام والحالة
                </h3>
                <p class="mt-1 text-xs font-medium text-[#718078]">
                  متر مربع (م²)
                </p>
              </div>

              <span class="rounded-full border border-[#126B58]/15 bg-[#E5EEE9] px-4 py-1.5 text-sm font-black text-[#126B58] tabular-nums">
                {{ compact(stats.totalArea) }} م²
              </span>
            </div>

            <div class="chart-surface h-72">
              <canvas ref="areaCanvas"></canvas>
            </div>
          </div>

          <!-- Value Chart -->
          <div class="chart-card group rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
            <div class="mb-5 flex flex-col items-center justify-center gap-2 text-center">
              <div>
                <h3 class="text-base font-black text-[#174A40]">
                  القيمة الإجمالية حسب الاستخدام والحالة
                </h3>
                <p class="mt-1 text-xs font-medium text-[#718078]">
                  ريال سعودي (ر.س)
                </p>
              </div>

              <span class="rounded-full border border-[#B89A68]/20 bg-[#F5F1E8] px-4 py-1.5 text-sm font-black text-[#9A7B4E] tabular-nums">
                {{ compact(stats.totalLandValue) }} ر.س
              </span>
            </div>

            <div class="chart-surface h-72">
              <canvas ref="valueCanvas"></canvas>
            </div>
          </div>

          <!-- Usage Distribution -->
          <div class="chart-card group rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
            <div class="mb-5 text-center">
              <h3 class="text-base font-black text-[#174A40]">
                توزيع المساحة حسب الاستخدام
              </h3>
              <p class="mt-1 text-xs font-medium text-[#718078]">
                النسبة من إجمالي مساحة المخطط
              </p>
            </div>

            <div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
              <div class="chart-surface relative mx-auto h-56 w-full max-w-[14rem]">
                <canvas ref="usageCanvas"></canvas>

                <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span class="text-xl font-black text-[#293B36] tabular-nums">
                    {{ compact(stats.totalArea) }}
                  </span>
                  <span class="mt-1 text-[10px] font-semibold text-[#718078]">
                    م² إجمالي
                  </span>
                </div>
              </div>

              <ul class="space-y-4">
                <li
                  v-for="u in usageRows"
                  :key="u.name"
                  class="rounded-xl border border-[#E5E9E5] bg-[#FAF9F5] p-3 transition-colors hover:bg-[#F5F1E8]"
                >
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="inline-flex items-center gap-2 font-bold text-[#293B36]">
                      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: u.color }"></span>
                      {{ u.name }}
                    </span>

                    <span class="font-black tabular-nums" :style="{ color: u.color }">
                      {{ formatPercent(u.percent) }}
                    </span>
                  </div>

                  <div class="mt-2 text-[10px] font-medium text-[#718078]">
                    {{ formatCurrencyNumber(u.area) }} م²
                  </div>

                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E9E5]">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :style="{ width: u.percent + '%', backgroundColor: u.color }"
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Average Price Chart -->
          <div class="chart-card group rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300">
            <div class="mb-5 flex flex-col items-center justify-center gap-2 text-center">
              <div>
                <h3 class="text-base font-black text-[#174A40]">
                  متوسط سعر المتر حسب الاستخدام والحالة
                </h3>
                <p class="mt-1 text-xs font-medium text-[#718078]">
                  ريال سعودي لكل متر مربع
                </p>
              </div>

              <span class="rounded-full border border-[#174A40]/15 bg-[#E5EEE9] px-4 py-1.5 text-sm font-black text-[#174A40] tabular-nums">
                {{ formatCurrencyNumber(stats.averagePricePerM2) }} ر.س
              </span>
            </div>

            <div class="chart-surface h-72">
              <canvas ref="priceCanvas"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= DETAILS TABLE ================= -->
      <details class="dashboard-panel group overflow-hidden rounded-3xl border border-[#E5E9E5] bg-white shadow-sm">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-6 transition-colors duration-200 hover:bg-[#FAF9F5]">
          <div>
            <h2 class="text-base font-black text-[#293B36] sm:text-lg">
              جدول التفاصيل (تقرير الاستخدام × الحالة)
            </h2>

            <p class="mt-1.5 text-xs text-[#718078]">
              مطابق للتقرير الرسمي — آخر مزامنة: {{ stats.lastUpdated }}
            </p>
          </div>

          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5EEE9] text-[#126B58] transition-all duration-300 group-open:rotate-180 group-open:bg-[#126B58] group-open:text-white">
            <i class="pi pi-chevron-down text-xs"></i>
          </span>
        </summary>

        <div class="overflow-x-auto border-t border-[#E5E9E5]">
          <table class="w-full min-w-[850px] border-collapse text-center text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-[#E5E9E5] bg-[#FAF9F5] font-black text-[#293B36]">
                <th class="px-4 py-4 text-start">الاستخدام</th>
                <th class="px-4 py-4">حالة البيع</th>
                <th class="px-4 py-4">عدد القطع</th>
                <th class="px-4 py-4">المساحة الإجمالية (م²)</th>
                <th class="px-4 py-4">متوسط سعر المتر (ر.س)</th>
                <th class="px-4 py-4">القيمة الإجمالية (ر.س)</th>
                <th class="px-4 py-4">النسبة من المساحة</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-[#E5E9E5]">
              <tr
                v-for="(row, idx) in stats.matrix"
                :key="idx"
                class="cursor-pointer transition-colors duration-200 hover:bg-[#E5EEE9]/50"
                @click="navigateTo(`/plots?usage=${encodeURIComponent(row.usage)}&status=${encodeURIComponent(row.status)}`)"
              >
                <td class="px-4 py-4 text-start font-bold text-[#293B36]">
                  {{ row.usage }}
                </td>

                <td class="px-4 py-4">
                  <PlotsStatusBadge :status="row.status" />
                </td>

                <td class="px-4 py-4 font-bold tabular-nums">
                  {{ formatInteger(row.count) }}
                </td>

                <td class="px-4 py-4 tabular-nums">
                  {{ formatCurrencyNumber(row.area) }}
                </td>

                <td class="px-4 py-4 text-[#718078] tabular-nums">
                  {{ formatCurrencyNumber(row.avgPrice) }}
                </td>

                <td class="px-4 py-4 font-black text-[#126B58] tabular-nums">
                  {{ formatCurrencyNumber(row.value) }}
                </td>

                <td class="px-4 py-4 font-black text-[#B89A68] tabular-nums">
                  {{ formatPercent(row.sharePercent) }}
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr class="border-t-2 border-[#B89A68]/30 bg-[#F5F1E8] font-black text-[#174A40]">
                <td colspan="2" class="px-4 py-4 text-start">
                  المجموع الكلي للمخطط
                </td>

                <td class="px-4 py-4 tabular-nums">
                  {{ formatInteger(stats.totalPlots) }}
                </td>

                <td class="px-4 py-4 tabular-nums">
                  {{ formatCurrencyNumber(stats.totalArea) }} م²
                </td>

                <td class="px-4 py-4 tabular-nums">
                  {{ formatCurrencyNumber(stats.averagePricePerM2) }}
                </td>

                <td class="px-4 py-4 font-black text-[#126B58] tabular-nums">
                  {{ formatCurrencyNumber(stats.totalLandValue) }} ر.س
                </td>

                <td class="px-4 py-4 tabular-nums">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      <!-- ================= QUICK EXPLORATION ================= -->
      <section class="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <NuxtLink
          to="/blocks"
          class="shortcut-card group flex items-center justify-between gap-4 rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div class="shortcut-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5EEE9] text-lg text-[#126B58] transition-all duration-300">
              <i class="pi pi-objects-column"></i>
            </div>

            <div class="min-w-0">
              <h3 class="text-base font-black text-[#293B36] transition-colors group-hover:text-[#126B58]">
                استعراض البلوكات ({{ stats.blocksCount }} بلك)
              </h3>

              <p class="mt-1.5 text-xs leading-6 text-[#718078]">
                تصفح البلوكات كبطاقات مرئية مع نسب المبيعات وحالة كل قطعة
              </p>
            </div>
          </div>

          <i class="pi pi-arrow-left shrink-0 text-xs text-slate-300 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#126B58]"></i>
        </NuxtLink>

        <NuxtLink
          to="/zones"
          class="shortcut-card group flex items-center justify-between gap-4 rounded-3xl border border-[#E5E9E5] bg-white p-6 shadow-sm transition-all duration-300"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div class="shortcut-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F5F1E8] text-lg text-[#B89A68] transition-all duration-300">
              <i class="pi pi-map"></i>
            </div>

            <div class="min-w-0">
              <h3 class="text-base font-black text-[#293B36] transition-colors group-hover:text-[#B89A68]">
                استعراض الزونات ({{ stats.zonesCount }} زون)
              </h3>

              <p class="mt-1.5 text-xs leading-6 text-[#718078]">
                توزيع القطع حسب المناطق والزونات A1, A2, B1, B2
              </p>
            </div>
          </div>

          <i class="pi pi-arrow-left shrink-0 text-xs text-slate-300 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#B89A68]"></i>
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chart as ChartType } from 'chart.js';
import { projectConfig } from '../../config/project';
import {
  formatCurrencyNumber,
  formatInteger,
  formatPercent,
} from '../../../lib/format';
import type { PlotStatistics } from '../../../shared/types/plot';

/* ================= FETCH STATISTICS ================= */

const {
  data: statsResponse,
  pending,
  refresh,
} = await useFetch<{
  success: boolean;
  data: PlotStatistics;
}>('/api/stats');

const stats = computed(() => statsResponse.value?.data);

const refreshing = ref(false);

const refreshData = async () => {
  if (refreshing.value) return;

  refreshing.value = true;

  try {
    await refresh();
  } finally {
    refreshing.value = false;
  }
};

/* ================= CONSTANTS ================= */

const STATUSES = [
  'متاح للبيع',
  'محجوز',
  'مباع',
] as const;

const STATUS_COLORS: Record<string, string> = {
  'متاح للبيع': '#126B58',
  'محجوز': '#B89A68',
  'مباع': '#D9534F',
};

const usageColor = (name: string, i: number) => {
  if (name === 'سكنى') return '#126B58';
  if (name === 'تجارى') return '#B89A68';

  return [
    '#174A40',
    '#71998A',
    '#D8C5A0',
    '#0D5143',
  ][i % 4];
};

/* ================= STATUS FILTERS ================= */

const hidden = reactive<Record<string, boolean>>({});

const visibleStatuses = computed(() =>
  STATUSES.filter((s) => !hidden[s])
);

const isLastVisible = (st: string) =>
  !hidden[st] && visibleStatuses.value.length === 1;

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

/* ================= CHART MODE ================= */

const stackMode = ref<boolean>(true);

const modeOptions = [
  { value: true, label: 'مجمّع' },
  { value: false, label: 'متجاور' },
];

/* ================= SALES STATISTICS ================= */

const soldPercent = computed(() => {
  const s = stats.value;

  return s && s.totalPlots
    ? (s.soldCount / s.totalPlots) * 100
    : 0;
});

const statusCards = computed(() => {
  const s = stats.value;

  if (!s) return [];

  const total = s.totalPlots || 1;

  return [
    {
      status: 'متاح للبيع',
      count: s.availableCount,
      color: STATUS_COLORS['متاح للبيع'],
      percent: (s.availableCount / total) * 100,
      icon: 'pi-check-circle',
    },
    {
      status: 'محجوز',
      count: s.reservedCount,
      color: STATUS_COLORS['محجوز'],
      percent: (s.reservedCount / total) * 100,
      icon: 'pi-bookmark',
    },
    {
      status: 'مباع',
      count: s.soldCount,
      color: STATUS_COLORS['مباع'],
      percent: (s.soldCount / total) * 100,
      icon: 'pi-tag',
    },
  ];
});

/* ================= USAGE ANALYTICS ================= */

const usages = computed(() =>
  Array.from(
    new Set((stats.value?.matrix ?? []).map((r) => r.usage))
  )
);

const metricByUsageStatus = (
  metric: 'area' | 'value' | 'avgPrice' | 'count',
  status: string
) =>
  usages.value.map((u) => {
    const row = stats.value?.matrix.find(
      (r) => r.usage === u && r.status === status
    );

    return row ? Number(row[metric]) || 0 : 0;
  });

const areaByUsage = computed(() =>
  usages.value.map((u) =>
    (stats.value?.matrix ?? [])
      .filter((r) => r.usage === u)
      .reduce(
        (sum, r) => sum + (Number(r.area) || 0),
        0
      )
  )
);

const usageRows = computed(() => {
  const total =
    areaByUsage.value.reduce((a, b) => a + b, 0) || 1;

  return usages.value.map((name, i) => ({
    name,
    area: areaByUsage.value[i],
    percent: (areaByUsage.value[i] / total) * 100,
    color: usageColor(name, i),
  }));
});

const compact = (v: number | string) =>
  new Intl.NumberFormat('ar-SA', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(v));

/* ================= CHART CANVASES ================= */

const statusCanvas = ref<HTMLCanvasElement | null>(null);
const areaCanvas = ref<HTMLCanvasElement | null>(null);
const valueCanvas = ref<HTMLCanvasElement | null>(null);
const usageCanvas = ref<HTMLCanvasElement | null>(null);
const priceCanvas = ref<HTMLCanvasElement | null>(null);

let charts: ChartType[] = [];
let ChartCtor: typeof ChartType | null = null;
let buildToken = 0;

const destroyCharts = () => {
  charts.forEach((chart) => chart.destroy());
  charts = [];
};

/* ================= CHART BASE OPTIONS ================= */

const baseOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,

  animation: {
    duration: 650,
    easing: 'easeOutQuart' as const,
  },

  layout: {
    padding: {
      top: 12,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },

  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      align: 'center' as const,

      labels: {
        usePointStyle: true,
        pointStyle: 'circle' as const,
        boxWidth: 9,
        boxHeight: 9,
        padding: 20,
        color: '#293B36',

        font: {
          family: 'Tajawal, sans-serif',
          size: 11,
          weight: 'bold' as const,
        },
      },
    },

    tooltip: {
      rtl: true,
      textDirection: 'rtl' as const,
      backgroundColor: '#174A40',
      titleColor: '#D8C5A0',
      bodyColor: '#FFFFFF',
      borderColor: '#B89A68',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      boxPadding: 5,

      titleFont: {
        family: 'Tajawal, sans-serif',
        weight: 'bold' as const,
      },

      bodyFont: {
        family: 'Tajawal, sans-serif',
        weight: 'normal' as const,
      },
    },
  },
});

/* ================= BAR CHART ================= */

const makeBar = (
  canvas: HTMLCanvasElement,
  metric: 'area' | 'value' | 'avgPrice',
  stacked: boolean
) => {
  return new ChartCtor!(canvas, {
    type: 'bar',

    data: {
      labels: usages.value,

      datasets: visibleStatuses.value.map((s) => ({
        label: s,
        data: metricByUsageStatus(metric, s),
        backgroundColor: STATUS_COLORS[s],
        borderColor: STATUS_COLORS[s],
        borderWidth: 1,
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 48,
        categoryPercentage: 0.7,
        barPercentage: 0.85,
      })),
    },

    options: {
      ...baseOptions(),

      interaction: {
        mode: 'index',
        intersect: false,
      },

      scales: {
        x: {
          reverse: true,
          stacked,

          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: '#293B36',
            align: 'center',

            font: {
              family: 'Tajawal, sans-serif',
              size: 11,
              weight: 'bold',
            },

            padding: 10,
          },
        },

        y: {
          position: 'right',
          stacked,
          beginAtZero: true,

          grid: {
            color: 'rgba(113, 128, 120, 0.12)',
            drawBorder: false,
          },

          border: {
            display: false,
            dash: [4, 4],
          },

          ticks: {
            color: '#718078',
            align: 'center',
            padding: 10,

            font: {
              family: 'Tajawal, sans-serif',
              size: 10,
            },
          },
        },
      },
    } as any,
  });
};

/* ================= DOUGHNUT CHART ================= */

const makeDoughnut = (
  canvas: HTMLCanvasElement,
  labels: string[],
  data: number[],
  colors: string[],
  cutout: string,
  onClick?: (index: number) => void
) => {
  return new ChartCtor!(canvas, {
    type: 'doughnut',

    data: {
      labels,

      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
          borderRadius: 8,
          spacing: 3,
          hoverOffset: 7,
        },
      ],
    },

    options: {
      ...baseOptions(),

      cutout,

      onClick: onClick
        ? (_event: any, elements: any[]) => {
            if (elements.length) {
              onClick(elements[0].index);
            }
          }
        : undefined,
    } as any,
  });
};

/* ================= BUILD CHARTS ================= */

const buildCharts = async () => {
  if (!import.meta.client || !stats.value) return;

  const token = ++buildToken;

  await nextTick();

  if (!ChartCtor) {
    const mod = await import('chart.js/auto');
    ChartCtor = mod.Chart as unknown as typeof ChartType;
  }

  if (token !== buildToken) return;

  destroyCharts();

  const s = stats.value;

  /* Sales status doughnut */
  if (statusCanvas.value) {
    charts.push(
      makeDoughnut(
        statusCanvas.value,
        [...STATUSES],
        [
          s.availableCount,
          s.reservedCount,
          s.soldCount,
        ],
        STATUSES.map((st) => STATUS_COLORS[st]),
        '78%',
        (i) =>
          navigateTo(
            `/plots?status=${encodeURIComponent(STATUSES[i])}`
          )
      )
    );
  }

  /* Area chart */
  if (areaCanvas.value) {
    charts.push(
      makeBar(
        areaCanvas.value,
        'area',
        stackMode.value
      )
    );
  }

  /* Value chart */
  if (valueCanvas.value) {
    charts.push(
      makeBar(
        valueCanvas.value,
        'value',
        stackMode.value
      )
    );
  }

  /* Usage doughnut */
  if (usageCanvas.value) {
    charts.push(
      makeDoughnut(
        usageCanvas.value,
        usages.value,
        areaByUsage.value,
        usageRows.value.map((u) => u.color),
        '72%'
      )
    );
  }

  /* Average price chart: always grouped */
  if (priceCanvas.value) {
    charts.push(
      makeBar(
        priceCanvas.value,
        'avgPrice',
        false
      )
    );
  }
};

/* ================= LIFECYCLE ================= */

onMounted(buildCharts);

watch(
  [stats, stackMode, visibleStatuses],
  buildCharts
);

onBeforeUnmount(() => {
  buildToken++;
  destroyCharts();
});
</script>

<style scoped>
/* ================= DASHBOARD BASE ================= */

.dashboard-page {
  color: #293B36;

  --dashboard-primary: #126B58;
  --dashboard-forest: #174A40;
  --dashboard-hover: #0D5143;
  --dashboard-sage: #71998A;
  --dashboard-gold: #B89A68;
  --dashboard-border: #E5E9E5;
  --dashboard-muted: #718078;
}

.dashboard-page a,
.dashboard-page button,
.dashboard-page summary {
  -webkit-tap-highlight-color: transparent;
}

/* ================= HERO ================= */

.hero-banner {
  box-shadow:
    0 18px 45px rgb(23 74 64 / 12%),
    0 4px 12px rgb(23 74 64 / 6%);
}

.hero-primary-button:hover {
  background: linear-gradient(
    to bottom,
    #E7D8BA,
    #C5A979
  );
}

.hero-secondary-button:hover {
  box-shadow: 0 8px 22px rgb(255 255 255 / 10%);
}

/* ================= DASHBOARD CARDS ================= */

.dashboard-card,
.chart-card,
.shortcut-card,
.dashboard-panel {
  box-shadow: 0 2px 9px rgb(23 74 64 / 3%);
}

.dashboard-card:hover,
.chart-card:hover,
.shortcut-card:hover {
  border-color: rgb(18 107 88 / 30%);

  box-shadow:
    0 14px 30px rgb(23 74 64 / 8%),
    0 4px 10px rgb(23 74 64 / 4%);
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-icon {
  transition:
    transform 250ms ease,
    background-color 250ms ease,
    box-shadow 250ms ease;
}

.kpi-card:hover .kpi-icon {
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 6px 14px rgb(18 107 88 / 10%);
}

/* ================= STATUS ROWS ================= */

.status-row:hover {
  transform: translateY(-2px);
  border-color: rgb(18 107 88 / 30%);
  background-color: #FAF9F5;

  box-shadow:
    0 8px 20px rgb(23 74 64 / 6%);
}

.status-icon {
  transition:
    transform 250ms ease,
    box-shadow 250ms ease;
}

.status-row:hover .status-icon {
  transform: scale(1.07);
}

/* ================= CHARTS ================= */

.chart-card {
  transition:
    transform 250ms ease,
    border-color 250ms ease,
    box-shadow 250ms ease;
}

.chart-card:hover {
  transform: translateY(-3px);
}

.chart-surface {
  position: relative;
  width: 100%;
  min-width: 0;
}

.chart-surface canvas {
  display: block;
  max-width: 100%;
}

/* ================= SHORTCUTS ================= */

.shortcut-card:hover {
  transform: translateY(-4px);
  background-color: #FAF9F5;
}

.shortcut-icon {
  transition:
    transform 250ms ease,
    box-shadow 250ms ease;
}

.shortcut-card:hover .shortcut-icon {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 7px 16px rgb(18 107 88 / 10%);
}

/* ================= TABLE ================= */

.dashboard-page details summary {
  cursor: pointer;
}

.dashboard-page details summary::-webkit-details-marker {
  display: none;
}

.dashboard-page table tbody tr {
  transition: background-color 180ms ease;
}

.dashboard-page table tbody tr:hover {
  background-color: rgb(229 238 233 / 65%);
}

/* ================= FOCUS ACCESSIBILITY ================= */

.dashboard-page button:focus-visible,
.dashboard-page a:focus-visible,
.dashboard-page summary:focus-visible {
  outline: 3px solid rgb(18 107 88 / 30%);
  outline-offset: 3px;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 640px) {
  .dashboard-page {
    gap: 1.5rem;
  }

  .hero-banner {
    border-radius: 1.5rem;
  }

  .chart-card {
    padding: 1.125rem;
  }

  .chart-surface {
    overflow: hidden;
  }
}

/* ================= REDUCED MOTION ================= */

@media (prefers-reduced-motion: reduce) {
  .dashboard-page *,
  .dashboard-page *::before,
  .dashboard-page *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
