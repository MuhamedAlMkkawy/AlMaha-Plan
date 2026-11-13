
<template>
  <div dir="rtl" class="quotation-builder mx-auto w-full space-y-7 pb-10">

    <!-- ================= HEADER ================= -->
    <header class="relative overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm print:hidden">
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#7030A0] via-violet-500 to-purple-200"></div>

      <div class="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7030A0] to-[#512078] text-white shadow-lg shadow-purple-900/20">
            <i class="pi pi-file-edit text-2xl"></i>
          </div>

          <div class="min-w-0">
            <div class="mb-1 flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-extrabold tracking-widest text-[#7030A0]">
                QUOTATION BUILDER
              </span>
              <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <i class="pi pi-check-circle ms-1"></i>
                نظام العروض
              </span>
            </div>

            <h1 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              صانع عروض الأسعار التفاعلي
            </h1>

            <p class="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
              أنشئ عرض سعر احترافي ومخصص لعملائك، مع إمكانية اختيار حتى 10 قطع أراضي وتعديل سعر المتر لكل قطعة بشكل مستقل.
            </p>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <button
            @click="handlePrint"
            :disabled="quotationItems.length === 0"
            class="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7030A0] px-5 text-xs font-extrabold !text-white shadow-lg shadow-purple-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#592581] hover:!text-white hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:text-sm"
          >
            <i class="pi pi-print text-sm text-white transition-transform group-hover:scale-110"></i>
            <span class="text-white">طباعة / حفظ PDF</span>
          </button>

          <button
            @click="resetForm"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50 hover:!text-rose-700 sm:text-sm"
          >
            <i class="pi pi-refresh text-xs"></i>
            إعادة ضبط
          </button>
        </div>
      </div>

      <!-- Header Statistics -->
      <div class="grid grid-cols-2 border-t border-slate-100 bg-slate-50/70 sm:grid-cols-3">
        <div class="border-l border-slate-100 px-5 py-3.5">
          <p class="text-[10px] font-bold text-slate-400">القطع المختارة</p>
          <p class="mt-1 text-lg font-black text-slate-800">
            {{ selectedPlotsList.length }}
            <span class="text-xs font-semibold text-slate-400">/ 10</span>
          </p>
        </div>

        <div class="border-l border-slate-100 px-5 py-3.5">
          <p class="text-[10px] font-bold text-slate-400">إجمالي المساحة</p>
          <p class="mt-1 text-lg font-black text-slate-800">
            {{ formatCurrencyNumber(totalArea) }}
            <span class="text-xs font-semibold text-slate-400">م²</span>
          </p>
        </div>

        <div class="col-span-2 px-5 py-3.5 sm:col-span-1">
          <p class="text-[10px] font-bold text-slate-400">حالة العرض</p>
          <p class="mt-1 flex items-center gap-2 text-sm font-extrabold">
            <span
              class="h-2 w-2 rounded-full"
              :class="quotationItems.length ? 'bg-emerald-500' : 'bg-slate-300'"
            ></span>
            <span :class="quotationItems.length ? 'text-emerald-700' : 'text-slate-500'">
              {{ quotationItems.length ? 'جاهز للمعاينة' : 'بانتظار إضافة القطع' }}
            </span>
          </p>
        </div>
      </div>
    </header>

    <!-- ================= BUILDER FORM ================= -->
    <section class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm print:hidden">

      <!-- Section Heading -->
      <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#7030A0]">
            <i class="pi pi-user-edit text-lg"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-sm font-black text-slate-900 sm:text-base">
              بيانات العميل والقطع المختارة
            </h2>
            <p class="mt-1 text-[10px] font-medium text-slate-400 sm:text-xs">
              أدخل بيانات العميل وحدد الأراضي المراد تضمينها
            </p>
          </div>
        </div>

        <span class="hidden shrink-0 rounded-lg border border-purple-100 bg-purple-50 px-3 py-1.5 text-[10px] font-extrabold text-[#7030A0] sm:inline-flex">
          <i class="pi pi-sliders-h ms-1"></i>
          إعداد العرض
        </span>
      </div>

      <div class="space-y-7 p-5 sm:p-7">


<!-- ================= BUYER INFORMATION ================= -->
<div>
  <div class="mb-4 flex items-center gap-2">
    <span class="h-5 w-1 rounded-full bg-[#7030A0]"></span>
    <h3 class="text-xs font-extrabold text-slate-800">
      معلومات المشتري
    </h3>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

    <!-- Buyer Name -->
    <div class="min-w-0 space-y-2">
      <label
        for="buyer-name"
        class="block text-xs font-bold text-slate-600"
      >
        اسم المشتري / العميل
      </label>

      <div
        class="flex h-12 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 hover:border-purple-300 hover:bg-white focus-within:border-[#7030A0] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100"
      >
        <!-- Icon -->
        <div class="flex h-full w-12 shrink-0 items-center justify-center border-l border-slate-100 bg-slate-100/70 text-slate-400 transition-colors duration-200 group-focus-within:text-[#7030A0]">
          <i class="pi pi-user text-sm"></i>
        </div>

        <!-- Input -->
        <input
          id="buyer-name"
          v-model="buyerName"
          type="text"
          placeholder="مثال: شركة النخبة للاستثمار"
          autocomplete="name"
          class="h-full min-w-0 w-full flex-1 border-0 bg-transparent px-4 text-right text-sm font-semibold text-slate-800 outline-none ring-0 placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>

    <!-- Buyer Phone -->
    <div class="min-w-0 space-y-2">
      <label
        for="buyer-phone"
        class="block text-xs font-bold text-slate-600"
      >
        رقم الجوال
      </label>

      <div
        class="flex h-12 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 hover:border-purple-300 hover:bg-white focus-within:border-[#7030A0] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100"
      >
        <!-- Icon -->
        <div class="flex h-full w-12 shrink-0 items-center justify-center border-l border-slate-100 bg-slate-100/70 text-slate-400">
          <i class="pi pi-phone text-sm"></i>
        </div>

        <!-- Input -->
        <input
          id="buyer-phone"
          v-model="buyerPhone"
          type="tel"
          inputmode="tel"
          placeholder="05XXXXXXXX"
          autocomplete="tel"
          dir="ltr"
          class="h-full min-w-0 w-full flex-1 border-0 bg-transparent px-4 text-left text-sm font-semibold text-slate-800 outline-none ring-0 placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>

  </div>
</div>

<!-- ================= PLOT SEARCH ================= -->
<div>
  <div class="mb-4 flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <span class="h-5 w-1 rounded-full bg-[#7030A0]"></span>
      <h3 class="text-xs font-extrabold text-slate-800">
        إضافة قطع الأراضي
      </h3>
    </div>

    <span class="text-[10px] font-bold text-slate-400">
      الحد الأقصى 10 قطع
    </span>
  </div>

  <div class="rounded-2xl border border-purple-100 bg-gradient-to-l from-purple-50/80 to-white p-4 sm:p-5">

    <div class="flex flex-col gap-3 sm:flex-row">

      <!-- Plot Number Input -->
      <div class="min-w-0 flex-1">
        <div
          class="group flex h-12 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-purple-300 focus-within:border-[#7030A0] focus-within:ring-4 focus-within:ring-purple-100"
        >
          <!-- Icon -->
          <div class="flex h-full w-12 shrink-0 items-center justify-center border-l border-slate-100 bg-slate-50 text-slate-400 transition-colors duration-200 group-focus-within:text-[#7030A0]">
            <i class="pi pi-search text-sm"></i>
          </div>

          <!-- Input -->
          <input
            v-model="plotSearchInput"
            @keyup.enter="addPlotByNumber"
            type="number"
            min="1"
            max="973"
            placeholder="أدخل رقم القطعة (1 - 973)"
            class="h-full min-w-0 w-full flex-1 border-0 bg-transparent px-4 text-right text-sm font-semibold text-slate-800 outline-none ring-0 placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <!-- Add Button -->
      <button
        @click="addPlotByNumber"
        :disabled="selectedPlotsList.length >= 10"
        class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#7030A0] bg-[#7030A0] px-6 text-sm font-extrabold text-white shadow-md shadow-purple-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#592581] hover:bg-[#592581] hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-[#7030A0] sm:min-w-40"
      >
        <i class="pi pi-plus-circle text-white"></i>
        <span class="whitespace-nowrap text-white">
          إضافة القطعة
        </span>
      </button>

    </div>

    <!-- Helper Information -->
    <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
      <p class="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
        <i class="pi pi-info-circle"></i>
        أدخل رقم الأرض لإضافتها مباشرة إلى العرض
      </p>

      <span class="shrink-0 text-[10px] font-bold text-[#7030A0]">
        {{ selectedPlotsList.length }} / 10
      </span>
    </div>

    <!-- Error Message -->
    <div
      v-if="addError"
      class="mt-3 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-600"
    >
      <i class="pi pi-exclamation-circle shrink-0"></i>
      <span>{{ addError }}</span>
    </div>

  </div>
</div>


        <!-- Selected Plots -->
        <div>
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="h-5 w-1 rounded-full bg-[#7030A0]"></span>
              <h3 class="text-xs font-extrabold text-slate-800">
                القطع المدرجة في العرض
              </h3>
              <span class="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-extrabold text-[#7030A0]">
                {{ selectedPlotsList.length }}
              </span>
            </div>
          </div>

          <!-- Table -->
          <div
            v-if="selectedPlotsList.length > 0"
            class="overflow-hidden rounded-2xl border border-slate-200"
          >
            <div class="overflow-x-auto">
              <table class="w-full min-w-[950px] border-collapse text-center text-xs sm:text-sm">
                <thead>
                  <tr class="bg-slate-50 text-[10px] font-extrabold text-slate-500">
                    <th class="border-b border-slate-200 px-4 py-4">رقم القطعة</th>
                    <th class="border-b border-slate-200 px-4 py-4">البلك</th>
                    <th class="border-b border-slate-200 px-4 py-4">المساحة</th>
                    <th class="border-b border-slate-200 px-4 py-4">سعر المتر المخصص</th>
                    <th class="border-b border-slate-200 px-4 py-4">قيمة الأرض</th>
                    <th class="border-b border-slate-200 px-4 py-4">السعي (15% ضريبة)</th>
                    <th class="border-b border-slate-200 px-4 py-4">التصرفات (5%)</th>
                    <th class="border-b border-slate-200 px-4 py-4">إجراء</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(p, idx) in selectedPlotsList"
                    :key="p.plotNo"
                    class="group transition-colors duration-200 hover:bg-purple-50/50"
                  >
                    <td class="px-4 py-4">
                      <span class="inline-flex min-w-10 items-center justify-center rounded-lg bg-purple-50 px-2.5 py-2 font-black text-[#7030A0] transition-colors group-hover:bg-purple-100">
                        {{ p.plotNo }}
                      </span>
                    </td>

                    <td class="px-4 py-4 font-bold text-slate-700">
                      {{ p.block }}
                    </td>

                    <td class="px-4 py-4 font-semibold tabular-nums text-slate-600">
                      {{ formatCurrencyNumber(p.area) }}
                      <span class="text-[10px] text-slate-400">م²</span>
                    </td>

                    <td class="px-4 py-4">
                      <input
                        v-model.number="p.pricePerM2"
                        type="number"
                        min="0"
                        step="10"
                        class="h-10 w-28 rounded-lg border border-purple-200 bg-purple-50/60 px-2 text-center font-black tabular-nums text-[#7030A0] outline-none transition-all duration-200 hover:border-[#7030A0] hover:bg-white focus:border-[#7030A0] focus:bg-white focus:ring-4 focus:ring-purple-100"
                      />
                    </td>

                    <td class="px-4 py-4 font-black tabular-nums text-slate-900">
                      {{ formatCurrencyNumber(p.area * p.pricePerM2) }}
                    </td>

                    <td class="px-4 py-4 font-bold tabular-nums text-slate-600">
                      {{ formatCurrencyNumber(p.area * p.pricePerM2 * 0.025 * 1.15) }}
                    </td>

                    <td class="px-4 py-4 font-bold tabular-nums text-slate-600">
                      {{ formatCurrencyNumber(p.area * p.pricePerM2 * 0.05) }}
                    </td>

                    <td class="px-4 py-4">
                      <button
                        @click="removePlot(idx)"
                        title="حذف القطعة"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-400 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50 hover:!text-rose-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
                      >
                        <i class="pi pi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
              <span class="text-[10px] font-semibold text-slate-500">
                <i class="pi pi-info-circle ms-1 text-[#7030A0]"></i>
                يمكنك تعديل سعر المتر لكل قطعة بشكل مستقل
              </span>

              <span class="text-[10px] font-extrabold text-[#7030A0]">
                {{ selectedPlotsList.length }} قطع مختارة
              </span>
            </div>
          </div>

          <!-- Empty Table State -->
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center"
          >
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#7030A0]">
              <i class="pi pi-map text-xl"></i>
            </div>

            <p class="text-xs font-extrabold text-slate-700">
              لم تتم إضافة أي قطعة بعد
            </p>

            <p class="mt-1 text-[10px] text-slate-400">
              استخدم حقل البحث أعلاه لإضافة أول قطعة إلى العرض
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= QUOTATION PREVIEW ================= -->
    <section v-if="quotationItems.length > 0" class="space-y-4">

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <i class="pi pi-file-check text-lg"></i>
          </div>

          <div>
            <h2 class="text-sm font-black text-slate-900 sm:text-base">
              معاينة عرض السعر
            </h2>
            <p class="mt-1 text-[10px] font-medium text-slate-400">
              النموذج النهائي المعتمد للطباعة والتصدير
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:self-auto">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          <span class="text-[10px] font-extrabold text-emerald-700">
            معاينة مباشرة
          </span>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-100/70 p-2 sm:p-5 print:border-0 print:bg-white print:p-0">
        <PlotsQuotationView
          :items="quotationItems"
          :buyer-name="buyerName"
          :buyer-phone="buyerPhone"
        />
      </div>
    </section>


      <!-- ================= EMPTY STATE ================= -->
      <section
        v-else
        class="relative isolate print:hidden overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-5 py-14 shadow-sm sm:px-8 sm:py-16"
      >
        <!-- Background decoration -->
        <div
          class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#7030A0]/[0.06] blur-3xl"
        ></div>

        <div
          class="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl"
        ></div>

        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7030A0]/30 to-transparent"
        ></div>

        <div class="relative mx-auto flex max-w-lg flex-col items-center text-center">

          <!-- Icon -->
          <div class="relative mb-7">
            <div
              class="absolute -inset-4 rounded-[2rem] bg-[#7030A0]/[0.07] blur-xl"
            ></div>

            <div
              class="relative flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-[#7030A0]/10 bg-gradient-to-br from-white via-purple-50 to-violet-100 text-[#7030A0] shadow-[0_10px_35px_rgba(112,48,160,0.12)]"
            >
              <i class="pi pi-file-edit text-[2.4rem]"></i>

              <span
                class="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-[3px] border-white bg-[#7030A0] text-white shadow-md"
              >
                <i class="pi pi-plus text-xs"></i>
              </span>
            </div>
          </div>

          <!-- Label -->
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7030A0]/10 bg-purple-50/80 px-3.5 py-1.5"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-[#7030A0]"></span>
            <span class="text-[10px] font-black tracking-[0.12em] text-[#7030A0]">
              QUOTATION PREVIEW
            </span>
          </div>

          <!-- Heading -->
          <h3 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            عرض السعر يبدأ من هنا
          </h3>

          <!-- Description -->
          <p
            class="mt-3 max-w-md text-xs font-medium leading-8 text-slate-500 sm:text-sm"
          >
            لم تتم إضافة أي قطع إلى عرض السعر حتى الآن. ابدأ باختيار القطع من الجدول
            لإنشاء عرض سعر منظم واحترافي وجاهز للطباعة.
          </p>

          <!-- Button -->
          <NuxtLink
            to="/plots"
            class="group relative mt-8 inline-flex h-12 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#7030A0] px-6 text-sm font-extrabold !text-white shadow-lg shadow-[#7030A0]/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#592581] hover:!text-white hover:shadow-xl hover:shadow-[#7030A0]/25 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7030A0]/20"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 transition-colors duration-300 group-hover:bg-white/25"
            >
              <i class="pi pi-table text-sm !text-white"></i>
            </span>

            <span class="!text-white">الذهاب إلى جدول القطع</span>

            <i
              class="pi pi-arrow-left text-[10px] !text-white transition-transform duration-300 group-hover:-translate-x-1"
            ></i>
          </NuxtLink>

          <!-- Supporting note -->
          <div class="mt-5 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
            <i class="pi pi-info-circle text-xs text-[#7030A0]/60"></i>
            <span>يمكنك إضافة عدة قطع إلى عرض سعر واحد</span>
          </div>
        </div>
      </section>


  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { PublicPlot } from '../../shared/types/plot';

const route = useRoute();

interface EditableQuotationPlot {
  plotNo: number;
  block: number;
  area: number;
  pricePerM2: number;
}

const buyerName = ref('');
const buyerPhone = ref('');
const plotSearchInput = ref<number | null>(null);
const addError = ref('');

const selectedPlotsList = ref<EditableQuotationPlot[]>([]);

// Preload all plots to allow quick lookup by plot number
const { data: allPlotsResponse } = await useFetch<{
  success: boolean;
  data: PublicPlot[];
}>('/api/plots');

const allPlots = computed(() => allPlotsResponse.value?.data || []);

// Total selected plot area
const totalArea = computed(() => {
  return selectedPlotsList.value.reduce(
    (sum, plot) => sum + plot.area,
    0
  );
});

// Preload selected plots from query parameters
onMounted(() => {
  const plotsQuery = route.query.plots;

  if (!plotsQuery || typeof plotsQuery !== 'string') return;

  const ids = plotsQuery
    .split(',')
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);

  for (const id of ids) {
    if (selectedPlotsList.value.length >= 10) break;

    const alreadyAdded = selectedPlotsList.value.some(
      (p) => p.plotNo === id
    );

    if (alreadyAdded) continue;

    const match = allPlots.value.find(
      (p) => p.plotNo === id
    );

    if (match) {
      selectedPlotsList.value.push({
        plotNo: match.plotNo,
        block: match.block,
        area: match.area,
        pricePerM2: match.pricePerM2,
      });
    }
  }
});

// Add plot by number
const addPlotByNumber = () => {
  addError.value = '';

  const plotNo = Number(plotSearchInput.value);

  if (!plotSearchInput.value || !Number.isInteger(plotNo) || plotNo <= 0) {
    addError.value = 'يرجى إدخال رقم قطعة صحيح';
    return;
  }

  if (selectedPlotsList.value.length >= 10) {
    addError.value = 'الحد الأقصى لعدد القطع في عرض السعر الواحد هو 10 قطع';
    return;
  }

  if (selectedPlotsList.value.some((p) => p.plotNo === plotNo)) {
    addError.value = `القطعة رقم ${plotNo} مضافة مسبقاً في العرض`;
    return;
  }

  const match = allPlots.value.find(
    (p) => p.plotNo === plotNo
  );

  if (!match) {
    addError.value = `تعذر العثور على القطعة رقم ${plotNo}`;
    return;
  }

  selectedPlotsList.value.push({
    plotNo: match.plotNo,
    block: match.block,
    area: match.area,
    pricePerM2: match.pricePerM2,
  });

  plotSearchInput.value = null;
};

// Remove plot
const removePlot = (index: number) => {
  selectedPlotsList.value.splice(index, 1);
  addError.value = '';
};

// Reset form
const resetForm = () => {
  buyerName.value = '';
  buyerPhone.value = '';
  plotSearchInput.value = null;
  selectedPlotsList.value = [];
  addError.value = '';
};

// Generate quotation items
const quotationItems = computed(() => {
  return selectedPlotsList.value.map((p) => {
    const landValue = Math.round(
      p.area * p.pricePerM2 * 100
    ) / 100;

    const brokerage = Math.round(
      landValue * 0.025 * 1.15 * 100
    ) / 100;

    const retTax = Math.round(
      landValue * 0.05 * 100
    ) / 100;

    return {
      block: p.block,
      plotNo: p.plotNo,
      area: p.area,
      pricePerM2: p.pricePerM2,
      landValue,
      brokerage,
      retTax,
    };
  });
});

// Print quotation
const handlePrint = () => {
  if (quotationItems.value.length === 0) return;

  window.print();
};
</script>

<style scoped>
/* ================= INPUTS ================= */

.quotation-builder input {
  min-width: 0;
  max-width: 100%;
  color: #1e293b;
  -webkit-appearance: none;
  appearance: none;
}

.quotation-builder input::placeholder {
  color: #94a3b8;
  opacity: 1;
}

.quotation-builder input:focus {
  outline: none;
}

/* Prevent input icons from overlapping text */
.quotation-builder .group > i {
  pointer-events: none;
  user-select: none;
}

/* Number input appearance */
.quotation-builder input[type="number"] {
  font-variant-numeric: tabular-nums;
}

/* ================= BUTTONS ================= */

.quotation-builder button {
  -webkit-tap-highlight-color: transparent;
  overflow-wrap: normal;
}

.quotation-builder button:focus-visible {
  outline: 2px solid #7030a0;
  outline-offset: 3px;
}

.quotation-builder button:disabled {
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Preserve white text on primary buttons */
.quotation-builder button.bg-\[\#7030A0\],
.quotation-builder button.bg-\[\#7030A0\] span {
  color: #fff;
}

/* ================= TEXT ================= */

.quotation-builder h1,
.quotation-builder h2,
.quotation-builder h3,
.quotation-builder p {
  overflow-wrap: anywhere;
}

/* ================= TABLE ================= */

.quotation-builder table {
  border-spacing: 0;
}

.quotation-builder th,
.quotation-builder td {
  white-space: nowrap;
}

/* ================= PRINT ================= */

@media print {
  .quotation-builder {
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
  }

  .quotation-builder button,
  .quotation-builder input {
    box-shadow: none;
  }
}
</style>
