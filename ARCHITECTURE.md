# Maha Plan Sales Portal — Architecture & Build Brief for the Antigravity Agent

> Give this whole file to the Antigravity agent as the project brief (save it as `ARCHITECTURE.md` and `AGENTS.md` in the repo root, then prompt: "Read ARCHITECTURE.md and build it phase by phase, stopping after each phase for my review").

---

## 1. Goal

Build an **Arabic-first (RTL) web app** that reads live from a Google Sheet and shows plot sales data for the "مخطط المها / مها الشرق" development in clean pages, with:

1. **Public/staff viewing pages** – dashboard, plots table, blocks, zones.
2. **Plot detail view** – clicking any plot opens a full **price-quotation (عرض سعر) layout** like the reference screenshot (Sheet1 tab).
3. **Admin-only area** behind authentication, where the admin can **create / update / delete** plots. Every write goes back to the same Google Sheet.

**Source of truth:** the Google Sheet
`https://docs.google.com/spreadsheets/d/1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A`
(spreadsheet ID: `1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A`). No separate database holds plot data.

---

## 2. What is in the workbook (inspected)

| Tab | Purpose | Notes for the app |
|---|---|---|
| **Final** | Master list, **973 plots**, 41 blocks, header in **row 2**, data from row 3 | The main table. Rows 1 holds subtotals/links, ignore for data. |
| **Rep** | Summary report: Usage (سكنى / تجارى) × Status (مباع / محجوز / متاح للبيع) → area, avg price, total value, share %, count | Recreate as the dashboard; **compute in code from Final**, do not read Rep. |
| **Sheet1** | Single price-quotation template (عرض سعر) for one buyer & 1–10 plots | Defines the plot-detail / quotation layout and the business formulas. |

### 2.1 `Final` columns (row 2 headers → field names)

| Col | Header | Field | Type / notes |
|---|---|---|---|
| A | رقم الزون | `zone` | A1, A2, B1, B2 (43 rows blank) |
| B | BLOCK No. | `block` | int, 41 blocks |
| C | PLOT No. | `plotNo` | int **unique, 1–973 → use as public ID** |
| D | USAGE | `usage` | سكنى (930) / تجارى (37) / مرافق (6) |
| E | PLOT AREA (M²) | `area` | number |
| F | سعر بيع م2 | `pricePerM2` | number (input) |
| G | قيمة الارض | `landValue` | **formula** `=E*F` |
| H | السعي شامل الضريبة | `brokerage` | **formula** `=G*2.5%*1.15` |
| I | حالة السعي | `brokerageStatus` | كامل السعي / لايوجد |
| K | Available For Sale | `availableFlag` | `ok`/`OK`/`NO` (legacy, derive from L) |
| L | Status | `status` | مباع / محجوز / متاح للبيع |
| M | اسم المشتري | `buyerName` | **PII** |
| N | الهوية / السجل | `buyerId` | **PII** |
| O | رقم الجوال | `buyerPhone` | **PII** |
| P | رقم صك القطع | `deedNo` | **sensitive**, stored as number/text with spaces |
| Q | تاريخ الصك | `deedDate` | date |
| R | الفاتورة الضريبية | `invoice` | |
| S | الوضع الحالي | `currentState` | بانتظار فك الرهن |
| T | قيمة ضريبة التصرفات العقارية | `retTax` | **formula** `=G*5%` |
| U | الحالة | `handoverStatus` | تم الافراغ |
| V | تاريخ الافراغ | `handoverDate` | text `dd-mm-yyyy` |
| W | الملاحظات | `notes` | free text (e.g. "محجوز - محمد العواد") |
| Q1/R1 | صكوك مخطط المها | `deedsFolderUrl` | SharePoint folder link → admin only |

Columns J and X–AE are helper/empty, ignore.

### 2.2 Business formulas (implement once in `lib/pricing.ts`, unit-test them)

```
landValue    = area × pricePerM2
brokerage    = landValue × 2.5% × 1.15      // السعي شامل ضريبة القيمة المضافة (VAT 15%)
retTax       = landValue × 5%                // ضريبة التصرفات العقارية
```
Quotation totals = sums over selected plots. Quotation text blocks (from Sheet1):
- Check #1: *"يتم اصدار شيك مصدق بقيمة الارض باسم شركة القادسية الاولى"* → amount = land value
- Check #2: *"يتم اصدار شيك مصدق بقيمة السعي باسم شركة تارقيت العقارية"* → amount = brokerage
- *"يتم السداد المباشر لهيئة الضريبة العقارية من خلال رقم سداد يتم تزويدكم به قبل الافراغ للسداد"* → amount = RETT
- Attachments: *"صورة من شيك الارض وشيك السعي، الهوية او السجل التجاري – صورة الوكالة للموكل بالشراء"*
- Note: *"عرض السعر لمدة 7 ايام من تاريخ الاصدار وبعدها الحجز ملغي"*
- Footer: شركة تارقيت العقارية. Header: purple (#7030A0-ish) title bar "عرض سعر", Targt logo on the right, date on the left.
- Header facts: المخطط **4047**, مها الشرق, البائع شركة القادسية الاولى, المسوق شركة تارقيت العقارية. Keep these in `config/project.ts` (editable), not hard-coded in components.

### 2.3 Data-quality issues the agent must handle (found while inspecting)

- `deedNo` has float-precision values (e.g. `3022754992000000`) and some contain spaces → **always read as formatted strings** (`valueRenderOption=FORMATTED_VALUE`) and never parse as numbers.
- Phone numbers lack a leading 0 and one is 11 digits → display as-is, normalise only for search.
- `K` mixes `ok` / `OK` / `NO` → ignore it; **`status` (L) is authoritative**.
- 43 rows have empty `zone` → show "غير محدد".
- `Final!E1:H1` subtotal ranges stop at different rows (969 / 973) → **don't trust header subtotals**; compute everything from rows.
- `Rep` excludes the 6 "مرافق" plots (967 vs 973) → dashboard shows all usages, with مرافق as its own group.
- Arabic text may include kashida (ـ) and trailing spaces (e.g. `"فهد البليهد "`) → `normalizeArabic()` (trim, strip tatweel, unify أ/إ/آ→ا, ى/ي, ة/ه for search only).

---

## 3. Tech stack (Adapted to Nuxt 4)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Nuxt 4 (Vue 3) + Nitro Server + TypeScript** | Full-stack Vue 3 framework, server-side Sheets access via Nitro routes keeps credentials secure |
| UI | **Tailwind CSS + PrimeVue (Aura Theme) + PrimeIcons** | Modern, accessible, responsive UI with enterprise-grade data components |
| RTL / font | `<html lang="ar" dir="rtl">`, Google font **Cairo**, Tailwind logical utilities (`ms-`, `ps-`, `text-start`) | Arabic-first layout and typography |
| Tables | **PrimeVue DataTable** (virtual scroll, multi-filter, sort, export) | High performance for 973 rows, seamless Arabic filtering |
| Charts | **PrimeVue Chart / Chart.js** | Donut/bar for status & usage aggregations |
| Sheets access | **`googleapis`** (Sheets API v4) using a **Service Account** | Read + write, server-only inside Nitro |
| Auth | **Nitro Server Auth & Session** — Google OAuth / secure session restricted to `ADMIN_EMAILS` allowlist | Strict admin area protection |
| Validation | **Zod** | Shared schemas for plot inputs and API validation |
| Cache | **Nitro cachedEventHandler / Storage cache**, TTL 60 s | Protects Google Sheets API quota |
| PDF | Browser print CSS (`@media print`, A4) | Quotation print & save as PDF |
| Hosting | **Vercel / Node server** | |
| Tests | Vitest (pricing, normalisation, mapper) | |

---

## 4. Architecture

```
Browser (RTL Next.js UI)
   │  server components / server actions / route handlers
   ▼
Next.js server  ───────────────────────────────┐
   ├─ middleware.ts  → protects /admin/** and /api/admin/**   (Auth.js session + allowlist)
   ├─ lib/sheets/client.ts     service-account JWT → Sheets v4
   ├─ lib/sheets/mapper.ts     row ⇄ Plot  (column map by HEADER NAME, not fixed letter)
   ├─ lib/sheets/repo.ts       listPlots, getPlot, updatePlot, createPlot, deletePlot
   ├─ lib/pricing.ts           landValue / brokerage / retTax / totals
   ├─ lib/stats.ts             Rep-equivalent aggregations
   └─ lib/audit.ts             append-only log → "AuditLog" tab in the same sheet
   ▼
Google Sheet (Final tab = source of truth)
```

### 4.1 Google Sheets integration (critical)

1. In Google Cloud: enable **Google Sheets API**, create a **service account**, download JSON key.
2. **Share the sheet with the service account email as Editor** (the "anyone with link" setting is not enough for writes and is unreliable for reads).
3. Env vars (never commit; `.env.local` + hosting secrets):
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=            # keep \n escaped
SHEET_ID=1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A
SHEET_TAB_FINAL=Final
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
ADMIN_EMAILS=admin@example.com   # comma-separated
```
4. **Read:** one call `spreadsheets.values.get` on `Final!A2:W` with `valueRenderOption=FORMATTED_VALUE` (formulas return their computed values; dates as text). Row 2 = headers; build the column map from header text so inserting a column in the sheet doesn't break the app. Skip rows with empty `PLOT No.`.
5. **Write rules (protect the formulas):**
   - **Only write input columns**: `zone, block, plotNo, usage, area, pricePerM2, brokerageStatus, status, buyerName, buyerId, buyerPhone, deedNo, deedDate, invoice, currentState, handoverStatus, handoverDate, notes`.
   - **Never write** G, H, T (formulas). On **create**, copy formulas from the row above (`copyPaste` with `PASTE_FORMULA`, or write `=E{n}*F{n}`, `=G{n}*2.5%*1.15`, `=G{n}*5%`).
   - Use `values.update` with `USER_ENTERED` for single cells/ranges; use **row number resolved at write time** (re-read the plot's current row by `plotNo` immediately before writing, to avoid hitting a shifted row).
   - **Concurrency:** send an `updatedAt`/row-hash with the edit form; if the row changed since the form loaded, reject with a 409 and show "تم تعديل هذا السجل، أعد التحميل".
   - **Delete:** default = **soft delete** (set `status` to a hidden value and move to an `Archive` tab). Hard delete via `batchUpdate → deleteDimension` only after a typed confirmation ("اكتب رقم القطعة للتأكيد"). Never delete header rows.
   - After any write call `revalidateTag('plots')`.
6. **Audit log:** every create/update/delete appends `[timestamp, adminEmail, action, plotNo, before JSON, after JSON]` to an `AuditLog` tab (create it if missing).
7. **Rate limits:** all pages read through the cached `listPlots()`; the browser never talks to Google.

### 4.2 Security & privacy (important)

The sheet contains **buyer names, national IDs, phone numbers and deed numbers**.
- **Public pages must never receive PII.** Define `PublicPlot` (no `buyerName/buyerId/buyerPhone/deedNo/invoice/notes/deedsFolderUrl`) and strip server-side in `repo.listPublicPlots()`. Do not strip in the client.
- Decision to confirm with the owner (default below): **the whole site is staff-facing; non-admin visitors see public fields only** (zone, block, plot, usage, area, price/m², land value, brokerage, RETT, status). If prices must also be hidden publicly, toggle `PUBLIC_SHOW_PRICES=false`.
- Full record (buyer, deed, notes, SharePoint link) only appears to a logged-in admin, in the same quotation view.
- Security headers, `httpOnly` secure cookies, CSRF-safe server actions, Zod validation on every write, rate-limit `/api/admin/*`, no service-account key in the client bundle, `noindex` meta (`robots: { index: false }`).
- Admin check is enforced **in middleware AND again inside each server action / route handler** (`requireAdmin()`).

---

## 5. Routes & pages

```
app/
  layout.tsx                      RTL shell, nav, theme
  page.tsx                        Dashboard
  plots/page.tsx                  Plots table (filters, search, export)
  plots/[plotNo]/page.tsx         Full plot page = quotation layout  (deep link / print)
  @modal/(.)plots/[plotNo]/page.tsx   Intercepted route → same content in a dialog when clicked from lists
  blocks/page.tsx                 41 blocks grid
  blocks/[block]/page.tsx         Plots of one block
  zones/page.tsx                  A1 / A2 / B1 / B2 overview
  quote/page.tsx                  Multi-plot quotation builder (Sheet1 equivalent)
  login/page.tsx                  Admin sign-in
  admin/page.tsx                  Admin overview (counts, recent audit entries)
  admin/plots/page.tsx            Editable table (inline status, edit, delete)
  admin/plots/new/page.tsx        Create plot
  admin/plots/[plotNo]/edit/page.tsx  Edit form
  admin/audit/page.tsx            Audit log viewer
  api/revalidate/route.ts         POST (secret) – force refresh after manual sheet edits
```

### 5.1 Dashboard (`/`) — replaces the **Rep** tab
- KPI cards: total plots (973), total area, total land value, avg price/m², sold / reserved / available counts.
- **Usage × Status table** identical to Rep: rows = سكنى/تجارى/مرافق × مباع/محجوز/متاح للبيع; cols = area, avg price/m² (`value/area`), total value, share % (of total area), plot count.
- Charts: donut (status by count), stacked bar (status by block), bar (value by usage).
- Clicking any KPI/table cell/chart slice **navigates to `/plots?usage=…&status=…`** (pre-filtered).
- "Last synced HH:mm" + manual refresh button (admin only).

### 5.2 Plots table (`/plots`)
- Columns: block, plot, zone, usage, area, price/m², land value, brokerage, RETT, status badge (🟢 متاح / 🟡 محجوز / 🔴 مباع).
- Filters (URL search params, shareable): status, usage, zone, block, area range, price range; search by plot no. / block (and, for admin, buyer name/phone).
- Sort, virtualized rows, sticky header, CSV/Excel export of the **current filtered view** (admin export includes full fields).
- **Row click → opens plot quotation modal** (see 5.3).

### 5.3 Plot detail = **quotation (عرض سعر) view** ← the "click a plot, show all its data like this screen" requirement

Render exactly the Sheet1 layout (RTL, bordered tables, purple header):

```
┌───────────────────────────────────────────────────────────┐
│ [date]                 ███ عرض سعر ███           [Targt logo]│
├───────────────────────────────────────────────────────────┤
│ المخطط 4047 | مها الشرق | البائع: شركة القادسية الاولى | المسوق: شركة تارقيت العقارية │
│ المشتري: <buyer>   (admin only / only if status≠متاح)   رقم الجوال: <phone> (admin) │
├──────────┬──────────┬─────────┬────────────┬────────┬───────────────┬──────────────┤
│ رقم البلك │ رقم القطعه │ المساحه │ سعر بيع المتر │ القيمة │ السعي شامل الضريبة │ ضريبة التصرفات │
│   <block> │  <plot>   │ <area>  │ <price/m²> │<value> │  <brokerage>  │   <RETT>     │
├──────────┴──────────┴─────────┴────────────┼────────┼───────────────┼──────────────┤
│ الاجمالي                                    │ total  │ total         │ total        │
├─────────────────────────────────────────────┴────────┴───────────────┴──────────────┤
│ قيمة الارض      │ <land value>   → يتم اصدار شيك مصدق بقيمة الارض باسم شركة القادسية الاولى │
│ سعي البيع       │ <brokerage>    → يتم اصدار شيك مصدق بقيمة السعي باسم شركة تارقيت العقارية │
│ ضريبة التصرفات  │ <RETT>         → يتم السداد المباشر لهيئة الضريبة العقارية … │
│ المرفقات المطلوبة … │ ملحوظة: عرض السعر لمدة 7 ايام … │ شركة تارقيت العقارية │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
Additional plot facts shown below the quotation card in a "بيانات القطعة" section: zone, usage, status, brokerage status (كامل السعي / لايوجد), current state (بانتظار فك الرهن), handover status/date (تم الافراغ), notes.
**Admin-only extra panel:** buyer name/ID/phone, deed no./date, invoice, notes, "open deeds folder" link, **Edit / Delete buttons**, and last audit entries for this plot.
Actions: **Print / Save as PDF** (A4 print stylesheet), copy share link, prev/next plot arrows.
Numbers use Western digits with thousands separators and 2 decimals (`Intl.NumberFormat('en-US')`), currency label "ر.س".

### 5.4 Quotation builder (`/quote`)
Same layout, but the user picks **1–10 plots** (multi-select from the table via a "إضافة لعرض سعر" button), enters buyer name/phone, optionally overrides price/m² per row (like Sheet1's editable E column), sees live totals, prints/PDFs it. Nothing is saved to the sheet. Date = today.

### 5.5 Blocks / Zones
- `/blocks`: grid of 41 block cards with a mini status bar (available/reserved/sold counts) → `/blocks/[n]` lists its plots as clickable tiles coloured by status.
- `/zones`: 4 cards (A1, A2, B1, B2) with the same aggregates, link to filtered table.
- (Optional later) a site-plan SVG/map if the user provides a plan image; tile grid is the default.

### 5.6 Admin
- `/login`: single "Sign in with Google" button (allowlist). Non-allowlisted accounts get an "غير مصرح" page. Session 8 h.
- `/admin/plots`: same table + inline status dropdown, **edit** and **delete** icons per row, bulk status change, "إضافة قطعة".
- Edit form (react-hook-form + Zod): all input columns; `plotNo` read-only after creation; formula fields shown read-only with live preview; confirm dialog with before/after diff; success toast; optimistic UI with rollback on error.
- Delete: dialog requiring typing the plot number; default soft-delete to `Archive` tab.
- `/admin/audit`: table of AuditLog entries with filters.

---

## 6. Project structure

```
/app                  (routes above)
/components
  ui/                 shadcn
  plots/  PlotsTable, PlotFilters, StatusBadge, PlotQuotation, PlotAdminPanel
  charts/ StatusDonut, StatusByBlockBar, UsageValueBar
  admin/  PlotForm, DeleteDialog, AuditTable
/lib
  sheets/ client.ts, mapper.ts, repo.ts, columns.ts
  pricing.ts, stats.ts, arabic.ts, format.ts, audit.ts, auth.ts
/config/project.ts    project name, plan no. 4047, seller, marketer, texts, logo path, VAT/commission/RETT rates
/schemas/plot.ts      Zod: Plot, PublicPlot, PlotInput
/tests                pricing.test.ts, mapper.test.ts, e2e/*.spec.ts
/public/logo-targt.png
```
Rates (`2.5%`, `15%`, `5%`) live in `config/project.ts`, shared by quotation + admin preview.

---

## 7. Build phases (agent should stop for review after each)

1. **Scaffold & config** – Next.js, Tailwind, shadcn, RTL + Cairo font, env schema, `config/project.ts`.
2. **Sheets read layer** – client, header-based mapper, `listPlots/getPlot`, caching, `PublicPlot` stripping; unit tests with a fixture exported from the sheet (anonymised).
3. **Dashboard + Plots table + filters** (public data only).
4. **Plot quotation view** (modal via intercepted route + full page + print CSS). Match the screenshot layout; verify numbers against Sheet1 for plots 673 (300 m² × 1,700 → 510,000 / 14,662.50 / 25,500) and 881 (325 × 1,800 → 585,000 / 16,818.75 / 29,250).
5. **Blocks & Zones pages**, quotation builder.
6. **Auth** – Auth.js Google + allowlist, middleware, `requireAdmin()`, login page.
7. **Admin CRUD** – create/update/soft-delete/hard-delete, formula preservation, concurrency check, audit log.
8. **Hardening & QA** – PII leak test (public JSON must contain no buyer/deed fields), Playwright e2e (non-admin blocked from `/admin` and from write APIs; admin edit round-trips to the sheet), Lighthouse, a11y, README with the Google setup steps.

## 8. Acceptance checklist

- [ ] All 973 plots load from the Google Sheet; changing a cell in the sheet appears in the app within ~60 s (or instantly after refresh).
- [ ] Dashboard Usage × Status numbers match the **Rep** tab (e.g. residential sold: 31 plots, 9,805.56 m², 15,017,089.94; total 660,177,944.72 for the 967 non-facility plots).
- [ ] Clicking any plot anywhere (table, block tile, chart drill-down) shows the quotation layout with correct formulas; direct URL `/plots/673` works and prints cleanly on A4.
- [ ] A logged-out visitor can't see buyer/ID/phone/deed data in the UI **or** in network responses/HTML source.
- [ ] Only allow-listed admin can reach `/admin/**` and call write endpoints; others get 401/403.
- [ ] Edit/Delete update the sheet, leave formula columns G/H/T intact, and add an AuditLog row.
- [ ] RTL layout is correct everywhere (no mirrored icons for numbers, tables right-to-left, mixed Arabic/English/numbers render properly).
- [ ] No secrets in the repo or client bundle.

## 9. Open questions for the owner (agent should use defaults if unanswered)

1. Should **prices be visible to non-admin visitors**, or only status/area? *(default: visible but admin can control it)*
2. Should the site itself require login for staff (separate from admin)? *(default: public read, admin write)*
3. Delete behaviour: **soft delete to Archive** (default) or permanent row deletion?
4. Is a site-plan image/GeoJSON available for an interactive map? *(default: block tile grid  but admin can control it)*
5. Logo file for شركة تارقيت العقارية (the screenshot logo) – needed in `/public  but admin can control it`.
