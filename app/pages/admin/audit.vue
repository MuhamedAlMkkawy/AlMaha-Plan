
<template>
  <div dir="rtl" class="min-h-screen space-y-7 pb-10">

    <!-- ================= HEADER ================= -->
    <header class="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
      <div class="absolute inset-y-0 right-0 w-1.5 bg-[#7030A0]"></div>
      <div class="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-purple-50/80 blur-3xl pointer-events-none"></div>

      <div class="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-5 sm:p-7">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs font-semibold">
            <NuxtLink to="/admin" class="text-slate-400 transition hover:text-[#7030A0]">
              الإدارة
            </NuxtLink>
            <i class="pi pi-angle-left text-[10px] text-slate-300"></i>
            <span class="text-[#7030A0]">سجل العمليات</span>
          </div>

          <div class="mt-5 flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7030A0]/10 text-[#7030A0]">
              <i class="pi pi-history text-xl"></i>
            </div>

            <div class="min-w-0">
              <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                سجل العمليات
              </h1>
              <p class="mt-1.5 max-w-2xl text-xs sm:text-sm leading-6 text-slate-500">
                متابعة وتدقيق جميع العمليات التي تمت داخل النظام، مع تفاصيل التعديلات وهوية منفذ كل عملية.
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            سجل تدقيق مركزي لجميع العمليات
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <NuxtLink
            to="/admin/employees"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#7030A0]"
          >
            <i class="pi pi-users"></i>
            إدارة الموظفين
          </NuxtLink>

          <button
            @click="exportCsv"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#7030A0]"
          >
            <i class="pi pi-download"></i>
            تصدير CSV
          </button>

          <button
            @click="refreshAll"
            :disabled="pending"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7030A0] px-4 py-3 text-xs font-bold text-white shadow-sm shadow-purple-900/10 transition hover:bg-[#5d2588] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="pi pi-sync" :class="{ 'pi-spin': pending }"></i>
            تحديث السجل
          </button>
        </div>
      </div>
    </header>

    <!-- ================= STATISTICS ================= -->
    <section class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

      <!-- Total -->
      <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center justify-between gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7030A0]">
            <i class="pi pi-list text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-400">كل السجلات</span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">
            {{ stats.total }}
          </div>
          <div class="mt-1 text-xs font-semibold text-slate-500">إجمالي العمليات</div>
        </div>
        <div class="absolute bottom-0 right-0 h-1 w-full bg-purple-100">
          <div class="h-full w-1/3 bg-[#7030A0]"></div>
        </div>
      </div>

      <!-- Employees -->
      <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center justify-between gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <i class="pi pi-user text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-400">المستخدمون</span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">
            {{ stats.employee }}
          </div>
          <div class="mt-1 text-xs font-semibold text-slate-500">عمليات الموظفين</div>
        </div>
        <div class="absolute bottom-0 right-0 h-1 w-full bg-indigo-100">
          <div class="h-full w-1/3 bg-indigo-500"></div>
        </div>
      </div>

      <!-- Contracts -->
      <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center justify-between gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <i class="pi pi-file-edit text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-400">العقود</span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">
            {{ stats.contracts }}
          </div>
          <div class="mt-1 text-xs font-semibold text-slate-500">تعديلات العقود</div>
        </div>
        <div class="absolute bottom-0 right-0 h-1 w-full bg-amber-100">
          <div class="h-full w-1/3 bg-amber-500"></div>
        </div>
      </div>

      <!-- Deletes -->
      <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="flex items-center justify-between gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <i class="pi pi-trash text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-400">الحذف والأرشفة</span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">
            {{ stats.deletes }}
          </div>
          <div class="mt-1 text-xs font-semibold text-slate-500">عمليات الحذف والأرشفة</div>
        </div>
        <div class="absolute bottom-0 right-0 h-1 w-full bg-rose-100">
          <div class="h-full w-1/3 bg-rose-500"></div>
        </div>
      </div>
    </section>

    <!-- ================= FILTERS ================= -->
    <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#7030A0]">
            <i class="pi pi-sliders-h"></i>
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-800">تصفية السجلات</h2>
            <p class="mt-0.5 text-[11px] text-slate-400">
              حدد المعايير للوصول إلى العملية المطلوبة
            </p>
          </div>
        </div>

        <button
          @click="clearFilters"
          class="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <i class="pi pi-filter-slash"></i>
          إعادة تعيين الفلاتر
        </button>
      </div>

      <div class="space-y-5 p-5">

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <!-- Employee -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <i class="pi pi-user text-[#7030A0]"></i>
              الموظف
            </label>

            <select v-model="userFilter" class="audit-input">
              <option value="">جميع الموظفين</option>
              <option v-for="u in userOptions" :key="u.email" :value="u.email">
                {{ u.name }}
              </option>
            </select>
          </div>

          <!-- Action -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <i class="pi pi-bolt text-[#7030A0]"></i>
              نوع الإجراء
            </label>

            <select v-model="actionFilter" class="audit-input">
              <option value="">جميع الإجراءات</option>
              <option v-for="(label, key) in actionLabels" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- Role -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <i class="pi pi-shield text-[#7030A0]"></i>
              دور المنفذ
            </label>

            <select v-model="roleFilter" class="audit-input">
              <option value="">جميع الأدوار</option>
              <option value="employee">الموظفون فقط</option>
              <option value="admin">مدير النظام فقط</option>
            </select>
          </div>

          <!-- Search -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <i class="pi pi-search text-[#7030A0]"></i>
              البحث
            </label>

            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="رقم القطعة، الاسم، التفاصيل..."
                class="audit-input pr-10"
              />
              <i class="pi pi-search absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5">

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-600">من تاريخ</label>
            <input v-model="dateFrom" type="date" class="audit-input" />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-600">إلى تاريخ</label>
            <input v-model="dateTo" type="date" class="audit-input" />
          </div>

          <div class="flex items-end">
            <div class="w-full rounded-xl bg-purple-50/70 px-4 py-3">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xs font-semibold text-slate-500">النتائج المطابقة</span>
                <span class="text-lg font-black tabular-nums text-[#7030A0]">
                  {{ filteredLogs.length }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= AUDIT TABLE ================= -->
    <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 class="text-sm font-black text-slate-800">العمليات المسجلة</h2>
          <p class="mt-1 text-[11px] text-slate-400">
            اضغط على أي سجل لمشاهدة تفاصيل التغييرات
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="rounded-lg bg-purple-50 px-3 py-1.5 text-[11px] font-bold text-[#7030A0]">
            {{ filteredLogs.length }} عملية
          </span>

          <span class="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
            الأحدث أولاً
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="flex flex-col items-center justify-center gap-3 px-6 py-20">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#7030A0]">
          <i class="pi pi-spin pi-spinner text-xl"></i>
        </div>
        <p class="text-sm font-semibold text-slate-500">
          جاري تحميل سجل العمليات...
        </p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredLogs.length === 0"
        class="flex flex-col items-center justify-center px-6 py-20 text-center"
      >
        <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
          <i class="pi pi-inbox text-3xl"></i>
        </div>

        <h3 class="mt-4 text-sm font-black text-slate-700">
          لا توجد عمليات مطابقة
        </h3>

        <p class="mt-1 max-w-sm text-xs leading-6 text-slate-400">
          لم يتم العثور على سجلات تطابق معايير البحث الحالية. جرّب تعديل الفلاتر.
        </p>

        <button
          @click="clearFilters"
          class="mt-4 rounded-xl bg-[#7030A0] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5d2588]"
        >
          مسح جميع الفلاتر
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[950px] border-collapse text-right text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500">
              <th class="whitespace-nowrap px-5 py-4 text-right">التاريخ والوقت</th>
              <th class="px-5 py-4 text-right">منفذ العملية</th>
              <th class="px-5 py-4 text-center">الإجراء</th>
              <th class="px-5 py-4 text-right">الهدف</th>
              <th class="px-5 py-4 text-right">ملخص العملية</th>
              <th class="px-5 py-4 text-center">التفاصيل</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <template v-for="log in filteredLogs" :key="log._key">

              <tr
                class="group cursor-pointer transition-colors hover:bg-purple-50/40"
                :class="expanded.has(log._key) ? 'bg-purple-50/50' : ''"
                @click="toggleRow(log._key)"
              >
                <!-- Date -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="font-bold text-slate-700">
                    {{ formatDate(log.timestamp) }}
                  </div>

                  <div class="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <i class="pi pi-clock text-[9px]"></i>
                    {{ formatTime(log.timestamp) }}
                  </div>
                </td>

                <!-- User -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                      :class="log.userRole === 'employee'
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'bg-purple-50 text-[#7030A0]'"
                    >
                      {{ (log.userName || log.adminEmail || '?').slice(0, 1).toUpperCase() }}
                    </div>

                    <div class="min-w-0">
                      <div class="max-w-[180px] truncate font-bold text-slate-800">
                        {{ log.userName || log.adminEmail }}
                      </div>

                      <div class="mt-1 flex items-center gap-1.5">
                        <span
                          class="rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                          :class="log.userRole === 'employee'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-purple-50 text-[#7030A0]'"
                        >
                          {{ log.userRole === 'employee' ? 'موظف' : 'مدير' }}
                        </span>

                        <span
                          class="max-w-[150px] truncate text-[10px] text-slate-400"
                          dir="ltr"
                        >
                          {{ log.adminEmail }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Action -->
                <td class="px-5 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] font-bold"
                    :class="getActionBadgeClass(log.action)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                    {{ getActionLabel(log.action) }}
                  </span>
                </td>

                <!-- Target -->
                <td class="px-5 py-4">
                  <span
                    v-if="log.plotNo"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1.5 font-black text-[#7030A0]"
                  >
                    <i class="pi pi-map-marker text-[10px]"></i>
                    قطعة {{ log.plotNo }}
                  </span>

                  <span v-else-if="log.target" class="font-semibold text-slate-600">
                    {{ log.target }}
                  </span>

                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Description -->
                <td class="max-w-sm px-5 py-4">
                  <div class="line-clamp-2 font-semibold leading-6 text-slate-700">
                    {{ describeLog(log) }}
                  </div>

                  <div
                    v-if="getChanges(log).length"
                    class="mt-1.5 text-[10px] font-medium text-slate-400"
                  >
                    {{ getChanges(log).length }}
                    {{ getChanges(log).length === 1 ? 'حقل تم تغييره' : 'حقول تم تغييرها' }}
                  </div>
                </td>

                <!-- Expand -->
                <td class="px-5 py-4 text-center">
                  <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg transition"
                    :class="expanded.has(log._key)
                      ? 'bg-[#7030A0] text-white'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-[#7030A0]'"
                  >
                    <i
                      class="pi text-[11px]"
                      :class="expanded.has(log._key) ? 'pi-minus' : 'pi-plus'"
                    ></i>
                  </span>
                </td>
              </tr>

              <!-- Expanded Details -->
              <tr v-if="expanded.has(log._key)" class="bg-slate-50/70">
                <td colspan="6" class="px-4 py-5 sm:px-6">
                  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                      <div class="flex items-center gap-2.5">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-[#7030A0]">
                          <i class="pi pi-file-edit text-xs"></i>
                        </div>

                        <div>
                          <h3 class="text-xs font-black text-slate-800">
                            تفاصيل العملية والتغييرات
                          </h3>
                          <p class="mt-0.5 text-[10px] text-slate-400">
                            مقارنة البيانات قبل وبعد التنفيذ
                          </p>
                        </div>
                      </div>

                      <span class="text-[10px] font-semibold text-slate-400">
                        {{ formatDate(log.timestamp) }} · {{ formatTime(log.timestamp) }}
                      </span>
                    </div>

                    <!-- Changes -->
                    <div v-if="getChanges(log).length" class="divide-y divide-slate-100">
                      <div
                        v-for="c in getChanges(log)"
                        :key="c.key"
                        class="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[170px_1fr] md:items-start"
                      >
                        <div class="flex items-center gap-2">
                          <span class="h-1.5 w-1.5 rounded-full bg-[#7030A0]"></span>
                          <span class="text-xs font-bold text-slate-700">
                            {{ c.label }}
                          </span>
                        </div>

                        <!-- Lists -->
                        <div v-if="c.type === 'list'" class="space-y-3">
                          <div class="flex flex-wrap gap-2">
                            <span
                              v-for="x in c.kept"
                              :key="'k' + x"
                              class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500"
                            >
                              {{ x }}
                            </span>

                            <span
                              v-for="x in c.added"
                              :key="'a' + x"
                              class="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700"
                            >
                              <i class="pi pi-plus text-[9px]"></i>
                              {{ x }}
                            </span>

                            <span
                              v-for="x in c.removed"
                              :key="'r' + x"
                              class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 line-through"
                            >
                              <i class="pi pi-minus text-[9px]"></i>
                              {{ x }}
                            </span>

                            <span
                              v-if="!c.kept.length && !c.added.length && !c.removed.length"
                              class="text-xs text-slate-400"
                            >
                              بدون صلاحيات
                            </span>
                          </div>

                          <div class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-400">
                            <span class="text-emerald-600">+ تمت إضافتها</span>
                            <span class="text-rose-600">− تمت إزالتها</span>
                            <span>الرمادي: دون تغيير</span>
                          </div>
                        </div>

                        <!-- Text Values -->
                        <div v-else class="flex flex-wrap items-center gap-2">
                          <div class="min-w-[100px] max-w-full flex-1 rounded-xl border border-rose-100 bg-rose-50/70 p-3">
                            <div class="mb-1 text-[9px] font-bold text-rose-500">
                              القيمة السابقة
                            </div>

                            <div class="whitespace-pre-wrap break-words text-xs font-semibold leading-5 text-rose-800">
                              {{ c.before }}
                            </div>
                          </div>

                          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <i class="pi pi-arrow-left text-[10px]"></i>
                          </div>

                          <div class="min-w-[100px] max-w-full flex-1 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                            <div class="mb-1 text-[9px] font-bold text-emerald-600">
                              القيمة الجديدة
                            </div>

                            <div class="whitespace-pre-wrap break-words text-xs font-semibold leading-5 text-emerald-800">
                              {{ c.after }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Raw Data -->
                    <div v-else-if="rawText(log)" class="p-4">
                      <div class="rounded-xl bg-slate-50 p-4 text-xs leading-7 text-slate-600 whitespace-pre-wrap break-words">
                        {{ rawText(log) }}
                      </div>
                    </div>

                    <!-- No Changes -->
                    <div v-else class="flex items-center gap-2 p-5 text-xs text-slate-400">
                      <i class="pi pi-info-circle"></i>
                      لا توجد تغييرات تفصيلية مسجلة لهذه العملية.
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div
        v-if="!pending && filteredLogs.length"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3"
      >
        <span class="text-[10px] font-medium text-slate-400">
          يتم عرض جميع النتائج المطابقة للفلاتر الحالية
        </span>

        <span class="text-[10px] font-bold text-slate-500">
          {{ filteredLogs.length }} سجل
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AuditLogEntry } from '../../../shared/types/audit';

type Row = AuditLogEntry & { _key: string };

type Change = {
  key: string;
  label: string;
  type: 'text' | 'list';
  before: string;
  after: string;
  kept: string[];
  added: string[];
  removed: string[];
};

const route = useRoute();

const {
  data: response,
  pending,
  refresh,
} = await useFetch<{
  success: boolean;
  data: AuditLogEntry[];
}>('/api/admin/audit');

// الموظفون
const {
  data: employeesResponse,
  refresh: refreshEmployees,
} = await useFetch<any>('/api/admin/employees', {
  default: () => ({ data: [] }),
});

// تحديث البيانات
const refreshAll = async () => {
  await Promise.all([
    refresh(),
    refreshEmployees(),
  ]);
};

// السجلات مرتبة من الأحدث إلى الأقدم
const logs = computed<Row[]>(() => {
  const list = (response.value?.data || []).map((l, i) => ({
    ...l,
    _key: `${l.timestamp}-${i}`,
  }));

  return list.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime(),
  );
});

// الفلاتر
const search = ref((route.query.search as string) || '');
const actionFilter = ref('');
const roleFilter = ref('');
const userFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');

const expanded = ref<Set<string>>(new Set());

// فتح وإغلاق تفاصيل السجل
const toggleRow = (key: string) => {
  const next = new Set(expanded.value);

  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }

  expanded.value = next;
};

// مسح الفلاتر
const clearFilters = () => {
  search.value = '';
  actionFilter.value = '';
  roleFilter.value = '';
  userFilter.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  expanded.value = new Set();
};

/* =========================================
   التسميات العربية
========================================= */

const actionLabels: Record<string, string> = {
  LOGIN: 'تسجيل دخول',
  CONTRACT_EDIT: 'تعديل عقد',
  STATUS_CHANGE: 'تغيير حالة',
  UPDATE: 'تحديث بيانات',
  CREATE: 'إضافة قطعة',
  DELETE: 'حذف',
  ARCHIVE: 'أرشفة',
  EMPLOYEE_CREATE: 'إضافة موظف',
  EMPLOYEE_UPDATE: 'تعديل موظف',
  EMPLOYEE_DELETE: 'حذف موظف',
};

const fieldLabels: Record<string, string> = {
  plotNo: 'رقم القطعة',
  status: 'الحالة',
  price: 'السعر',
  area: 'المساحة',
  pricePerMeter: 'سعر المتر',
  totalPrice: 'السعر الإجمالي',
  deedNo: 'رقم الصك',
  notes: 'ملاحظات',
  block: 'المربع',
  street: 'الشارع',
  facing: 'الواجهة',
  buyerName: 'اسم المشتري',
  buyerId: 'رقم هوية المشتري',
  buyerPhone: 'جوال المشتري',
  buyerBirthDate: 'تاريخ ميلاد المشتري',
  contractNo: 'رقم العقد',
  contractDate: 'تاريخ العقد',
  contractNote: 'ملاحظة العقد',
  contractTerms: 'بنود العقد',
  name: 'الاسم',
  fullName: 'الاسم الكامل',
  username: 'اسم المستخدم',
  email: 'البريد الإلكتروني',
  phone: 'رقم الجوال',
  role: 'الدور',
  password: 'كلمة المرور',
  active: 'مفعّل',
  isActive: 'مفعّل',
  permissions: 'الصلاحيات',
  lastLoginAt: 'آخر تسجيل دخول',
};

const valueLabels: Record<string, string> = {
  available: 'متاح',
  sold: 'مباع',
  reserved: 'محجوز',
  archived: 'مؤرشف',
  employee: 'موظف',
  admin: 'مدير',
  true: 'نعم',
  false: 'لا',
};

/* =========================================
   ترجمة الصلاحيات
========================================= */

const permVerbs: Record<string, string> = {
  view: 'عرض',
  edit: 'تعديل',
  update: 'تعديل',
  create: 'إضافة',
  add: 'إضافة',
  delete: 'حذف',
  archive: 'أرشفة',
  manage: 'إدارة',
  export: 'تصدير',
  print: 'طباعة',
};

const permNouns: Record<string, string> = {
  plots: 'القطع',
  plot: 'القطعة',
  contracts: 'العقود',
  contract: 'العقد',
  stats: 'الإحصائيات',
  statistics: 'الإحصائيات',
  employees: 'الموظفين',
  users: 'المستخدمين',
  audit: 'سجل العمليات',
  logs: 'سجل العمليات',
  reports: 'التقارير',
  buyers: 'المشترين',
  all: 'الكل',
};

const permissionLabel = (p: string) => {
  const parts = String(p).toLowerCase().split('_');
  const verb = permVerbs[parts[0]];

  if (!verb) return String(p);

  const noun = parts
    .slice(1)
    .map((w) => permNouns[w] || w)
    .join(' ');

  return noun ? `${verb} ${noun}` : verb;
};

/* =========================================
   الحقول المخفية
========================================= */

const hiddenKeys = new Set([
  'id',
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
  'lastLoginAt',
  'lastLogin',
  'token',
  'passwordHash',
  'timestamp',
]);

const getActionLabel = (action: string) =>
  actionLabels[action] || action;

const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'LOGIN':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';

    case 'CONTRACT_EDIT':
      return 'bg-amber-50 text-amber-800 border border-amber-200';

    case 'CREATE':
    case 'EMPLOYEE_CREATE':
      return 'bg-teal-50 text-teal-700 border border-teal-200';

    case 'UPDATE':
    case 'EMPLOYEE_UPDATE':
    case 'STATUS_CHANGE':
      return 'bg-blue-50 text-blue-700 border border-blue-200';

    case 'DELETE':
    case 'ARCHIVE':
    case 'EMPLOYEE_DELETE':
      return 'bg-rose-50 text-rose-700 border border-rose-200';

    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

/* =========================================
   التاريخ والوقت
========================================= */

const formatDate = (ts: string | number | Date) =>
  new Date(ts).toLocaleDateString(
    'ar-SA-u-ca-gregory-nu-latn',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

const formatTime = (ts: string | number | Date) =>
  new Date(ts).toLocaleTimeString(
    'ar-SA-u-ca-gregory-nu-latn',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );

/* =========================================
   تحليل البيانات
========================================= */

const parseData = (v: unknown): Record<string, any> | null => {
  if (v === null || v === undefined || v === '') {
    return null;
  }

  if (typeof v === 'object') {
    return v as Record<string, any>;
  }

  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);

      return parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
        ? parsed
        : null;
    } catch {
      return null;
    }
  }

  return null;
};

const isEmpty = (v: any) =>
  v === null ||
  v === undefined ||
  v === '' ||
  (Array.isArray(v) && v.length === 0);

const isoRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const formatValue = (v: any): string => {
  if (isEmpty(v)) return 'فارغ';

  if (typeof v === 'boolean') {
    return v ? 'نعم' : 'لا';
  }

  if (Array.isArray(v)) {
    return v.map((x) => String(x)).join('، ');
  }

  if (typeof v === 'object') {
    return JSON.stringify(v);
  }

  const s = String(v);

  if (isoRe.test(s)) {
    return `${formatDate(s)} - ${formatTime(s)}`;
  }

  return valueLabels[s] ?? s;
};

/* =========================================
   استخراج التغييرات
========================================= */

const getChanges = (log: Row): Change[] => {
  const before = parseData(log.beforeData);
  const after = parseData(log.afterData);

  if (!before && !after) return [];

  const source = after || before || {};
  const changes: Change[] = [];

  for (const key of Object.keys(source)) {
    if (hiddenKeys.has(key)) continue;

    const b = before ? before[key] : undefined;
    const a = after ? after[key] : undefined;

    // لا نعرض كلمات المرور
    if (key === 'password') {
      if (
        after &&
        !isEmpty(a) &&
        JSON.stringify(a) !== JSON.stringify(b)
      ) {
        changes.push({
          key,
          label: 'كلمة المرور',
          type: 'text',
          before: '—',
          after: 'تم تغيير كلمة المرور',
          kept: [],
          added: [],
          removed: [],
        });
      }

      continue;
    }

    // تجاهل القيم التي لم تتغير
    if (before && after) {
      if (isEmpty(a) && isEmpty(b)) continue;

      if (JSON.stringify(a) === JSON.stringify(b)) {
        continue;
      }
    }

    // القوائم والصلاحيات
    if (Array.isArray(a) || Array.isArray(b)) {
      const oldList: string[] = Array.isArray(b)
        ? b.map(String)
        : [];

      const newList: string[] = Array.isArray(a)
        ? a.map(String)
        : [];

      const translate = (x: string) =>
        key === 'permissions' ? permissionLabel(x) : x;

      changes.push({
        key,
        label: fieldLabels[key] || key,
        type: 'list',
        before: oldList.map(translate).join('، ') || 'فارغ',
        after: newList.map(translate).join('، ') || 'فارغ',
        kept: newList
          .filter((x) => oldList.includes(x))
          .map(translate),
        added: newList
          .filter((x) => !oldList.includes(x))
          .map(translate),
        removed: oldList
          .filter((x) => !newList.includes(x))
          .map(translate),
      });

      continue;
    }

    // القيم النصية
    changes.push({
      key,
      label: fieldLabels[key] || key,
      type: 'text',
      before: before ? formatValue(b) : '—',
      after: after ? formatValue(a) : '—',
      kept: [],
      added: [],
      removed: [],
    });
  }

  return changes;
};

/* =========================================
   النصوص الخام
========================================= */

const rawText = (log: Row) => {
  const parts: string[] = [];

  if (log.beforeData && !parseData(log.beforeData)) {
    parts.push(`قبل: ${log.beforeData}`);
  }

  if (log.afterData && !parseData(log.afterData)) {
    parts.push(`بعد: ${log.afterData}`);
  }

  return parts.join('\n');
};

/* =========================================
   وصف العملية
========================================= */

const describeLog = (log: Row) => {
  const who = log.userName || log.adminEmail;
  const role = log.userRole === 'employee'
    ? 'الموظف'
    : 'المدير';

  const plot = log.plotNo
    ? ` القطعة رقم ${log.plotNo}`
    : '';

  const target = log.target
    ? ` (${log.target})`
    : '';

  switch (log.action) {
    case 'LOGIN':
      return `${role} ${who} سجّل الدخول إلى النظام`;

    case 'CONTRACT_EDIT':
      return `${role} ${who} عدّل عقد${plot}`;

    case 'STATUS_CHANGE':
      return `${role} ${who} غيّر حالة${plot}`;

    case 'UPDATE':
      return `${role} ${who} حدّث بيانات${plot}`;

    case 'CREATE':
      return `${role} ${who} أضاف${plot}`;

    case 'DELETE':
      return `${role} ${who} حذف${plot}`;

    case 'ARCHIVE':
      return `${role} ${who} أرشف${plot}`;

    case 'EMPLOYEE_CREATE':
      return `${role} ${who} أضاف موظفا جديدا${target}`;

    case 'EMPLOYEE_UPDATE':
      return `${role} ${who} عدّل بيانات موظف${target}`;

    case 'EMPLOYEE_DELETE':
      return `${role} ${who} حذف موظفا${target}`;

    default:
      return `${role} ${who}: ${getActionLabel(log.action)}`;
  }
};

/* =========================================
   الموظفون - بدون المديرين
========================================= */

const userOptions = computed(() => {
  const res = employeesResponse.value;

  const list: any[] = Array.isArray(res)
    ? res
    : res?.data || res?.employees || [];

  return list
    .filter((employee) => {
      const role = String(
        employee?.role || employee?.userRole || '',
      ).toLowerCase();

      return role !== 'admin' && role !== 'administrator';
    })
    .map((employee) => {
      const email =
        employee?.email ||
        employee?.adminEmail ||
        employee?.username;

      if (!email) return null;

      return {
        email,
        name:
          employee.name ||
          employee.fullName ||
          employee.userName ||
          employee.username ||
          email,
      };
    })
    .filter(
      (employee): employee is { email: string; name: string } =>
        employee !== null,
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'ar'),
    );
});

/* =========================================
   السجلات المفلترة
========================================= */

const filteredLogs = computed(() => {
  let list = logs.value;

  if (actionFilter.value) {
    list = list.filter(
      (l) => l.action === actionFilter.value,
    );
  }

  if (roleFilter.value) {
    list = list.filter(
      (l) => l.userRole === roleFilter.value,
    );
  }

  if (userFilter.value) {
    list = list.filter(
      (l) => l.adminEmail === userFilter.value,
    );
  }

  if (dateFrom.value) {
    const from = new Date(
      `${dateFrom.value}T00:00:00`,
    ).getTime();

    list = list.filter(
      (l) => new Date(l.timestamp).getTime() >= from,
    );
  }

  if (dateTo.value) {
    const to = new Date(
      `${dateTo.value}T23:59:59.999`,
    ).getTime();

    list = list.filter(
      (l) => new Date(l.timestamp).getTime() <= to,
    );
  }

  if (search.value.trim()) {
    const s = search.value.trim().toLowerCase();

    list = list.filter((l) => {
      const plotMatch = l.plotNo
        ? String(l.plotNo).toLowerCase().includes(s)
        : false;

      const emailMatch =
        l.adminEmail?.toLowerCase().includes(s);

      const nameMatch =
        l.userName?.toLowerCase().includes(s);

      const targetMatch =
        l.target?.toLowerCase().includes(s);

      const dataMatch =
        String(l.afterData ?? '').toLowerCase().includes(s) ||
        String(l.beforeData ?? '').toLowerCase().includes(s);

      return (
        plotMatch ||
        emailMatch ||
        nameMatch ||
        targetMatch ||
        dataMatch
      );
    });
  }

  return list;
});

/* =========================================
   الإحصائيات
========================================= */

const stats = computed(() => {
  const all = logs.value;

  return {
    total: all.length,

    employee: all.filter(
      (l) => l.userRole === 'employee',
    ).length,

    contracts: all.filter(
      (l) => l.action === 'CONTRACT_EDIT',
    ).length,

    deletes: all.filter(
      (l) =>
        [
          'DELETE',
          'ARCHIVE',
          'EMPLOYEE_DELETE',
        ].includes(l.action),
    ).length,
  };
});

/* =========================================
   تصدير CSV
========================================= */

const exportCsv = () => {
  const esc = (v: unknown) =>
    `"${String(v ?? '').replace(/"/g, '""')}"`;

  const header = [
    'التاريخ',
    'الوقت',
    'المنفذ',
    'البريد',
    'الدور',
    'الإجراء',
    'القطعة / الهدف',
    'الملخص',
    'التغييرات',
  ];

  const rows = filteredLogs.value.map((l) => {
    const changes = getChanges(l)
      .map(
        (c) => `${c.label}: ${c.before} ← ${c.after}`,
      )
      .join(' | ');

    return [
      formatDate(l.timestamp),
      formatTime(l.timestamp),
      l.userName || l.adminEmail,
      l.adminEmail,
      l.userRole === 'employee' ? 'موظف' : 'مدير',
      getActionLabel(l.action),
      l.plotNo ? `قطعة ${l.plotNo}` : l.target || '',
      describeLog(l),
      changes || rawText(l),
    ]
      .map(esc)
      .join(',');
  });

  const csv =
    '\uFEFF' +
    [header.map(esc).join(','), ...rows].join('\n');

  const blob = new Blob(
    [csv],
    { type: 'text/csv;charset=utf-8;' },
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `سجل-العمليات-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.audit-input {
  width: 100%;
  min-height: 43px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  padding: 10px 13px;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.audit-input:hover {
  border-color: #c4b5d5;
}

.audit-input:focus {
  border-color: #7030A0;
  box-shadow: 0 0 0 3px rgb(112 48 160 / 9%);
}

.audit-input::placeholder {
  color: #a1a1aa;
  font-weight: 400;
}

.audit-input option {
  color: #334155;
}

.audit-input:disabled {
  cursor: not-allowed;
  background: #f8fafc;
  opacity: 0.7;
}
</style>
