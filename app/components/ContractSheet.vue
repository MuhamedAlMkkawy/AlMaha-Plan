<template>
  <article class="contract-sheet" dir="rtl">
    <!-- Letterhead -->
    <header class="cs-head">
      <div class="cs-brand">
        <div class="cs-brand-name">مشروع مخطط مها الشرق العقاري</div>
        <div class="cs-brand-seller">{{ seller }}</div>
      </div>
      <dl class="cs-meta">
        <div>
          <dt>رقم العقد</dt>
          <dd class="blank min-w-20">{{ contractNo }}</dd>
        </div>
        <div>
          <dt>التاريخ</dt>
          <dd class="blank min-w-24 tabular-nums">{{ contractDate }}</dd>
        </div>
      </dl>
    </header>

    <h1 class="cs-title">عقد شراء (إفراغ فوري)</h1>
    <p class="cs-intro">تم إبرام هذا العقد لغرض شراء العقار المحدد بياناته في هذا العقد، بين كل من:</p>

    <!-- Parties -->
    <section class="cs-parties">
      <div class="cs-party">
        <h2>البائع</h2>
        <p class="cs-party-name">{{ seller }}.</p>
      </div>

      <div class="cs-party cs-buyer">
        <h2>المشتري</h2>
        <dl class="cs-fields">
          <div class="cs-field cs-field-wide">
            <dt>الاسم</dt>
            <dd class="blank">{{ buyer.name }}</dd>
          </div>
          <div class="cs-field">
            <dt>الهوية الوطنية</dt>
            <dd class="blank tabular-nums">{{ buyer.id }}</dd>
          </div>
          <div class="cs-field">
            <dt>تاريخ الميلاد</dt>
            <dd class="blank tabular-nums">{{ buyer.birthDate }}</dd>
          </div>
          <div class="cs-field">
            <dt>الهاتف المحمول</dt>
            <dd class="blank tabular-nums" dir="ltr">{{ buyer.phone }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Property -->
    <h2 class="cs-section">بيانات العقار</h2>
    <table class="cs-table">
      <tbody>
        <tr>
          <th>العقار</th>
          <td class="tabular-nums">
            قطعة رقم {{ plot.plotNo }} بلك {{ plot.block }} / بمساحة {{ fmt(plot.area) }} م²
          </td>
        </tr>
        <tr>
          <th>ثمن الشراء</th>
          <td class="tabular-nums">{{ fmt(plot.landValue) }} ريال سعودي</td>
        </tr>
        <tr>
          <th>مبلغ الضريبة</th>
          <td class="tabular-nums">{{ fmt(plot.retTax) }} ريال سعودي</td>
        </tr>
        <tr>
          <th>أتعاب الوساطة</th>
          <td class="tabular-nums">{{ fmt(plot.brokerage) }} ريال سعودي</td>
        </tr>
        <tr>
          <th>بيان خاص</th>
          <td class="cs-note">{{ specialNote }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Terms -->
    <h2 class="cs-section">الشروط والأحكام العامة</h2>
    <ol class="cs-terms">
      <li v-for="(term, i) in terms" :key="i">{{ term }}</li>
    </ol>

    <p class="cs-closing">وبالله التوفيق، وهو خير الشاهدين.</p>

    <!-- Signatures -->
    <section class="cs-signatures">
      <div class="cs-sign">
        <div class="cs-sign-label">البائع</div>
        <div class="cs-sign-box"></div>
      </div>
      <div class="cs-sign">
        <div class="cs-sign-label">المشتري</div>
        <div class="cs-sign-box"></div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
interface Props {
  plot: {
    plotNo: number | string;
    block: string | number;
    area: number;
    landValue: number;
    retTax: number;
    brokerage: number;
  };
  buyer?: { name?: string; id?: string; birthDate?: string; phone?: string };
  contractNo?: string | number;
  contractDate?: string;
  specialNote?: string;
  terms: string[];
  seller?: string;
  /** Pass your own formatter (e.g. formatCurrencyNumber) to keep numbers consistent with the rest of the app */
  format?: (n: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  buyer: () => ({ name: '', id: '', birthDate: '', phone: '' }),
  contractNo: '',
  contractDate: '',
  specialNote: '',
  seller: 'شركة القادسية الأولى العقارية',
  format: undefined,
});

const fmt = (n: number) =>
  props.format ? props.format(n) : new Intl.NumberFormat('en-US').format(Number(n) || 0);
</script>

<style>
.contract-sheet {
  --cs-accent: #7030a0;
  --cs-accent-dark: #532277;
  --cs-tint: #f4edf9;
  --cs-line: #cbd5e1;
  --cs-ink: #0f172a;
  --cs-muted: #64748b;

  width: 100%;
  background: #fff;
  color: var(--cs-ink);
  border: 1px solid #e2e8f0;
  border-top: 6px solid var(--cs-accent);
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.06);
  padding: clamp(1.5rem, 4vw, 3.5rem);
  font-size: 15px;
  line-height: 2;
}

/* Letterhead */
.contract-sheet .cs-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--cs-line);
}
.contract-sheet .cs-brand-name {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--cs-accent);
  line-height: 1.5;
}
.contract-sheet .cs-brand-seller {
  font-size: 0.8rem;
  color: var(--cs-muted);
}
.contract-sheet .cs-meta {
  display: flex;
  gap: 1.5rem;
  margin: 0;
}
.contract-sheet .cs-meta div {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.contract-sheet .cs-meta dt {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--cs-muted);
}
.contract-sheet .cs-meta dd {
  margin: 0;
}

.contract-sheet .cs-title {
  margin: 1.75rem 0 0.5rem;
  text-align: center;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 900;
  line-height: 1.5;
}
.contract-sheet .cs-intro {
  margin: 0 0 1.25rem;
  text-align: center;
  font-weight: 600;
  color: #334155;
}

/* Fill-in line */
.contract-sheet .blank {
  display: inline-block;
  min-height: 1.9em;
  padding: 0 0.5rem;
  text-align: center;
  font-weight: 700;
  border-bottom: 1px dotted #64748b;
}

/* Parties */
.contract-sheet .cs-parties {
  display: grid;
  grid-template-columns: 1fr 2.4fr;
  gap: 1rem;
}
.contract-sheet .cs-party {
  border: 1px solid var(--cs-line);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem 1rem;
}
.contract-sheet .cs-party h2 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--cs-accent);
}
.contract-sheet .cs-party-name {
  margin: 0;
  font-weight: 700;
}
.contract-sheet .cs-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem 1.25rem;
  margin: 0;
}
.contract-sheet .cs-field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.contract-sheet .cs-field-wide {
  grid-column: 1 / -1;
}
.contract-sheet .cs-field dt {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cs-muted);
  line-height: 1.6;
}
.contract-sheet .cs-field dd {
  margin: 0;
  display: block;
  width: 100%;
}

/* Section headings */
.contract-sheet .cs-section {
  margin: 1.75rem 0 0.5rem;
  padding-inline-start: 0.75rem;
  border-inline-start: 4px solid var(--cs-accent);
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.6;
}

/* Property table */
.contract-sheet .cs-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--cs-line);
}
.contract-sheet .cs-table th,
.contract-sheet .cs-table td {
  border: 1px solid var(--cs-line);
  padding: 0.35rem 1rem;
}
.contract-sheet .cs-table th {
  width: 24%;
  background: var(--cs-tint);
  color: var(--cs-accent-dark);
  font-weight: 800;
  text-align: start;
  white-space: nowrap;
}
.contract-sheet .cs-table td {
  font-weight: 700;
}
.contract-sheet .cs-table .cs-note {
  height: 2.75rem;
  font-weight: 500;
}

/* Terms */
.contract-sheet .cs-terms {
  list-style: none;
  counter-reset: term;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.contract-sheet .cs-terms li {
  counter-increment: term;
  position: relative;
  padding-inline-start: 2.5rem;
  text-align: justify;
  break-inside: avoid;
}
.contract-sheet .cs-terms li::before {
  content: counter(term);
  position: absolute;
  inset-inline-start: 0;
  top: 0.45rem;
  width: 1.65rem;
  height: 1.65rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--cs-tint);
  color: var(--cs-accent-dark);
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1;
}

.contract-sheet .cs-closing {
  margin: 1.75rem 0 0;
  text-align: center;
  font-weight: 800;
}

/* Signatures */
.contract-sheet .cs-signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.25rem;
  break-inside: avoid;
}
.contract-sheet .cs-sign {
  border: 1px solid var(--cs-line);
  border-radius: 0.75rem;
  overflow: hidden;
}
.contract-sheet .cs-sign-label {
  padding: 0.25rem 1rem;
  background: var(--cs-tint);
  color: var(--cs-accent-dark);
  font-weight: 800;
  text-align: center;
  border-bottom: 1px solid var(--cs-line);
}
.contract-sheet .cs-sign-box {
  height: 6.5rem;
}

@media (max-width: 720px) {
  .contract-sheet .cs-parties,
  .contract-sheet .cs-fields {
    grid-template-columns: 1fr;
  }
  .contract-sheet .cs-table th {
    white-space: normal;
  }
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  .contract-sheet {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 0 !important;
    border-top: 4px solid var(--cs-accent) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0.5rem 0 0 !important;
    font-size: 11.5px !important;
    line-height: 1.85 !important;
  }
  .contract-sheet .cs-parties {
    grid-template-columns: 1fr 2.4fr;
  }
  .contract-sheet .cs-fields {
    grid-template-columns: repeat(3, 1fr);
  }
  .contract-sheet .cs-sign-box {
    height: 5rem;
  }
}
</style>