<template>
  <div class=" mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/plots"
          class="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5"
        >
          <i class="pi pi-arrow-right"></i>
          <span>العودة للجدول</span>
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-black text-slate-900">إضافة قطعة أرض جديدة</h1>
          <p class="text-xs text-slate-500">سيتم إضافة السطر مباشرة في Google Sheets مع كتابة الصيغ الحسابية تلقائياً</p>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMsg" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">
      {{ errorMsg }}
    </div>


  <!-- Form & Live Calculations Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

    <!-- Main Form (2/3 width) -->
    <form
      @submit.prevent="handleSubmit"
      class="lg:col-span-2 min-w-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
    >
      <!-- Basic Information -->
      <h2 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
        <i class="pi pi-map-marker text-[#7030A0]"></i>
        <span>البيانات الأساسية للقطعة</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">رقم البلك *</label>
          <input
            v-model.number="form.block"
            type="number"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">رقم القطعة *</label>
          <input
            v-model.number="form.plotNo"
            type="number"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-[#7030A0] focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">الزون</label>
          <select
            v-model="form.zone"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="غير محدد">غير محدد</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">الاستخدام *</label>
          <select
            v-model="form.usage"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="سكنى">سكنى</option>
            <option value="تجارى">تجارى</option>
            <option value="مرافق">مرافق</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">المساحة (م²) *</label>
          <input
            v-model.number="form.area"
            type="number"
            step="0.01"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">سعر المتر (ر.س) *</label>
          <input
            v-model.number="form.pricePerM2"
            type="number"
            step="1"
            required
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>
      </div>

      <!-- Sales Information -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">حالة البيع</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="متاح للبيع">متاح للبيع</option>
            <option value="محجوز">محجوز</option>
            <option value="مباع">مباع</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">حالة السعي</label>
          <select
            v-model="form.brokerageStatus"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="كامل السعي">كامل السعي</option>
            <option value="لايوجد">لايوجد</option>
          </select>
        </div>
      </div>

      <!-- Buyer Information -->
      <h2 class="font-bold text-slate-900 text-base border-t border-b border-slate-100 py-3 flex items-center gap-2">
        <i class="pi pi-user text-[#7030A0]"></i>
        <span>بيانات المشتري والصك (خاص بالإدارة)</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">اسم المشتري</label>
          <input
            v-model="form.buyerName"
            type="text"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">رقم الجوال</label>
          <input
            v-model="form.buyerPhone"
            type="text"
            dir="ltr"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-end focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">الهوية / السجل</label>
          <input
            v-model="form.buyerId"
            type="text"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">رقم صك القطعة</label>
          <input
            v-model="form.deedNo"
            type="text"
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
          />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
        <textarea
          v-model="form.notes"
          rows="3"
          class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-y focus:border-[#7030A0] focus:ring-2 focus:ring-purple-100 outline-none"
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <NuxtLink
          to="/admin/plots"
          class="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold transition-colors"
        >
          إلغاء
        </NuxtLink>

        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2.5 bg-[#7030A0] text-white rounded-xl text-sm font-bold hover:bg-[#532277] shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner"></i>
          <span>{{ saving ? 'جاري الحفظ في الشيت...' : 'حفظ وإضافة القطعة' }}</span>
        </button>
      </div>
    </form>

    <!-- Live Calculations Preview (1/3 width) -->
    <div class="lg:col-span-1 min-w-0">
      <div class="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-200 p-5 shadow-sm space-y-4 lg:sticky lg:top-24">

        <h3 class="font-bold text-[#7030A0] text-base border-b border-purple-200 pb-3 flex items-center gap-2">
          <i class="pi pi-calculator"></i>
          معاينة الحسابات التلقائية
        </h3>

        <div class="space-y-4 text-xs sm:text-sm">

          <!-- Land Value Formula -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-100">
              <span class="text-slate-600">صيغة قيمة الأرض:</span>
              <span class="font-mono text-xs text-purple-700" dir="ltr">المساحة × سعر المتر</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-slate-700">قيمة الأرض:</span>
              <strong class="text-slate-900 font-black text-base">
                {{ formatCurrency(calcs.landValue) }}
              </strong>
            </div>
          </div>

          <!-- Brokerage -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-100">
              <span class="text-slate-600">صيغة السعي (15% ضريبة):</span>
              <span class="font-mono text-xs text-purple-700" dir="ltr">القيمة × 2.5% × 1.15</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-slate-700">السعي شامل الضريبة:</span>
              <strong class="text-[#7030A0] font-black text-base">
                {{ formatCurrency(calcs.brokerage) }}
              </strong>
            </div>
          </div>

          <!-- Transaction Tax -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-100">
              <span class="text-slate-600">صيغة التصرفات (5%):</span>
              <span class="font-mono text-xs text-purple-700" dir="ltr">القيمة × 5%</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-slate-700">ضريبة التصرفات:</span>
              <strong class="text-emerald-700 font-black text-base">
                {{ formatCurrency(calcs.retTax) }}
              </strong>
            </div>
          </div>

          <!-- Total -->
          <div class="pt-4 border-t-2 border-purple-200 space-y-2">
            <span class="font-black text-purple-950 text-sm">الإجمالي الشامل:</span>

            <strong class="block font-black text-[#7030A0] text-xl sm:text-2xl break-words">
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

const form = reactive({
  plotNo: 974,
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
  notes: '',
});

const calcs = computed(() => {
  return calculatePlotPricing({
    area: form.area,
    pricePerM2: form.pricePerM2,
  });
});

const saving = ref(false);
const errorMsg = ref('');

const handleSubmit = async () => {
  saving.value = true;
  errorMsg.value = '';

  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/plots', {
      method: 'POST',
      body: form,
    });

    if (res.success) {
      alert('تم إضافة القطعة وحفظها بنجاح!');
      navigateTo('/admin/plots');
    }
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'حدث خطأ أثناء حفظ القطعة';
  } finally {
    saving.value = false;
  }
};
</script>

