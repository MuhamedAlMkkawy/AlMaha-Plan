<template>
  <div class="mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/plots"
          class="p-2.5 rounded-xl bg-white border border-[#E5E9E5] text-[#293B36] hover:bg-[#FAF9F5] text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <i class="pi pi-arrow-right text-xs"></i>
          <span>العودة للجدول</span>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-black text-[#293B36]">إضافة قطعة أرض جديدة</h1>
          <p class="text-xs text-[#718078]">سيتم حفظ القطعة مباشرة وتطبيق الحسابات المالية التلقائية</p>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMsg" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold flex items-center gap-2">
      <i class="pi pi-exclamation-circle text-base"></i>
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Form & Live Calculations Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <!-- Main Form (2/3 width) -->
      <form
        @submit.prevent="handleSubmit"
        class="lg:col-span-2 min-w-0 bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-6"
      >
        <!-- Basic Information -->
        <h2 class="font-bold text-[#293B36] text-base border-b border-[#E5E9E5] pb-3 flex items-center gap-2">
          <i class="pi pi-map-marker text-[#126B58]"></i>
          <span>البيانات الأساسية للقطعة</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          <!-- Block Number -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">
              رقم البلك <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.block"
              type="number"
              min="1"
              required
              placeholder="أدخل رقم البلك، مثال: 12"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm text-[#293B36] placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            />
          </div>

          <!-- Plot Number -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">
              رقم القطعة <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.plotNo"
              type="number"
              min="1"
              required
              placeholder="أدخل رقم القطعة، مثال: 154"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm font-bold text-[#126B58] placeholder:font-normal placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            />
          </div>

          <!-- Zone -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">الزون / المنطقة</label>
            <select
              v-model="form.zone"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm bg-white text-[#293B36] focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            >
              <option :value="null" disabled>اختر المنطقة المرتبطة</option>
              <option value="A1">منطقة A1</option>
              <option value="A2">منطقة A2</option>
              <option value="B1">منطقة B1</option>
              <option value="B2">منطقة B2</option>
              <option value="غير محدد">غير محدد</option>
            </select>
          </div>

          <!-- Usage -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">
              نوع الاستخدام <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="form.usage"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm bg-white text-[#293B36] focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            >
              <option :value="null" disabled>حدد نوع الاستخدام</option>
              <option value="سكنى">سكنى</option>
              <option value="تجارى">تجارى</option>
              <option value="مرافق">مرافق</option>
            </select>
          </div>

          <!-- Area -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">
              المساحة (م²) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.area"
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="أدخل مساحة القطعة بالمتر المربع"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm font-semibold text-[#293B36] placeholder:font-normal placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            />
          </div>

          <!-- Price per m2 -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">
              سعر المتر (ر.س) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.pricePerM2"
              type="number"
              step="1"
              min="1"
              required
              placeholder="أدخل سعر المتر بالريال السعودي"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm font-semibold text-[#293B36] placeholder:font-normal placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Sales Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">حالة البيع</label>
            <select
              v-model="form.status"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm bg-white text-[#293B36] focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            >
              <option value="متاح للبيع">متاح للبيع (افتراضي)</option>
              <option value="محجوز">محجوز</option>
              <option value="مباع">مباع</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">حالة السعي</label>
            <select
              v-model="form.brokerageStatus"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm bg-white text-[#293B36] focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            >
              <option value="كامل السعي">كامل السعي (افتراضي)</option>
              <option value="لايوجد">لايوجد</option>
            </select>
          </div>
        </div>

        <!-- Buyer Information -->
        <template v-if="canEditContracts">
          <h2 class="font-bold text-[#293B36] text-base border-t border-b border-[#E5E9E5] py-3 flex items-center gap-2">
            <i class="pi pi-user text-[#126B58]"></i>
            <span>بيانات المشتري والصك (اختياري)</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#293B36] mb-1.5">اسم المشتري</label>
              <input
                v-model.trim="form.buyerName"
                type="text"
                placeholder="أدخل الاسم الكامل للمشتري أو الشركة"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm text-[#293B36] placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#293B36] mb-1.5">رقم الجوال</label>
              <input
                v-model.trim="form.buyerPhone"
                type="tel"
                dir="ltr"
                placeholder="05XXXXXXXX"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm text-end text-[#293B36] placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#293B36] mb-1.5">رقم الهوية / السجل التجاري</label>
              <input
                v-model.trim="form.buyerId"
                type="text"
                maxlength="10"
                placeholder="أدخل رقم الهوية أو السجل (10 أرقام)"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm text-[#293B36] placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#293B36] mb-1.5">رقم صك القطعة</label>
              <input
                v-model.trim="form.deedNo"
                type="text"
                placeholder="أدخل رقم الصك الإلكتروني للقطعة"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm font-mono text-[#293B36] placeholder:font-sans placeholder:text-[#718078]/60 focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
              />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-bold text-[#293B36] mb-1.5">ملاحظات إضافية</label>
            <textarea
              v-model.trim="form.notes"
              rows="3"
              placeholder="أضف أي ملاحظات أو تفاصيل خاصة بهذه القطعة..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] text-sm text-[#293B36] placeholder:text-[#718078]/60 resize-y focus:border-[#126B58] focus:ring-2 focus:ring-[#126B58]/15 outline-none transition-all"
            ></textarea>
          </div>
        </template>

        <!-- Form Actions -->
        <div class="pt-4 border-t border-[#E5E9E5] flex items-center justify-end gap-3">
          <NuxtLink
            to="/admin/plots"
            class="px-4 py-2.5 text-[#718078] hover:text-[#293B36] text-sm font-semibold transition-colors"
          >
            إلغاء
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-[#126B58] text-white rounded-xl text-sm font-bold hover:bg-[#174A40] shadow-md shadow-[#126B58]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'جاري الحفظ في الشيت...' : 'حفظ وإضافة القطعة' }}</span>
          </button>
        </div>
      </form>

      <!-- Live Calculations Preview (1/3 width) -->
      <div class="lg:col-span-1 min-w-0">
        <div class="bg-white rounded-2xl border-2 border-[#126B58]/20 p-5 shadow-xs space-y-4 lg:sticky lg:top-24">

          <h3 class="font-bold text-[#126B58] text-base border-b border-[#E5E9E5] pb-3 flex items-center gap-2">
            <i class="pi pi-calculator"></i>
            <span>معاينة الحسابات التلقائية</span>
          </h3>

          <div class="space-y-4 text-xs sm:text-sm">

            <!-- Land Value Formula -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-1 text-[#718078]">
                <span>صيغة قيمة الأرض:</span>
                <span class="font-mono text-[11px]" dir="ltr">المساحة × سعر المتر</span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-[#293B36]">قيمة الأرض:</span>
                <strong class="text-[#293B36] font-black text-base">
                  {{ formatCurrency(calcs.landValue) }}
                </strong>
              </div>
            </div>

            <!-- Brokerage -->
            <div class="space-y-1.5 border-t border-[#E5E9E5] pt-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-1 text-[#718078]">
                <span>السعي (شامل 15% ضريبة):</span>
                <span class="font-mono text-[11px]" dir="ltr">القيمة × 2.5% × 1.15</span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-[#293B36]">السعي شاملاً الضريبة:</span>
                <strong class="text-[#126B58] font-black text-base">
                  {{ formatCurrency(calcs.brokerage) }}
                </strong>
              </div>
            </div>

            <!-- Transaction Tax -->
            <div class="space-y-1.5 border-t border-[#E5E9E5] pt-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-1 text-[#718078]">
                <span>ضريبة التصرفات العقارية:</span>
                <span class="font-mono text-[11px]" dir="ltr">القيمة × 5%</span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-[#293B36]">قيمة الضريبة (RETT):</span>
                <strong class="text-[#B89A68] font-black text-base">
                  {{ formatCurrency(calcs.retTax) }}
                </strong>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t-2 border-[#126B58]/20 space-y-1">
              <span class="font-black text-[#718078] text-xs">الإجمالي الشامل المتوقع:</span>
              <strong class="block font-black text-[#126B58] text-xl sm:text-2xl break-words">
                {{ formatCurrency(calcs.totalWithTax) }}
              </strong>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { calculatePlotPricing } from '../../../../lib/pricing';
import { formatCurrency } from '../../../../lib/format';

const { can } = useAuthSession();
const canEditContracts = computed(() => can('edit_contracts'));

// Initial EMPTY state for creation (No prefilled fake numbers, prices or names)
const form = reactive({
  plotNo: null as number | null,
  block: null as number | null,
  zone: null as string | null,
  usage: null as string | null,
  area: null as number | null,
  pricePerM2: null as number | null,
  status: 'متاح للبيع',
  brokerageStatus: 'كامل السعي',
  buyerName: '',
  buyerPhone: '',
  buyerId: '',
  deedNo: '',
  notes: '',
});

const calcs = computed(() => {
  return calculatePlotPricing({
    area: Number(form.area) || 0,
    pricePerM2: Number(form.pricePerM2) || 0,
  });
});

const saving = ref(false);
const errorMsg = ref('');

const handleSubmit = async () => {
  if (!form.block || !form.plotNo || !form.area || !form.pricePerM2 || !form.usage) {
    errorMsg.value = 'يرجى ملء جميع الحقول الأساسية المطلوبة (*)';
    return;
  }

  saving.value = true;
  errorMsg.value = '';

  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/plots', {
      method: 'POST',
      body: form,
    });

    if (res.success) {
      navigateTo('/admin/plots');
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'حدث خطأ أثناء حفظ القطعة';
  } finally {
    saving.value = false;
  }
};
</script>
