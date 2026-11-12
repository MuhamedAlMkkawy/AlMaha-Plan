<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <header class="space-y-4">
      <NuxtLink
        to="/admin/plots"
        class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#7030A0] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
      >
        <i class="pi pi-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300 motion-reduce:transition-none"></i>
        <span>العودة للجدول</span>
      </NuxtLink>

      <div class="flex items-center gap-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#7030A0] text-white flex items-center justify-center shrink-0">
          <span class="text-2xl sm:text-3xl font-black">{{ plotNo }}</span>
        </div>
        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900">تعديل بيانات قطعة رقم {{ plotNo }}</h1>
          <!-- <p class="mt-1 text-sm sm:text-base text-slate-500">
            يتم تحديث خلايا الإدخال فقط، وتبقى صيغ الإكسل الأصلية (G, H, T) محمية.
          </p> -->
        </div>
      </div>
    </header>

    <!-- Error -->
    <div
      v-if="errorMsg"
      role="alert"
      class="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-base font-semibold"
    >
      <i class="pi pi-exclamation-circle mt-1"></i>
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] gap-6" aria-busy="true">
      <div class="h-[32rem] rounded-2xl bg-slate-100 animate-pulse"></div>
      <div class="h-96 rounded-2xl bg-slate-100 animate-pulse"></div>
    </div>

    <!-- Form + live calculations (full width) -->
    <div
      v-else-if="plot"
      class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] gap-6 items-start"
    >
      <form
        @submit.prevent="handleSubmit"
        class="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden"
      >
        <!-- Basic data -->
        <section class="p-5 sm:p-7 space-y-5">
          <h2 class="flex items-center justify-between gap-3 text-lg font-bold text-slate-900">
            <span class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-[3px] bg-amber-400"></span>
              البيانات الأساسية
            </span>
            <span class="text-sm font-normal text-slate-500">سطر الشيت: {{ plot.rowNumber || 'تلقائي' }}</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <label :class="labelCls">رقم القطعة (ثابت)</label>
              <input :value="plot.plotNo" disabled :class="[inputCls, 'bg-slate-100 text-slate-500 cursor-not-allowed']" />
            </div>
            <div>
              <label :class="labelCls">رقم البلك *</label>
              <input v-model.number="form.block" type="number" required :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">الزون</label>
              <select v-model="form.zone" :class="inputCls">
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="غير محدد">غير محدد</option>
              </select>
            </div>
            <div>
              <label :class="labelCls">الاستخدام *</label>
              <select v-model="form.usage" :class="inputCls">
                <option value="سكنى">سكنى</option>
                <option value="تجارى">تجارى</option>
                <option value="مرافق">مرافق</option>
              </select>
            </div>
            <div>
              <label :class="labelCls">المساحة (م²) *</label>
              <input v-model.number="form.area" type="number" step="0.01" required :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">سعر المتر (ر.س) *</label>
              <input v-model.number="form.pricePerM2" type="number" step="1" required :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">حالة البيع</label>
              <select v-model="form.status" :class="inputCls">
                <option value="متاح للبيع">متاح للبيع</option>
                <option value="محجوز">محجوز</option>
                <option value="مباع">مباع</option>
                <option value="مؤرشف">مؤرشف</option>
              </select>
            </div>
            <div>
              <label :class="labelCls">حالة السعي</label>
              <select v-model="form.brokerageStatus" :class="inputCls">
                <option value="كامل السعي">كامل السعي</option>
                <option value="لايوجد">لايوجد</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Buyer + deed -->
        <section class="p-5 sm:p-7 space-y-5">
          <h2 class="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <span class="w-2.5 h-2.5 rounded-[3px] bg-amber-400"></span>
            بيانات المشتري والصك
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label :class="labelCls">اسم المشتري</label>
              <input v-model="form.buyerName" type="text" :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">رقم الجوال</label>
              <input v-model="form.buyerPhone" type="text" inputmode="tel" dir="ltr" :class="[inputCls, 'text-end']" />
            </div>
            <div>
              <label :class="labelCls">الهوية / السجل</label>
              <input v-model="form.buyerId" type="text" :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">رقم صك القطعة</label>
              <input v-model="form.deedNo" type="text" dir="ltr" :class="[inputCls, 'text-end']" />
            </div>
            <div>
              <label :class="labelCls">تاريخ الصك</label>
              <input v-model="form.deedDate" type="text" :class="inputCls" />
            </div>
            <div>
              <label :class="labelCls">الفاتورة الضريبية</label>
              <input v-model="form.invoice" type="text" :class="inputCls" />
            </div>
          </div>

          <div>
            <label :class="labelCls">ملاحظات إضافية</label>
            <textarea v-model="form.notes" rows="3" :class="[inputCls, 'h-auto py-2.5 leading-relaxed']"></textarea>
          </div>
        </section>

        <!-- Actions -->
        <div class="px-5 sm:px-7 py-4 bg-slate-50 flex items-center justify-end gap-2">
          <NuxtLink
            to="/admin/plots"
            class="h-11 px-5 inline-flex items-center rounded-full text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
          >
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving"
            class="h-11 px-7 inline-flex items-center gap-2 rounded-full bg-[#7030A0] text-white text-base font-bold transition-colors hover:bg-[#5b2486] disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-2"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
            <span>{{ saving ? 'جاري الحفظ في الشيت...' : 'حفظ التعديلات' }}</span>
          </button>
        </div>
      </form>

      <!-- Live calculations with their equations -->
      <aside class="lg:sticky lg:top-24 rounded-2xl bg-white border border-slate-200 border-t-[3px] border-t-[#7030A0] p-5 sm:p-6">
        <h3 class="text-lg font-bold text-slate-900">معاينة الحسابات</h3>
        <p class="mt-1 text-sm text-slate-500">تتحدّث الأرقام والمعادلات تلقائيًا أثناء التعديل.</p>

        <ol class="mt-5 divide-y divide-slate-100">
          <li v-for="row in calcRows" :key="row.key" class="py-4 first:pt-0">
            <div class="flex items-center justify-between gap-3">
              <span class="text-base text-slate-700 font-semibold">{{ row.label }}</span>
              <span class="text-lg font-black text-slate-900">{{ formatCurrency(row.value) }}</span>
            </div>
            <div v-if="row.formula" class="mt-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-relaxed">
              <div class="text-slate-500">{{ row.formula }}</div>
              <div dir="ltr" class="mt-1 text-end font-semibold text-slate-700 tabular-nums">{{ row.numbers }}</div>
            </div>
          </li>
        </ol>

        <div class="mt-2 rounded-xl bg-[#7030A0]/5 p-4">
          <div class="text-sm font-semibold text-[#7030A0]">الإجمالي الشامل</div>
          <div class="mt-1 text-2xl font-black text-[#7030A0]">{{ formatCurrency(calcs.totalWithTax) }}</div>
          <div v-if="totalEquation" class="mt-3 text-sm leading-relaxed">
            <div class="text-slate-500">{{ totalEquation.formula }}</div>
            <div dir="ltr" class="mt-1 text-end font-semibold text-slate-700 tabular-nums">{{ totalEquation.numbers }}</div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calculatePlotPricing } from '../../../../../lib/pricing';
import { formatCurrency } from '../../../../../lib/format';
import type { Plot } from '../../../../shared/types/plot';

const route = useRoute();
const plotNo = computed(() => parseInt(route.params.plotNo as string, 10));

// Shared field styles
const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5';
const inputCls =
  'w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:outline-none focus:border-[#7030A0] focus:ring-2 focus:ring-[#7030A0]/20';

const { data: response, pending } = await useFetch<{
  success: boolean;
  data: Plot;
}>(`/api/plots/${plotNo.value}`);

const plot = computed(() => response.value?.data);

const form = reactive({
  block: 1,
  zone: 'A1',
  usage: 'سكنى',
  area: 300,
  pricePerM2: 1800,
  status: 'متاح للبيع',
  brokerageStatus: 'كامل السعي',
  buyerName: '',
  buyerPhone: '',
  buyerId: '',
  deedNo: '',
  deedDate: '',
  invoice: '',
  notes: '',
  expectedHash: '',
});

watchEffect(() => {
  if (plot.value) {
    form.block = plot.value.block;
    form.zone = plot.value.zone || 'غير محدد';
    form.usage = plot.value.usage || 'سكنى';
    form.area = plot.value.area;
    form.pricePerM2 = plot.value.pricePerM2;
    form.status = plot.value.status;
    form.brokerageStatus = plot.value.brokerageStatus || 'كامل السعي';
    form.buyerName = plot.value.buyerName || '';
    form.buyerPhone = plot.value.buyerPhone || '';
    form.buyerId = plot.value.buyerId || '';
    form.deedNo = plot.value.deedNo || '';
    form.deedDate = plot.value.deedDate || '';
    form.invoice = plot.value.invoice || '';
    form.notes = plot.value.notes || '';
    form.expectedHash = plot.value.hash || '';
  }
});

const calcs = computed(() => {
  return calculatePlotPricing({
    area: form.area,
    pricePerM2: form.pricePerM2,
  });
});

/* ---------- Equations shown in the preview ----------
   Rates are derived from the real results of calculatePlotPricing,
   so the equations always match the numbers and never drift from lib/pricing. */
const num = (n: number) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
const ratePct = (part: number, whole: number) =>
  `${whole ? Number(((part / whole) * 100).toFixed(3)) : 0}%`;

const calcRows = computed(() => {
  const c = calcs.value;
  return [
    {
      key: 'land',
      label: 'قيمة الأرض',
      value: c.landValue,
      formula: 'المساحة × سعر المتر',
      numbers: `${num(form.area)} × ${num(form.pricePerM2)}`,
    },
    {
      key: 'brokerage',
      label: 'السعي شامل الضريبة',
      value: c.brokerage,
      formula: 'قيمة الأرض × نسبة السعي',
      numbers: `${num(c.landValue)} × ${ratePct(c.brokerage, c.landValue)}`,
    },
    {
      key: 'ret',
      label: 'ضريبة التصرفات',
      value: c.retTax,
      formula: 'قيمة الأرض × نسبة الضريبة',
      numbers: `${num(c.landValue)} × ${ratePct(c.retTax, c.landValue)}`,
    },
  ];
});

// Shown only when the total really equals land + brokerage + tax
const totalEquation = computed(() => {
  const c = calcs.value;
  const sum = c.landValue + c.brokerage + c.retTax;
  if (Math.abs(sum - c.totalWithTax) > 0.01) return null;
  return {
    formula: 'قيمة الأرض + السعي + الضريبة',
    numbers: `${num(c.landValue)} + ${num(c.brokerage)} + ${num(c.retTax)}`,
  };
});

const saving = ref(false);
const errorMsg = ref('');

const handleSubmit = async () => {
  saving.value = true;
  errorMsg.value = '';

  try {
    const res = await $fetch<{ success: boolean; message: string }>(`/api/admin/plots/${plotNo.value}`, {
      method: 'PUT',
      body: form,
    });

    if (res.success) {
      alert('تم تحديث بيانات القطعة بنجاح!');
      navigateTo('/admin/plots');
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'حدث خطأ أثناء تعديل القطعة';
  } finally {
    saving.value = false;
  }
};
</script>