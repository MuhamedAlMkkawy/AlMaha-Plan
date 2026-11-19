<template>
  <div class="contract-page w-full">

    <!-- Page header -->
    <section class="page-head">
      <div>
        <h1 class="page-title">عقد القطعة رقم {{ currentPlotNo }}</h1>
        <p v-if="plot" class="page-sub">
          <span v-if="contractNo">رقم العقد {{ contractNo }}</span>
          <span v-if="contractNo && contractDate" class="sep"></span>
          <!-- <span v-if="contractDate">التاريخ {{ contractDate }}</span> -->
          <span>التاريخ {{ new Date().toLocaleDateString('en-GB') }}</span>
        </p>
      </div>

      <div class="pager" role="group" aria-label="التنقل بين العقود">
        <button
          class="pager-btn"
          :disabled="currentPlotNo <= 1"
          title="العقد السابق"
          @click="goToPlot(currentPlotNo - 1)"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
        <span class="pager-label">قطعة {{ currentPlotNo }}</span>
        <button
          class="pager-btn"
          :disabled="currentPlotNo >= MAX_PLOT"
          title="العقد التالي"
          @click="goToPlot(currentPlotNo + 1)"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
      </div>
    </section>

    <!-- Actions -->
    <div class="actions">
      <div class="actions-group">
        <button class="btn btn-primary" :disabled="busy || !plot" @click="handlePrint">
          <i :class="busy === 'print' ? 'pi pi-spin pi-spinner' : 'pi pi-print'"></i>
          <span>{{ busy === 'print' ? 'جاري تجهيز الملف...' : 'طباعة العقد' }}</span>
        </button>

        <button class="btn btn-outline" :disabled="busy || !plot" @click="handleDownload">
          <i :class="busy === 'download' ? 'pi pi-spin pi-spinner' : 'pi pi-download'"></i>
          <span>تحميل PDF</span>
        </button>

        <button class="btn btn-outline" :class="{ 'is-done': copied }" @click="copyShareLink">
          <i :class="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
          <span>{{ copied ? 'تم النسخ' : 'نسخ الرابط' }}</span>
        </button>
      </div>

      <div class="actions-group">
        <NuxtLink :to="`/plots/${currentPlotNo}`" class="btn btn-ghost">
          <i class="pi pi-tag"></i>
          <span class="hidden sm:inline">عرض السعر</span>
        </NuxtLink>

        <NuxtLink v-if="canEditContract" :to="`/contracts/${currentPlotNo}/edit`" class="btn btn-gold">
          <i class="pi pi-file-edit"></i>
          <span class="hidden sm:inline">تعديل العقد</span>
        </NuxtLink>

        <NuxtLink v-if="canEditPlot" :to="`/admin/plots/${currentPlotNo}/edit`" class="btn btn-ghost">
          <i class="pi pi-pencil"></i>
          <span class="hidden sm:inline">تعديل القطعة</span>
        </NuxtLink>

        <NuxtLink to="/plots" class="btn btn-ghost">
          <i class="pi pi-arrow-right"></i>
          <span>جدول القطع</span>
        </NuxtLink>
      </div>
    </div>

    <p v-if="errorMsg" class="notice">{{ errorMsg }}</p>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="paper-stage animate-fadeIn" aria-busy="true">
      <div class="paper bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-6">
          <div class="space-y-2">
            <FeaturesAppSkeleton width="14rem" height="1.75rem" rounded="lg" />
            <FeaturesAppSkeleton width="10rem" height="1rem" rounded="md" />
          </div>
          <div class="space-y-2 text-start">
            <FeaturesAppSkeleton width="8rem" height="1rem" rounded="md" />
            <FeaturesAppSkeleton width="6rem" height="1rem" rounded="md" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50/70 rounded-2xl space-y-3">
            <FeaturesAppSkeleton width="40%" height="1.25rem" rounded="md" />
            <FeaturesAppSkeleton width="70%" height="1rem" rounded="md" />
          </div>
          <div class="p-4 bg-slate-50/70 rounded-2xl space-y-3">
            <FeaturesAppSkeleton width="40%" height="1.25rem" rounded="md" />
            <FeaturesAppSkeleton width="80%" height="1rem" rounded="md" />
          </div>
        </div>
        <div class="space-y-3 pt-4">
          <FeaturesAppSkeleton width="30%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton width="100%" height="8rem" rounded="2xl" />
        </div>
        <div class="space-y-2 pt-4">
          <FeaturesAppSkeleton width="25%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton v-for="t in 4" :key="t" width="100%" height="1rem" rounded="sm" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !plot" class="state-card state-error">
      <i class="pi pi-exclamation-triangle state-icon"></i>
      <h3 class="state-title">تعذر العثور على القطعة رقم {{ currentPlotNo }}</h3>
      <p class="state-text">يرجى التحقق من صحة رقم القطعة في الرابط</p>
      <NuxtLink to="/plots" class="btn btn-primary">العودة لجدول القطع</NuxtLink>
    </div>

    <!-- Contract (unchanged) -->
    <div v-else class="paper-stage">
      <div ref="contractRef" class="paper">
        <ContractSheet
          :plot="plot"
          :buyer="buyer"
          :contract-no="contractNo"
          :contract-date="contractDate"
          :special-note="specialNote"
          :terms="terms"
          :format="formatCurrencyNumber"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrencyNumber } from '../../../../lib/format';
import {
  defaultContractTerms,
  type ContractPlot,
} from '../../../../server/utils/contractTerms';

const MAX_PLOT = 973;
const route = useRoute();

const currentPlotNo = computed(() =>
  Number.parseInt(route.params.plotNo as string, 10)
);

const {
  data: response,
  pending,
  error,
} = await useFetch<{
  success: boolean;
  data: ContractPlot;
  isAdmin: boolean;
  canEditContract?: boolean;
  canEditPlot?: boolean;
}>(() => `/api/plots/${currentPlotNo.value}`, { watch: [currentPlotNo] });

const plot = computed(() => response.value?.data ?? null);

const isAdmin = computed(() => !!response.value?.isAdmin);
const canEditContract = computed(() => !!response.value?.canEditContract || isAdmin.value);
const canEditPlot = computed(() => !!response.value?.canEditPlot || isAdmin.value);

const buyer = computed(() => {
  const p = plot.value;
  return {
    name: p?.buyerName || '',
    id: p?.buyerId || '',
    birthDate: p?.buyerBirthDate || '',
    phone: p?.buyerPhone || '',
  };
});

const contractNo = computed(() =>
  plot.value?.contractNo != null ? String(plot.value.contractNo) : ''
);
const contractDate = computed(() => plot.value?.contractDate || '');
const specialNote = computed(() => plot.value?.contractNote || '');
const terms = computed(() =>
  plot.value?.contractTerms?.length ? plot.value.contractTerms : defaultContractTerms
);

const goToPlot = async (num: number) => {
  if (num >= 1 && num <= MAX_PLOT) await navigateTo(`/contracts/${num}`);
};

// =========================================
// PDF: build an A4 file from the contract,
// then print it (or download it)
// =========================================
//
// npm i html2canvas-pro jspdf
//
// The contract is cloned off-screen. We search for the width at which the
// contract's height/width ratio equals the printable A4 ratio (200 x 287mm),
// so it fills the page without stretching or distorting anything.

const contractRef = ref<HTMLElement | null>(null);
const busy = ref<'' | 'print' | 'download'>('');
const errorMsg = ref('');

const A4_W = 210;
const A4_H = 297;
const MARGIN = 5;
const BOX_W = A4_W - MARGIN * 2; // 200mm
const BOX_H = A4_H - MARGIN * 2; // 287mm

const buildPdf = async (): Promise<Blob> => {
  const source = contractRef.value?.firstElementChild as HTMLElement | null;
  if (!source) throw new Error('Contract element not found');

  if (document.fonts?.ready) await document.fonts.ready;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);

  // Off-screen clone, rendered behind the page
  const host = document.createElement('div');
  host.setAttribute('dir', 'rtl');
  host.style.cssText =
    'position:fixed;top:0;left:0;z-index:-1;pointer-events:none;background:#fff;';
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    const target = BOX_H / BOX_W; // height / width of the printable area

    const ratioAt = (w: number) => {
      host.style.width = `${w}px`;
      return host.offsetHeight / w;
    };

    // ratio decreases as width grows: find the smallest width that fits
    let lo = 480;
    let hi = 1400;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      if (ratioAt(mid) > target) lo = mid;
      else hi = mid;
    }

    const width = hi;
    host.style.width = `${width}px`;
    const height = host.offsetHeight;

    const canvas = await html2canvas(host, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      width,
      height,
      windowWidth: Math.ceil(width),
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const imgW = BOX_W;
    const imgH = Math.min(BOX_H, (BOX_W * canvas.height) / canvas.width);

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      MARGIN,
      MARGIN,
      imgW,
      imgH,
      undefined,
      'FAST'
    );

    return pdf.output('blob');
  } finally {
    host.remove();
  }
};

const printBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  iframe.src = url;

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        // Fallback: open the PDF in a new tab so the user can print from there
        window.open(url, '_blank');
      }
    }, 300);
  };

  document.body.appendChild(iframe);

  setTimeout(() => {
    iframe.remove();
    URL.revokeObjectURL(url);
  }, 5 * 60 * 1000);
};

const handlePrint = async () => {
  if (busy.value) return;
  errorMsg.value = '';
  busy.value = 'print';
  try {
    printBlob(await buildPdf());
  } catch (err) {
    console.error('PDF generation failed:', err);
    errorMsg.value = 'تعذر إنشاء ملف PDF. حاول مرة أخرى.';
  } finally {
    busy.value = '';
  }
};

const handleDownload = async () => {
  if (busy.value) return;
  errorMsg.value = '';
  busy.value = 'download';
  try {
    const blob = await buildPdf();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-plot-${currentPlotNo.value}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  } catch (err) {
    console.error('PDF generation failed:', err);
    errorMsg.value = 'تعذر إنشاء ملف PDF. حاول مرة أخرى.';
  } finally {
    busy.value = '';
  }
};

// ---------- Copy share link ----------
const copied = ref(false);

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error('Failed to copy URL:', err);
  }
};
</script>

<style scoped>
.paper{
  border-radius: 1rem !important;
  overflow: hidden;
}
.contract-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-primary);
  font-family: 'Cairo', 'Expo Arabic', sans-serif;
}

/* Header */
.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-inline-start: 4px solid var(--accent-gold);
  border-radius: 1rem;
  overflow: hidden;
}
.page-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--brand-dark);
  line-height: 1.3;
}
.page-sub {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
.sep {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--accent-champagne);
}

/* Pager */
.pager {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--surface-warm);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
}
.pager-btn {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  color: var(--brand-dark);
  font-size: 0.75rem;
  transition: background-color 0.15s;
}
.pager-btn:hover:not(:disabled) { background: var(--brand-soft); }
.pager-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pager-label {
  min-width: 5rem;
  padding: 0 0.5rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--brand-dark);
}

/* Actions */
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.actions-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.btn:disabled { opacity: 0.6; cursor: wait; }
.btn:focus-visible,
.pager-btn:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--brand-primary) 35%, transparent);
  outline-offset: 2px;
}

.btn-primary {
  background: var(--brand-primary);
  color: #fff;
  box-shadow: 0 2px 6px rgb(18 107 88 / 0.25);
}
.btn-primary:hover:not(:disabled) { background: var(--brand-hover); }

.btn-outline {
  background: var(--brand-soft);
  border-color: var(--brand-secondary);
  color: var(--brand-dark);
}
.btn-outline:hover:not(:disabled) { background: #d6e5dd; }
.btn-outline.is-done {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
}

.btn-ghost {
  background: var(--surface-card);
  border-color: var(--border-default);
  color: var(--text-primary);
}
.btn-ghost:hover { background: var(--surface-warm); border-color: var(--accent-champagne); }
.btn-ghost .pi { color: var(--text-secondary); }

.btn-gold {
  background: var(--surface-warm);
  border-color: var(--accent-gold);
  color: #6b5429;
}
.btn-gold:hover { background: var(--accent-champagne); }

.notice {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #7a4b16;
  background: var(--surface-warm);
  border: 1px solid var(--accent-gold);
  border-radius: 0.75rem;
}

/* States */
.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: 1rem;
}
.state-icon { font-size: 2rem; color: var(--brand-primary); }
.state-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.state-text { margin-bottom: 0.75rem; font-size: 0.875rem; }
.state-error { background: var(--surface-warm); border-color: var(--accent-champagne); }
.state-error .state-icon { color: var(--accent-gold); }

/* Paper preview (contract itself is untouched) */
.paper-stage {
  padding: 1.5rem 0.75rem;
  background: var(--surface-warm);
  border: 1px solid var(--border-default);
  border-radius: 1rem;
}
.paper {
  max-width: 64rem;
  margin: 0 auto;
  background: var(--surface-card);
  border-radius: 0.375rem;
  box-shadow: 0 10px 30px rgb(23 74 64 / 0.12);
}
</style>