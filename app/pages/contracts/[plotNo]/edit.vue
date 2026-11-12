
<template>
  <div class="w-full space-y-6 pb-28">

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/contracts/${plotNo}`"
          class="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
        >
          <i class="pi pi-arrow-right"></i>
          <span>العودة للعقد</span>
        </NuxtLink>

        <div>
          <h1 class="text-lg sm:text-xl font-black text-slate-900">
            تعديل عقد القطعة {{ plotNo }}
          </h1>
          <p v-if="plot" class="text-xs text-slate-500">
            بلك {{ plot.block }} · {{ fmt(plot.area) }} م²
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          @click="tab = t.key"
          class="px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors"
          :class="tab === t.key
            ? 'bg-[#7030A0] text-white'
            : 'text-slate-600 hover:bg-slate-100'"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="bg-white rounded-2xl p-12 text-center text-slate-500"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-[#7030A0]"></i>
      <p class="mt-3 font-bold">جاري تحميل بيانات العقد...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error || !plot"
      class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800"
    >
      <i class="pi pi-exclamation-triangle text-3xl mb-2"></i>
      <h3 class="font-bold text-lg">
        تعذر العثور على القطعة رقم {{ plotNo }}
      </h3>
      <p class="text-sm mt-2 mb-4">
        يرجى التحقق من رقم القطعة أو الاتصال بالخادم.
      </p>
      <NuxtLink to="/plots" class="btn-primary">
        العودة لجدول القطع
      </NuxtLink>
    </div>

    <!-- Unauthorized -->
    <div
      v-else-if="!isAdmin"
      class="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center text-amber-900 font-bold"
    >
      <i class="pi pi-lock text-3xl mb-3"></i>
      <p>هذه الصفحة للمسؤولين فقط.</p>
      <NuxtLink
        :to="`/contracts/${plotNo}`"
        class="inline-block mt-4 text-sm underline"
      >
        العودة للعقد
      </NuxtLink>
    </div>

    <template v-else>

      <!-- Edit tab -->
      <form
        v-if="tab === 'edit'"
        class="space-y-6"
        @submit.prevent="save"
      >

        <!-- Contract information -->
        <section class="panel">
          <h2 class="panel-title">بيانات العقد</h2>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="field">
              <span>رقم العقد</span>
              <input
                v-model.trim="form.contractNo"
                type="text"
                inputmode="numeric"
                class="input tabular-nums"
              />
            </label>

            <label class="field">
              <span>تاريخ العقد</span>
              <input
                v-model="form.contractDate"
                type="text"
                placeholder="1448/01/01 هـ"
                class="input tabular-nums"
              />
            </label>
          </div>
        </section>

        <!-- Buyer information -->
        <section class="panel">
          <h2 class="panel-title">بيانات المشتري</h2>

          <div class="grid gap-4 space-y-2 sm:grid-cols-2 lg:grid-cols-4">

            <label class="field sm:col-span-2">
              <span>الاسم</span>
              <input
                v-model.trim="form.buyerName"
                type="text"
                class="input !text-start"
              />
            </label>

            <label class="field">
              <span>الهوية الوطنية</span>
              <input
                v-model.trim="form.buyerId"
                type="text"
                inputmode="numeric"
                maxlength="10"
                class="input tabular-nums"
                :class="{ 'input-error': idError }"
              />
              <small v-if="idError" class="text-rose-600">
                يجب أن تتكون الهوية من 10 أرقام
              </small>
            </label>

            <label class="field">
              <span>تاريخ الميلاد</span>
              <input
                v-model="form.buyerBirthDate"
                type="text"
                placeholder="1400/01/01"
                class="input tabular-nums"
              />
            </label>

            <label class="field">
              <span>الهاتف المحمول</span>
              <input
                v-model.trim="form.buyerPhone"
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                class="input tabular-nums text-right"
              />
            </label>

          </div>
        </section>

        <!-- Special note -->
        <section class="panel">
          <h2 class="panel-title">بيان خاص</h2>

          <textarea
            v-model="form.contractNote"
            rows="3"
            class="input"
            placeholder="يظهر في خانة بيان خاص داخل جدول العقار"
          ></textarea>
        </section>

        <!-- Contract terms -->
        <section class="panel">

          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 class="panel-title !mb-0">
                الشروط والأحكام
              </h2>

              <p class="text-xs text-slate-500 mt-1">
                {{ isCustomTerms ? 'شروط مخصصة لهذا العقد' : 'الشروط الافتراضية' }}
                · {{ form.terms.length }} بنود
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="btn-light"
                @click="addTerm"
              >
                <i class="pi pi-plus text-xs"></i>
                إضافة بند
              </button>

              <button
                type="button"
                class="btn-light"
                :disabled="!isCustomTerms"
                @click="resetTerms"
              >
                <i class="pi pi-refresh text-xs"></i>
                استعادة الافتراضي
              </button>
            </div>
          </div>

          <ol class="space-y-3">
            <li
              v-for="(_, i) in form.terms"
              :key="i"
              class="flex gap-3 items-start"
            >
              <span
                class="mt-2 grid place-items-center w-7 h-7 shrink-0 rounded-full bg-[#f4edf9] text-[#532277] text-xs font-extrabold"
              >
                {{ i + 1 }}
              </span>

              <textarea
                v-model="form.terms[i]"
                rows="3"
                class="input flex-1 leading-7"
              ></textarea>

              <div class="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  class="icon-btn"
                  :disabled="i === 0"
                  title="تحريك للأعلى"
                  @click="moveTerm(i, -1)"
                >
                  <i class="pi pi-arrow-up text-xs"></i>
                </button>

                <button
                  type="button"
                  class="icon-btn"
                  :disabled="i === form.terms.length - 1"
                  title="تحريك للأسفل"
                  @click="moveTerm(i, 1)"
                >
                  <i class="pi pi-arrow-down text-xs"></i>
                </button>

                <button
                  type="button"
                  class="icon-btn text-rose-600"
                  title="حذف البند"
                  @click="removeTerm(i)"
                >
                  <i class="pi pi-trash text-xs"></i>
                </button>
              </div>
            </li>
          </ol>

          <p
            v-if="!form.terms.length"
            class="text-sm text-slate-500 text-center py-6"
          >
            لا توجد بنود. أضف بندًا أو استعد الشروط الافتراضية.
          </p>

        </section>
      </form>

      <!-- Contract preview -->
      <div v-else-if="tab === 'preview'">
        <ContractSheet
          :plot="plot"
          :buyer="{
            name: form.buyerName,
            id: form.buyerId,
            birthDate: form.buyerBirthDate,
            phone: form.buyerPhone
          }"
          :contract-no="form.contractNo"
          :contract-date="form.contractDate"
          :special-note="form.contractNote"
          :terms="cleanTerms"
          :format="fmt"
        />
      </div>

    </template>

    <!-- Sticky save bar -->
    <div
      v-if="plot && isAdmin && !pending && !error"
      class="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

        <div
          class="text-sm font-semibold"
          :class="message.type === 'error'
            ? 'text-rose-700'
            : 'text-emerald-700'"
        >
          <span v-if="message.text">
            {{ message.text }}
          </span>

          <span v-else-if="dirty" class="text-amber-700">
            توجد تغييرات غير محفوظة
          </span>

          <span v-else>
            جميع التغييرات محفوظة
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/contracts/${plotNo}`"
            class="btn-light"
          >
            إلغاء
          </NuxtLink>

          <button
            type="button"
            class="btn-primary"
            :disabled="saving || !dirty || !!idError"
            @click="save"
          >
            <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"></i>
            <span>{{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

// =====================================================
// IMPORTS
// =====================================================

import {
  defaultContractTerms,
  type ContractPlot,
} from '../../../../server/utils/contractTerms';

// =====================================================
// ROUTE
// =====================================================

const route = useRoute();

const plotNo = computed(() =>
  Number.parseInt(route.params.plotNo as string, 10)
);

// =====================================================
// FETCH CONTRACT DATA
// =====================================================

const {
  data: response,
  pending,
  error,
  refresh,
} = await useFetch<{
  success: boolean;
  data: ContractPlot;
  isAdmin: boolean;
}>(
  () => `/api/plots/${plotNo.value}`,
  {
    watch: [plotNo],
  }
);

// =====================================================
// COMPUTED DATA
// =====================================================

const plot = computed(() => response.value?.data ?? null);

const isAdmin = computed(() =>
  !!response.value?.isAdmin
);

const fmt = (
  n: number | string | null | undefined
) => new Intl.NumberFormat('en-US').format(Number(n) || 0);

// =====================================================
// TABS
// =====================================================

const tabs = [
  { key: 'edit', label: 'تحرير' },
  { key: 'preview', label: 'معاينة' },
] as const;

const tab = ref<'edit' | 'preview'>('edit');

// =====================================================
// FORM STATE
// =====================================================

const form = reactive({
  contractNo: '',
  contractDate: '',
  buyerName: '',
  buyerId: '',
  buyerBirthDate: '',
  buyerPhone: '',
  contractNote: '',
  terms: [] as string[],
});

const snapshot = ref('');

const serialize = () =>
  JSON.stringify({
    ...form,
    terms: [...form.terms],
  });

// Populate form using API data
const fillForm = (p: ContractPlot) => {
  form.contractNo =
    p.contractNo != null ? String(p.contractNo) : '';

  form.contractDate = p.contractDate || '';
  form.buyerName = p.buyerName || '';
  form.buyerId = p.buyerId || '';
  form.buyerBirthDate = p.buyerBirthDate || '';
  form.buyerPhone = p.buyerPhone || '';
  form.contractNote = p.contractNote || '';

  form.terms = p.contractTerms?.length
    ? [...p.contractTerms]
    : [...defaultContractTerms];

  snapshot.value = serialize();
};

// Automatically populate when data arrives or changes
watch(
  plot,
  (p) => {
    if (p) fillForm(p);
  },
  { immediate: true }
);

// =====================================================
// VALIDATION & COMPUTED FORM VALUES
// =====================================================

const dirty = computed(() =>
  serialize() !== snapshot.value
);

const idError = computed(() =>
  !!form.buyerId && !/^\d{10}$/.test(form.buyerId)
);

const cleanTerms = computed(() =>
  form.terms
    .map((t) => t.trim())
    .filter(Boolean)
);

const isCustomTerms = computed(() =>
  JSON.stringify(cleanTerms.value) !==
  JSON.stringify(defaultContractTerms)
);

// =====================================================
// CONTRACT TERMS EDITING
// =====================================================

const addTerm = () => {
  form.terms.push('');
};

const removeTerm = (i: number) => {
  form.terms.splice(i, 1);
};

const moveTerm = (i: number, dir: -1 | 1) => {
  const j = i + dir;

  if (j < 0 || j >= form.terms.length) return;

  [form.terms[i], form.terms[j]] = [
    form.terms[j],
    form.terms[i],
  ];
};

const resetTerms = () => {
  if (
    confirm(
      'سيتم استبدال البنود الحالية بالشروط الافتراضية. متابعة؟'
    )
  ) {
    form.terms = [...defaultContractTerms];
  }
};

// =====================================================
// SAVE CONTRACT
// =====================================================

const saving = ref(false);

const message = reactive<{
  type: 'ok' | 'error';
  text: string;
}>({
  type: 'ok',
  text: '',
});

const save = async () => {
  if (saving.value || idError.value || !dirty.value) return;

  saving.value = true;
  message.text = '';

  try {
    await $fetch(
      `/api/admin/plots/${plotNo.value}/contract`,
      {
        method: 'PATCH',
        body: {
          contractNo: form.contractNo,
          contractDate: form.contractDate,
          buyerName: form.buyerName,
          buyerId: form.buyerId,
          buyerBirthDate: form.buyerBirthDate,
          buyerPhone: form.buyerPhone,
          contractNote: form.contractNote,

          // null means use default terms
          contractTerms: isCustomTerms.value
            ? cleanTerms.value
            : null,
        },
      }
    );

    // Refresh data from the server
    await refresh();
    await nextTick();

    snapshot.value = serialize();

    message.type = 'ok';
    message.text = 'تم حفظ العقد بنجاح';

  } catch (e: unknown) {
    const err = e as {
      data?: {
        statusMessage?: string;
        message?: string;
      };
      message?: string;
    };

    message.type = 'error';

    message.text =
      err.data?.statusMessage ||
      err.data?.message ||
      err.message ||
      'تعذر حفظ العقد، حاول مرة أخرى';

  } finally {
    saving.value = false;
  }
};

// =====================================================
// UNSAVED CHANGES PROTECTION
// =====================================================

onBeforeRouteLeave(() => {
  if (
    dirty.value &&
    !confirm(
      'لديك تغييرات غير محفوظة. هل تريد المغادرة؟'
    )
  ) {
    return false;
  }
});

const warnBeforeUnload = (e: BeforeUnloadEvent) => {
  if (dirty.value) {
    e.preventDefault();
    e.returnValue = '';
  }
};

onMounted(() => {
  window.addEventListener(
    'beforeunload',
    warnBeforeUnload
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    'beforeunload',
    warnBeforeUnload
  );
});

</script>

<style scoped>

.panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.5rem;
}

.panel-title {
  margin-bottom: 1rem;
  padding-inline-start: 0.75rem;
  border-inline-start: 4px solid #7030a0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
}

.input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.65rem;
  background: #fff;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 500;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input:focus {
  outline: none;
  border-color: #7030a0;
  box-shadow: 0 0 0 3px rgb(112 48 160 / 0.15);
}

.input-error {
  border-color: #e11d48;
}

.btn-light {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #fff;
  color: #334155;
  font-size: 0.8rem;
  font-weight: 700;
}

.btn-light:hover:not(:disabled) {
  background: #f8fafc;
}

.btn-light:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  background: #7030a0;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 10px rgb(112 48 160 / 0.18);
  transition: background 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: #532277;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-btn {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #fff;
  color: #475569;
}

.icon-btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

</style>
