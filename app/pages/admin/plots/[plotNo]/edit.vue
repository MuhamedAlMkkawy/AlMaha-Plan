
<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <header class="space-y-4">
      <NuxtLink
        to="/admin/plots"
        class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#126B58] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126B58]/40"
      >
        <i class="pi pi-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300 motion-reduce:transition-none"></i>
        <span>العودة للجدول</span>
      </NuxtLink>

      <div class="flex items-center gap-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#126B58] text-white flex items-center justify-center shrink-0">
          <span class="text-2xl sm:text-3xl font-black">{{ plotNo }}</span>
        </div>

        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900">
            تعديل بيانات قطعة رقم {{ plotNo }}
          </h1>
        </div>
      </div>
    </header>

    <!-- Loading Skeleton -->
    <div
      v-if="pending"
      class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] gap-6 animate-fadeIn"
      aria-busy="true"
    >
      <div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
        <div class="space-y-2 border-b border-slate-100 pb-4">
          <FeaturesAppSkeleton width="40%" height="1.5rem" rounded="lg" />
          <FeaturesAppSkeleton width="60%" height="1rem" rounded="md" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="i in 6" :key="i" class="space-y-2">
            <FeaturesAppSkeleton width="40%" height="1rem" rounded="md" />
            <FeaturesAppSkeleton width="100%" height="2.75rem" rounded="xl" />
          </div>
        </div>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200 p-6 space-y-4">
        <FeaturesAppSkeleton width="50%" height="1.5rem" rounded="lg" />
        <FeaturesAppSkeleton width="100%" height="12rem" rounded="2xl" />
        <FeaturesAppSkeleton width="100%" height="3rem" rounded="xl" />
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="!pending && fetchError"
      role="alert"
      class="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-base font-semibold"
    >
      <i class="pi pi-exclamation-circle mt-1"></i>
      <span>
        {{ errorMsg || 'حدث خطأ أثناء تحميل بيانات القطعة.' }}
      </span>
    </div>

    <!-- Form + Calculations -->
    <div
      v-else-if="!pending && plot"
      class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_30rem] gap-6 items-start"
    >
      <form
        @submit.prevent="handleSubmit"
        class="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden"
      >
        <!-- Basic Data -->
        <section class="p-5 sm:p-7 space-y-5">
          <h2 class="flex items-center justify-between gap-3 text-lg font-bold text-slate-900">
            <span class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-[3px] bg-amber-400"></span>
              البيانات الأساسية
            </span>

            <span class="text-sm font-normal text-slate-500">
              سطر الشيت: {{ plot.rowNumber || 'تلقائي' }}
            </span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label :class="labelCls">رقم القطعة (ثابت)</label>
              <input
                :value="plot.plotNo"
                disabled
                :class="[inputCls, 'bg-slate-100 text-slate-500 cursor-not-allowed']"
              />
            </div>

            <div>
              <label :class="labelCls">رقم البلك *</label>
              <input
                v-model.number="form.block"
                type="number"
                required
                :class="inputCls"
              />
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
              <input
                v-model.number="form.area"
                type="number"
                step="0.01"
                required
                :class="inputCls"
              />
            </div>

            <div>
              <label :class="labelCls">سعر المتر (ر.س) *</label>
              <input
                v-model.number="form.pricePerM2"
                type="number"
                step="1"
                required
                :class="inputCls"
              />
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
                <option value="لا يوجد سعي">لا يوجد سعي</option>
              </select>
            </div>

            <div
              v-if="!isNoBrokerage(form.brokerageStatus) && Number(form.brokerage) > 0"
            >
              <label :class="labelCls">قيمة السعي (ر.س)</label>
              <input
                v-model.number="form.brokerage"
                type="number"
                min="0"
                step="0.01"
                :class="inputCls"
              />
            </div>
          </div>
        </section>

        <!-- Buyer + Deed -->
        <section
          v-if="canEditContracts"
          class="p-5 sm:p-7 space-y-5"
        >
          <h2 class="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <span class="w-2.5 h-2.5 rounded-[3px] bg-amber-400"></span>
            بيانات المشتري والصك
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label :class="labelCls">اسم المشتري</label>
              <input
                v-model="form.buyerName"
                type="text"
                :class="inputCls"
              />
            </div>

            <div>
              <label :class="labelCls">رقم الجوال</label>
              <input
                v-model="form.buyerPhone"
                type="text"
                inputmode="tel"
                dir="ltr"
                :class="[inputCls, 'text-end']"
              />
            </div>

            <div>
              <label :class="labelCls">الهوية / السجل</label>
              <input
                v-model="form.buyerId"
                type="text"
                :class="inputCls"
              />
            </div>

            <div>
              <label :class="labelCls">رقم صك القطعة</label>
              <input
                v-model="form.deedNo"
                type="text"
                dir="ltr"
                :class="[inputCls, 'text-end']"
              />
            </div>

            <div>
              <label :class="labelCls">تاريخ الصك</label>
              <input
                v-model="form.deedDate"
                type="text"
                :class="inputCls"
              />
            </div>

            <div>
              <label :class="labelCls">الفاتورة الضريبية</label>
              <input
                v-model="form.invoice"
                type="text"
                :class="inputCls"
              />
            </div>
          </div>

          <div>
            <label :class="labelCls">ملاحظات إضافية</label>
            <textarea
              v-model="form.notes"
              rows="3"
              :class="[inputCls, 'h-auto py-2.5 leading-relaxed']"
            ></textarea>
          </div>
        </section>

        <!-- Actions -->
        <div class="px-5 sm:px-7 py-4 bg-slate-50 flex items-center justify-end gap-2">
          <NuxtLink
            to="/admin/plots"
            class="h-11 px-5 inline-flex items-center rounded-full text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="h-11 px-7 inline-flex items-center gap-2 rounded-full bg-[#126B58] text-white text-base font-bold hover:bg-[#0D5143] disabled:opacity-60 disabled:pointer-events-none"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
            <span>
              {{ saving ? 'جاري الحفظ في الشيت...' : 'حفظ التعديلات' }}
            </span>
          </button>
        </div>
      </form>

      <!-- Live Calculations -->
      <aside
        class="lg:sticky lg:top-24 rounded-2xl bg-white border border-slate-200 border-t-[3px] border-t-[#126B58] p-5 sm:p-6"
      >
        <h3 class="text-lg font-bold text-slate-900">
          معاينة الحسابات
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          تتحدّث الأرقام والمعادلات تلقائيًا أثناء التعديل.
        </p>

        <ol class="mt-5 divide-y divide-slate-100">
          <li
            v-for="row in calcRows"
            :key="row.key"
            class="py-4 first:pt-0"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="text-base text-slate-700 font-semibold">
                {{ row.label }}
              </span>

              <span class="text-lg font-black text-slate-900">
                {{ formatCurrency(row.value) }}
              </span>
            </div>

            <div
              v-if="row.formula"
              class="mt-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-relaxed"
            >
              <div class="text-slate-500">
                {{ row.formula }}
              </div>

              <div
                dir="ltr"
                class="mt-1 text-end font-semibold text-slate-700 tabular-nums"
              >
                {{ row.numbers }}
              </div>
            </div>
          </li>
        </ol>

        <div class="mt-2 rounded-xl bg-[#126B58]/5 p-4">
          <div class="text-sm font-semibold text-[#126B58]">
            الإجمالي الشامل
          </div>

          <div class="mt-1 text-2xl font-black text-[#126B58]">
            {{ formatCurrency(calcs.totalWithTax) }}
          </div>

          <div
            v-if="totalEquation"
            class="mt-3 text-sm leading-relaxed"
          >
            <div class="text-slate-500">
              {{ totalEquation.formula }}
            </div>

            <div
              dir="ltr"
              class="mt-1 text-end font-semibold text-slate-700 tabular-nums"
            >
              {{ totalEquation.numbers }}
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Not Found -->
    <div
      v-else-if="!pending && !plot && !fetchError"
      class="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center"
    >
      <div class="mx-auto w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
        <i class="pi pi-search text-3xl text-amber-500"></i>
      </div>

      <h2 class="mt-5 text-xl font-black text-slate-900">
        لم يتم العثور على القطعة
      </h2>

      <p class="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        لا توجد بيانات مسجلة للقطعة رقم {{ plotNo }}.
        <br>
        <b>يرجى التأكد من رقم القطعة والمحاولة مرة أخرى.</b>
      </p>

      <NuxtLink
        to="/admin/plots"
        class="mt-6 h-11 px-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#126B58] text-white text-sm font-bold hover:bg-[#0D5143] transition-colors"
      >
        <i class="pi pi-arrow-right text-xs"></i>
        العودة إلى جدول القطع
      </NuxtLink>
    </div>
  </div>
</template>


<script setup lang="ts">
import { calculatePlotPricing, isNoBrokerage } from '../../../../../lib/pricing';
import { formatCurrency } from '../../../../../lib/format';
import { useToastMsg } from '../../../../composables/useToastMsg';
import type { Plot } from '../../../../shared/types/plot';

const route = useRoute();

const plotNo = computed(() =>
  parseInt(route.params.plotNo as string, 10)
);

const { can } = useAuthSession();

const { showSuccessToast, showErrorToast } = useToastMsg();

const canEditContracts = computed(() => can('edit_contracts'));

// Shared field styles
const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5';

const inputCls =
  'w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:outline-none focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/20';

// Fetch plot
const {
  data: response,
  pending,
  error: fetchError,
} = await useFetch<{
  success: boolean;
  data: Plot;
}>(`/api/plots/${plotNo.value}`);

const plot = computed(() => response.value?.data);

// Form
const form = reactive({
  block: 1,
  zone: 'A1',
  usage: 'سكنى',
  area: 300,
  pricePerM2: 1800,
  status: 'متاح للبيع',
  brokerageStatus: 'كامل السعي',
  brokerage: 0,
  buyerName: '',
  buyerPhone: '',
  buyerId: '',
  deedNo: '',
  deedDate: '',
  invoice: '',
  notes: '',
  expectedHash: '',
});

// Initialize form once data is loaded
const isInitialized = ref(false);
watch(
  () => response.value?.data,
  (data) => {
    if (!data || isInitialized.value) return;
    isInitialized.value = true;

    form.block = Number(data.block || 1);
    form.zone = data.zone || 'غير محدد';
    form.usage = data.usage || 'سكنى';
    form.area = Number(data.area || 0);
    form.pricePerM2 = Number(data.pricePerM2 || 0);
    form.status = data.status || 'متاح للبيع';

    const noBrok = isNoBrokerage(data.brokerageStatus) || Number(data.brokerage) === 0;
    form.brokerageStatus = noBrok ? 'لا يوجد سعي' : 'كامل السعي';
    form.brokerage = noBrok ? 0 : Number(data.brokerage || 0);

    form.buyerName = data.buyerName || '';
    form.buyerPhone = data.buyerPhone || '';
    form.buyerId = data.buyerId || '';
    form.deedNo = data.deedNo || '';
    form.deedDate = data.deedDate || '';
    form.invoice = data.invoice || '';
    form.notes = data.notes || '';
    form.expectedHash = data.hash || '';
  },
  { immediate: true }
);

// When brokerage status changes, update brokerage amount
watch(
  () => form.brokerageStatus,
  (newStatus) => {
    if (isNoBrokerage(newStatus)) {
      form.brokerage = 0;
    } else if (form.brokerage === 0) {
      const calc = calculatePlotPricing({
        area: Number(form.area || 0),
        pricePerM2: Number(form.pricePerM2 || 0),
      });
      form.brokerage = calc.brokerage;
    }
  }
);

// When brokerage input number becomes 0, sync status to "لا يوجد سعي"
watch(
  () => form.brokerage,
  (newVal) => {
    if (Number(newVal) === 0 && !isNoBrokerage(form.brokerageStatus)) {
      form.brokerageStatus = 'لا يوجد سعي';
    } else if (Number(newVal) > 0 && isNoBrokerage(form.brokerageStatus)) {
      form.brokerageStatus = 'كامل السعي';
    }
  }
);

// When area or price changes and status is full brokerage, recalculate brokerage
watch(
  [() => form.area, () => form.pricePerM2],
  () => {
    if (!isNoBrokerage(form.brokerageStatus)) {
      const calc = calculatePlotPricing({
        area: Number(form.area || 0),
        pricePerM2: Number(form.pricePerM2 || 0),
      });
      form.brokerage = calc.brokerage;
    }
  }
);

// Live calculations
const calcs = computed(() => {
  const noBrok = isNoBrokerage(form.brokerageStatus) || Number(form.brokerage) === 0;
  return calculatePlotPricing({
    area: Number(form.area || 0),
    pricePerM2: Number(form.pricePerM2 || 0),
    brokerageStatus: noBrok ? 'لايوجد' : 'كامل السعي',
    brokerage: noBrok ? 0 : Number(form.brokerage || 0),
  });
});

const hasBrokerage = computed(
  () => !isNoBrokerage(form.brokerageStatus) && Number(form.brokerage) > 0
);

// Equation helpers
const num = (n: number) =>
  Number(n || 0).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

const ratePct = (part: number, whole: number) =>
  `${whole ? Number(((part / whole) * 100).toFixed(3)) : 0}%`;

// Calculation rows
const calcRows = computed(() => {
  const c = calcs.value;

  const rows = [
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
      formula: hasBrokerage.value ? 'قيمة الأرض × نسبة السعي' : 'لا يوجد سعي',
      numbers: hasBrokerage.value
        ? `${num(c.landValue)} × ${ratePct(c.brokerage, c.landValue)}`
        : '0.00 ر.س',
    },
    {
      key: 'ret',
      label: 'ضريبة التصرفات',
      value: c.retTax,
      formula: 'قيمة الأرض × نسبة الضريبة',
      numbers: `${num(c.landValue)} × ${ratePct(c.retTax, c.landValue)}`,
    },
  ];

  // Hide brokerage completely when its value is zero.
  return rows.filter(
    row => row.key !== 'brokerage' && row.value !== 0 ||
           row.key === 'brokerage' && Number(row.value) > 0
  );
});

// Total equation
const totalEquation = computed(() => {
  const c = calcs.value;

  if (!hasBrokerage.value) {
    return {
      formula: 'قيمة الأرض + الضريبة',
      numbers: `${num(c.landValue)} + ${num(c.retTax)}`,
    };
  }

  return {
    formula: 'قيمة الأرض + السعي + الضريبة',
    numbers: `${num(c.landValue)} + ${num(c.brokerage)} + ${num(c.retTax)}`,
  };
});

// Save
const saving = ref(false);
const errorMsg = ref('');

const handleSubmit = async () => {
  if (saving.value) return;

  saving.value = true;
  errorMsg.value = '';

  try {
    const noBrok = isNoBrokerage(form.brokerageStatus) || Number(form.brokerage) === 0;
    const finalBrokerageStatus = noBrok ? 'لا يوجد سعي' : 'كامل السعي';
    const finalBrokerage = noBrok ? 0 : Number(form.brokerage || calcs.value.brokerage);
    const currentCalcs = calcs.value;

    const payload = {
      block: Number(form.block),
      zone: form.zone,
      usage: form.usage,
      area: Number(form.area),
      pricePerM2: Number(form.pricePerM2),
      status: form.status,
      brokerageStatus: finalBrokerageStatus,
      brokerage: finalBrokerage,
      landValue: currentCalcs.landValue,
      retTax: currentCalcs.retTax,
      totalWithTax: currentCalcs.totalWithTax,
      buyerName: form.buyerName,
      buyerPhone: form.buyerPhone,
      buyerId: form.buyerId,
      deedNo: form.deedNo,
      deedDate: form.deedDate,
      invoice: form.invoice,
      notes: form.notes,
      expectedHash: form.expectedHash,
    };

    // console.log('Updating plot payload:', payload);

    const res = await $fetch<{
      success: boolean;
      message: string;
      data?: Plot;
    }>(`/api/admin/plots/${plotNo.value}`, {
      method: 'PUT',
      body: payload,
    });

    if (!res.success) {
      throw new Error(res.message || 'تعذر تحديث بيانات القطعة');
    }

    // console.log('Updated plot response:', res.data);

    // clearNuxtData();

    showSuccessToast('تم تحديث وحفظ بيانات القطعة بنجاح!');

    setTimeout(() => {
      useRouter().push(`/contracts/${plotNo.value}`);
    }, 500);
  } catch (err: any) {
    const msg =
      err.data?.statusMessage ||
      err.data?.message ||
      err.message ||
      'حدث خطأ أثناء تعديل القطعة';

    errorMsg.value = msg;

    showErrorToast(msg);
  } finally {
    saving.value = false;
  }
};
</script>
