<template>
  <div class="max-w-4xl mx-auto space-y-6">
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
          <h1 class="text-2xl font-black text-slate-900">تعديل بيانات قطعة رقم {{ plotNo }}</h1>
          <p class="text-xs text-slate-500">سيتم تحديث خلايا الإدخال فقط وحماية صيغ الإكسل الأصلية G, H, T</p>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMsg" class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">
      {{ errorMsg }}
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="bg-white rounded-2xl p-12 text-center text-slate-400 animate-pulse">
      جاري تحميل بيانات القطعة...
    </div>

    <!-- Edit Form Grid -->
    <div v-else-if="plot" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form @submit.prevent="handleSubmit" class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h2 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>البيانات الأساسية</span>
          <span class="text-xs text-slate-400 font-mono">سطر الشيت: {{ plot.rowNumber || 'تلقائي' }}</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">رقم القطعة (ثابت)</label>
            <input
              :value="plot.plotNo"
              disabled
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">رقم البلك *</label>
            <input
              v-model.number="form.block"
              type="number"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">الزون</label>
            <select v-model="form.zone" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="غير محدد">غير محدد</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">الاستخدام *</label>
            <select v-model="form.usage" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
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
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">سعر المتر (ر.س) *</label>
            <input
              v-model.number="form.pricePerM2"
              type="number"
              step="1"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">حالة البيع</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="متاح للبيع">متاح للبيع</option>
              <option value="محجوز">محجوز</option>
              <option value="مباع">مباع</option>
              <option value="مؤرشف">مؤرشف</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">حالة السعي</label>
            <select v-model="form.brokerageStatus" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="كامل السعي">كامل السعي</option>
              <option value="لايوجد">لايوجد</option>
            </select>
          </div>
        </div>

        <h2 class="font-bold text-slate-900 text-base border-t border-b border-slate-100 py-3 flex items-center gap-2">
          <i class="pi pi-user text-[#7030A0]"></i>
          <span>بيانات المشتري والصك</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">اسم المشتري</label>
            <input v-model="form.buyerName" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">رقم الجوال</label>
            <input v-model="form.buyerPhone" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm dir-ltr text-end" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">الهوية / السجل</label>
            <input v-model="form.buyerId" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">رقم صك القطعة</label>
            <input v-model="form.deedNo" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ الصك</label>
            <input v-model="form.deedDate" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">الفاتورة الضريبية</label>
            <input v-model="form.invoice" type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
          <textarea v-model="form.notes" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"></textarea>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <NuxtLink to="/admin/plots" class="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold">
            إلغاء
          </NuxtLink>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-[#7030A0] text-white rounded-xl text-sm font-bold hover:bg-[#532277] shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner"></i>
            <span>{{ saving ? 'جاري الحفظ في الشيت...' : 'حفظ التعديلات' }}</span>
          </button>
        </div>
      </form>

      <!-- Live Calculations Preview -->
      <div class="space-y-4">
        <div class="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-200 p-5 shadow-xs space-y-4 sticky top-24">
          <h3 class="font-bold text-[#7030A0] text-base border-b border-purple-150 pb-2">
            معاينة الحسابات المحدثة
          </h3>

          <div class="space-y-3 text-xs sm:text-sm">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-700">قيمة الأرض:</span>
              <strong class="text-slate-900 font-black">{{ formatCurrency(calcs.landValue) }}</strong>
            </div>

            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-700">السعي شامل الضريبة:</span>
              <strong class="text-[#7030A0] font-black">{{ formatCurrency(calcs.brokerage) }}</strong>
            </div>

            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-700">ضريبة التصرفات (5%):</span>
              <strong class="text-emerald-700 font-black">{{ formatCurrency(calcs.retTax) }}</strong>
            </div>

            <div class="pt-3 border-t-2 border-purple-200 flex items-center justify-between text-sm sm:text-base">
              <span class="font-black text-purple-950">الإجمالي الشامل:</span>
              <strong class="font-black text-[#7030A0]">{{ formatCurrency(calcs.totalWithTax) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calculatePlotPricing } from '../../../../../lib/pricing';
import { formatCurrency } from '../../../../../lib/format';
import type { Plot } from '../../../../shared/types/plot';

const route = useRoute();
const plotNo = computed(() => parseInt(route.params.plotNo as string, 10));

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

