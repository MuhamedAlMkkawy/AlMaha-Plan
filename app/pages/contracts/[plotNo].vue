<template>
  <div class="space-y-6 mx-auto">
    <!-- Top Action & Navigation Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/plots"
          class="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <i class="pi pi-arrow-right"></i>
          <span>العودة لجدول القطع</span>
        </NuxtLink>

        <!-- Previous / Next Plot Arrows -->
        <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
          <button
            @click="goToPlot(currentPlotNo - 1)"
            :disabled="currentPlotNo <= 1"
            class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
            title="العقد السابق"
          >
            <i class="pi pi-chevron-right text-xs"></i>
          </button>
          <span class="text-xs font-bold text-slate-600 px-2">
            قطعة {{ currentPlotNo }}
          </span>
          <button
            @click="goToPlot(currentPlotNo + 1)"
            :disabled="currentPlotNo >= 973"
            class="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-700"
            title="العقد التالي"
          >
            <i class="pi pi-chevron-left text-xs"></i>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Print / PDF Button -->
        <button
          @click="handlePrint"
          class="px-4 py-2.5 rounded-xl bg-[#7030A0] hover:bg-[#532277] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
        >
          <i class="pi pi-print"></i>
          <span>طباعة / حفظ PDF</span>
        </button>

        <!-- Copy Link Button -->
        <button
          @click="copyShareLink"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-colors"
          :title="copied ? 'تم النسخ!' : 'نسخ رابط العقد'"
        >
          <i :class="copied ? 'pi pi-check text-emerald-600' : 'pi pi-copy text-slate-500'"></i>
          <span class="hidden sm:inline">{{ copied ? 'تم النسخ' : 'نسخ الرابط' }}</span>
        </button>

        <!-- Quotation shortcut -->
        <NuxtLink
          :to="`/plots/${currentPlotNo}`"
          class="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-tag text-slate-500"></i>
          <span class="hidden sm:inline">عرض السعر</span>
        </NuxtLink>

        <!-- Admin Edit Button if Admin -->
        <NuxtLink
          v-if="isAdmin"
          :to="`/admin/plots/${currentPlotNo}/edit`"
          class="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2"
        >
          <i class="pi pi-pencil"></i>
          <span class="hidden sm:inline">تعديل القطعة</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white rounded-2xl p-12 text-center text-slate-500 animate-pulse">
      <i class="pi pi-spin pi-spinner text-3xl text-[#7030A0] mb-3"></i>
      <div class="font-bold">جاري تحميل العقد للقطعة {{ currentPlotNo }}...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !plot" class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800">
      <i class="pi pi-exclamation-triangle text-3xl mb-2"></i>
      <h3 class="font-bold text-lg mb-1">تعذر العثور على القطعة رقم {{ currentPlotNo }}</h3>
      <p class="text-xs sm:text-sm mb-4">يرجى التحقق من صحة رقم القطعة في الرابط</p>
      <NuxtLink to="/plots" class="px-4 py-2 bg-[#7030A0] text-white rounded-xl text-sm font-semibold">
        العودة لجدول القطع
      </NuxtLink>
    </div>

    <!-- Contract Sheet -->
    <div v-else class="space-y-4">
      <p v-if="!isAdmin" class="text-xs text-slate-500 print:hidden">
        بيانات المشتري لا تظهر إلا للمسؤولين، وستجد الحقول فارغة لتعبئتها يدويًا عند الطباعة.
      </p>

      <article
        class="contract-sheet mx-auto w-full max-w-[210mm] bg-white rounded-2xl border border-slate-200 shadow-xs px-6 sm:px-12 py-10 text-slate-900 text-[13px] sm:text-sm leading-8"
        dir="rtl"
      >
        <!-- Header -->
        <header class="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#7030A0]">
          <div class="font-black text-base sm:text-lg text-[#7030A0]">مشروع مخطط مها الشرق العقاري</div>
          <div class="font-bold whitespace-nowrap">
            رقم العقد:
            <span class="blank min-w-16">{{ contractNo }}</span>
          </div>
        </header>

        <h1 class="mt-6 mb-5 text-center text-xl sm:text-2xl font-black">عقد شراء (إفراغ فوري)</h1>

        <p class="font-bold">تم إبرام هذا العقد لغرض شراء العقار المحدد بياناته في هذا العقد، بين كل من:</p>

        <!-- Parties -->
        <ul class="mt-3 space-y-2 list-disc ps-6 marker:text-[#7030A0]">
          <li>
            <span class="font-bold">البائع:</span>
            شركة القادسية الأولى العقارية.
          </li>
          <li>
            <span class="font-bold">المشتري:</span>
            الاسم/
            <span class="blank min-w-56">{{ buyer.name }}</span>
            الهوية الوطنية/
            <span class="blank min-w-32 tabular-nums">{{ buyer.id }}</span>
            تاريخ الميلاد/
            <span class="blank min-w-28 tabular-nums">{{ buyer.birthDate }}</span>
            الهاتف المحمول/
            <span class="blank min-w-28 tabular-nums" dir="ltr">{{ buyer.phone }}</span>
          </li>
          <li class="font-bold">بيانات العقار:</li>
        </ul>

        <!-- Property table -->
        <table class="mt-2 w-full border-collapse border border-slate-400 text-center">
          <tbody>
            <tr>
              <th class="w-1/3 border border-slate-400 bg-slate-100 px-3 py-2 font-bold">بيانات العقار</th>
              <td class="border border-slate-400 px-3 py-2 font-bold tabular-nums">
                قطعة رقم {{ plot.plotNo }} بلك {{ plot.block }} / بمساحة {{ formatCurrencyNumber(plot.area) }} م²
              </td>
            </tr>
            <tr>
              <th class="border border-slate-400 bg-slate-100 px-3 py-2 font-bold">ثمن الشراء</th>
              <td class="border border-slate-400 px-3 py-2 font-bold tabular-nums">
                {{ formatCurrencyNumber(plot.landValue) }} ريال سعودي
              </td>
            </tr>
            <tr>
              <th class="border border-slate-400 bg-slate-100 px-3 py-2 font-bold">مبلغ الضريبة</th>
              <td class="border border-slate-400 px-3 py-2 font-bold tabular-nums">
                {{ formatCurrencyNumber(plot.retTax) }} ريال سعودي
              </td>
            </tr>
            <tr>
              <th class="border border-slate-400 bg-slate-100 px-3 py-2 font-bold">أتعاب الوساطة</th>
              <td class="border border-slate-400 px-3 py-2 font-bold tabular-nums">
                {{ formatCurrencyNumber(plot.brokerage) }} ريال سعودي
              </td>
            </tr>
            <tr>
              <th class="border border-slate-400 bg-slate-100 px-3 py-2 font-bold">بيان خاص</th>
              <td class="border border-slate-400 px-3 py-2 min-h-10 h-10">{{ specialNote }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Terms -->
        <h2 class="mt-6 mb-2 font-bold list-disc">• الشروط والأحكام العامة:</h2>
        <ol class="space-y-2 list-decimal ps-6 marker:font-bold text-justify">
          <li v-for="(term, i) in terms" :key="i">{{ term }}</li>
        </ol>

        <p class="mt-6 text-center font-bold">وبالله التوفيق، وهو خير الشاهدين.</p>

        <!-- Signatures -->
        <table class="signatures mt-6 w-full border-collapse border border-slate-400 text-center">
          <thead>
            <tr>
              <th class="w-1/2 border border-slate-400 bg-slate-100 px-3 py-2 font-bold">البائع</th>
              <th class="w-1/2 border border-slate-400 bg-slate-100 px-3 py-2 font-bold">المشتري</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-400 h-24"></td>
              <td class="border border-slate-400 h-24"></td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../lib/format';
import type { Plot } from '../../shared/types/plot';

// Optional fields: add them to your Plot type / API if you want them filled in automatically.
type ContractPlot = Plot & {
  contractNo?: string | number;
  buyerBirthDate?: string;
  contractNote?: string;
};

const route = useRoute();
const currentPlotNo = computed(() => parseInt(route.params.plotNo as string, 10));

const { data: response, pending, error } = await useFetch<{
  success: boolean;
  data: Plot;
  isAdmin: boolean;
}>(`/api/plots/${currentPlotNo.value}`);

const plot = computed(() => response.value?.data as ContractPlot | undefined);
const isAdmin = computed(() => response.value?.isAdmin);

// Buyer data is admin-only (same rule as the plot page); otherwise the lines stay blank.
const buyer = computed(() => {
  const p = plot.value;
  if (!p || !isAdmin.value) return { name: '', id: '', birthDate: '', phone: '' };
  return {
    name: p.buyerName || '',
    id: p.buyerId || '',
    birthDate: p.buyerBirthDate || '',
    phone: p.buyerPhone || '',
  };
});

const contractNo = computed(() => (isAdmin.value && plot.value?.contractNo) || '');
const specialNote = computed(() => (isAdmin.value && plot.value?.contractNote) || '');

const terms = [
  'باع البائع إلى المشتري، وقبل المشتري شراء، العقار الـمُعيّن أعلاه، بالثمن المحدد، ويُقرُّ البائع بملكيته للعقار، وخلوّه من موانع الإفراغ، ويُقرُّ الطرفان بأهليتهما وصحة تمثيلهما، وأنّ هذا بيع ملزم وليس حجزًا أو وعدًا بالبيع.',
  'يُقرُّ المشتري بأنه عاين الأرض معاينة نافيًا للجهالة، واطلع حدودها ومساحتها واستعمالها واشتراطات البناء وحالة الخدمات والإفصاحات أعلاه، وقبلها بحالتها الراهنة بعد تقدير قيمتها وملاءمتها لغرضه بالشراء، ويُخلي المشتري ذمة البائع من أي عيوب متعلقة بالعقار.',
  'يُستحقُّ كامل الثمن عند الإفراغ في يوم التوقيع، ويُسدّد باسم البائع وذلك بموجب تحويل بنكي معتمد لحساب البائع أو بشيك مصرفي مُصدّق مقبول لدى جهة الإفراغ، وذلك بالتزامن مع نقل الملكية وفق الآلية المعتمدة وبعد استيفاء المتطلبات النظامية والضريبية، وللبائع الامتناع عن الإفراغ حتى تأمين استيفاء البائع كامل الثمن عبر تلك الآلية. ولا يعد توقيع العقد إقرارًا بقبض الثمن أو تفويضًا للمسوق بقبضه.',
  'يكون ثمن الشراء صافياً للبائع وخالياً من أي رسوم أو مستحقات لأي جهة، ويتحمّل المشتري تلك الرسوم والمستحقات بما في ذلك الضريبة وعمولة الوساطة ورسوم التوثيق.',
  'يُسلّم البائع الأرض للمشتري فور الإفراغ واستيفاء كامل الثمن، وذلك بتمكين المشتري من حيازتها والانتفاع بها، وتنتقل إليه منافعها وتبعتها والتزاماتها اللاحقة من التسليم.',
  'يُقرُّ المشتري بأن البيع لأرض مطورة تطويرًا أوليًا، ولا يرتب أعمال بناء أو تطوير إضافية أو إيصال خدمات إضافية بخلاف الخدمات الأساسية ( ماء – كهرباء – تصريف سيول – تعبيد الطرق – إنارة الشوارع )، ويتحمل المشتري تراخيص البناء وربط خدمات قطعته وتشغيلها.',
  'عند الإخلال بالسداد أو الإفراغ، يجوز للطرف المستحق للالتزام - قبل الإفراغ - فسخ العقد بإشعار مكتوب دون حكم قضائي، ويقر الطرفان بإسقاط الإعذار للآخر.',
  'يخضع هذا العقد للأحكام النظامية ذات العلاقة بالمملكة العربية السعودية.',
  'حُرّر هذا العقد من نسختين؛ وقد قرأ الطرفان بياناته وأحكامه ووافقا عليها، وتسلم كل منهما نسخة.',
];

const goToPlot = (num: number) => {
  if (num >= 1 && num <= 973) {
    navigateTo(`/contracts/${num}`);
  }
};

const handlePrint = () => {
  window.print();
};

const copied = ref(false);
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy URL:', err);
  }
};
</script>

<style>
/* Fill-in line: shows the value, or an empty dotted line when there is none */
.contract-sheet .blank {
  display: inline-block;
  padding: 0 0.5rem;
  text-align: center;
  font-weight: 700;
  border-bottom: 1px dotted #64748b;
  vertical-align: baseline;
}

.contract-sheet .signatures {
  break-inside: avoid;
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  .contract-sheet {
    max-width: none !important;
    border: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    font-size: 12px !important;
    line-height: 1.9 !important;
  }
}
</style>