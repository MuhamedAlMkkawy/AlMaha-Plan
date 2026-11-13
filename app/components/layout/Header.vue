<template>
  <header class="sticky top-0 z-40 print:hidden">
<!-- ================= ADMIN HEADER ================= -->
<div
  v-if="adminUser"
  class="relative border-b border-[#7030A0]/10 bg-white/95 text-slate-700 backdrop-blur-xl transition-all duration-300"
  :class="scrolled
    ? 'shadow-[0_12px_35px_-20px_rgba(70,25,105,0.35)]'
    : 'shadow-[0_4px_20px_-18px_rgba(70,25,105,0.12)]'"
>
  <!-- Brand accent -->
  <div class="absolute inset-x-0 top-0 h-[3px] overflow-hidden">
    <div class="h-full w-full bg-gradient-to-l from-[#7030A0] via-[#9B6BC0] to-amber-400"></div>
  </div>

  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="flex h-[76px] items-center justify-between gap-4">

      <!-- ADMIN BRAND -->
      <NuxtLink
        to="/admin"
        aria-label="الذهاب إلى لوحة الإدارة"
        class="group relative flex shrink-0 items-center gap-3.5 rounded-2xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#7030A0] focus-visible:ring-offset-4"
      >
        <!-- Brand icon -->
        <div
          class="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-br from-[#8443B1] via-[#7030A0] to-[#4C1D73] shadow-[0_5px_15px_-5px_rgba(112,48,160,0.55)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_9px_20px_-5px_rgba(112,48,160,0.4)]"
        >
          <div class="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent"></div>

          <i class="pi pi-shield relative text-xl text-white"></i>

          <span class="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_7px_rgba(251,191,36,0.9)]"></span>
        </div>

        <!-- Brand text -->
        <div class="flex flex-col gap-1">
          <span class="text-[15px] font-black leading-none tracking-tight text-[#4C1D73] transition-colors duration-200 group-hover:text-[#7030A0]">
            لوحة التحكم
          </span>

          <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            ADMINISTRATION
          </span>
        </div>
      </NuxtLink>

      <!-- DESKTOP NAVIGATION -->
      <nav class="hidden md:flex h-full min-w-0 flex-1 items-center justify-center gap-1 px-2">
        <NuxtLink
          v-for="item in adminLinks"
          :key="item.to"
          :to="item.to"
          class="group relative flex h-11 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40"
          :class="isActive(item)
            ? 'bg-[#7030A0]/[0.075] text-[#7030A0]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-[#7030A0]'"
        >
          <i
            :class="item.icon"
            class="text-[14px] transition-transform duration-200 group-hover:scale-110"
          ></i>

          <span>{{ item.label }}</span>

          <span
            v-if="isActive(item)"
            class="absolute inset-x-4 -bottom-[13px] h-[3px] rounded-t-full bg-gradient-to-r from-[#7030A0] to-amber-400"
          ></span>
        </NuxtLink>
      </nav>

      <!-- ACTIONS -->
      <div class="flex shrink-0 items-center gap-2">

        <!-- Admin status -->
        <div class="hidden xl:flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"></span>
            <span class="relative h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>

          <span class="text-[11px] font-bold text-emerald-700">
            متصل الآن
          </span>
        </div>

        <!-- Logout -->
        <button
          type="button"
          @click="handleLogout"
          :disabled="loggingOut"
          class="group hidden md:inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-bold text-slate-500 shadow-sm transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-[0_5px_15px_-8px_rgba(225,29,72,0.3)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          <i
            :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'"
            class="text-[13px] transition-transform duration-200 group-hover:translate-x-0.5"
          ></i>

          <span>خروج</span>
        </button>

        <!-- Mobile menu -->
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="القائمة"
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7030A0]/15 bg-[#7030A0]/[0.045] text-[#7030A0] transition-all duration-200 hover:bg-[#7030A0]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/40 md:hidden"
          :class="mobileMenuOpen ? 'bg-[#7030A0] text-white' : ''"
        >
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-base"></i>
        </button>
      </div>
    </div>

    <!-- MOBILE ADMIN MENU -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="border-t border-slate-100 py-4 md:hidden"
      >
        <!-- Section heading -->
        <div class="mb-3 flex items-center justify-between">
          <span class="text-[11px] font-black tracking-wider text-slate-400">
            أدوات الإدارة
          </span>

          <span class="rounded-md bg-[#7030A0]/[0.07] px-2 py-1 text-[10px] font-bold text-[#7030A0]">
            ADMIN
          </span>
        </div>

        <!-- Navigation -->
        <div class="grid gap-1.5">
          <NuxtLink
            v-for="item in adminLinks"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200"
            :class="isActive(item)
              ? 'bg-[#7030A0]/[0.075] text-[#7030A0]'
              : 'text-slate-600 hover:bg-slate-50 hover:text-[#7030A0]'"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200"
              :class="isActive(item)
                ? 'bg-[#7030A0] text-white shadow-sm shadow-[#7030A0]/20'
                : 'bg-slate-100 text-slate-500 group-hover:bg-[#7030A0]/10 group-hover:text-[#7030A0]'"
            >
              <i :class="item.icon" class="text-sm"></i>
            </span>

            <span class="flex-1 text-sm font-bold">
              {{ item.label }}
            </span>

            <i
              v-if="isActive(item)"
              class="pi pi-check-circle text-sm text-[#7030A0]"
            ></i>
          </NuxtLink>
        </div>

        <!-- Mobile logout -->
        <div class="mt-4 border-t border-slate-100 pt-4">
          <button
            type="button"
            @click="handleLogout"
            :disabled="loggingOut"
            class="flex h-12 w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/70 px-3.5 text-sm font-bold text-rose-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-100 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-500 shadow-sm">
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-sm"></i>
            </span>

            <span>تسجيل الخروج</span>

            <i class="pi pi-arrow-left ms-auto text-xs opacity-60"></i>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</div>


    <!-- EMPLOYEE: indigo bar, employee badge -->
    <div
      v-else-if="authUser && authUser.role === 'employee'"
      class="bg-white/95 backdrop-blur-md text-slate-700 border-t-[3px] border-t-indigo-600 border-b border-b-slate-200 transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_10px_24px_-18px_rgba(79,70,229,0.45)]' : ''"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="h-16 flex items-center justify-between gap-3">
          <!-- Brand + mode (compact: name appears only when there is room) -->
          <div
            class="inline-flex h-10 min-w-0 max-w-[16rem] shrink-0 items-center gap-2.5
                  rounded-xl border border-indigo-100/80
                  bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/60
                  px-3.5 shadow-sm shadow-indigo-950/[0.04]
                  ring-1 ring-inset ring-white/80
                  transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-950/[0.06]"
          >
            <span class="relative flex h-2.5 w-2.5 shrink-0">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"
              ></span>
              <span
                class="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm shadow-emerald-500/30"
              ></span>
            </span>

            <span class="flex min-w-0 items-center gap-1.5 truncate text-xs sm:text-sm">
              <span class="shrink-0 font-extrabold tracking-tight text-indigo-900">
                بوابة الموظف
              </span>

              <span
                :class="dense ? 'hidden xl:inline' : 'hidden lg:inline'"
                class="truncate border-s border-indigo-200 ps-2 font-semibold text-slate-500"
              >
                {{ authUser.name || authUser.email }}
              </span>
            </span>
          </div>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-stretch h-full min-w-0 flex-1">
            <template v-for="(group, gi) in employeeGroups" :key="group.id">
              <!-- One permitted link: plain link -->
              <NuxtLink
                v-if="group.links.length === 1"
                :to="group.links[0].to"
                :title="group.links[0].label"
                :aria-label="group.links[0].label"
                class="group relative flex items-center gap-2 text-sm whitespace-nowrap font-medium transition-colors duration-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:bg-indigo-50"
                :class="[
                  dense ? 'px-2.5 xl:px-3' : 'px-3',
                  isActive(group.links[0]) ? 'text-indigo-600 font-bold' : 'text-slate-600',
                ]"
              >
                <i
                  :class="[
                    group.links[0].icon,
                    dense ? 'text-sm xl:text-xs' : 'text-xs'
                  ]"
                ></i>
                <span :class="dense ? 'hidden xl:inline' : ''">{{ group.links[0].label }}</span>
                <span
                  aria-hidden="true"
                  class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-t-full bg-indigo-600 transition-transform duration-300"
                  :class="isActive(group.links[0]) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
                ></span>
              </NuxtLink>

              <!-- Several permitted links: dropdown -->
              <div v-else class="relative flex items-stretch">
                <button
                  type="button"
                  aria-haspopup="menu"
                  :aria-expanded="openGroup === group.id"
                  :title="group.label"
                  :aria-label="group.label"
                  @click.stop="toggleGroup(group.id)"
                  class="group relative flex items-center gap-2 text-sm whitespace-nowrap font-medium transition-colors duration-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:bg-indigo-50"
                  :class="[
                    dense ? 'px-2.5 xl:px-3' : 'px-3',
                    isGroupActive(group) || openGroup === group.id ? 'text-indigo-600 font-bold' : 'text-slate-600',
                  ]"
                >
                  <i :class="[group.icon, dense ? 'text-sm xl:text-xs' : 'text-xs']"></i>
                  <span :class="dense ? 'hidden xl:inline' : ''">{{ group.label }}</span>
                  <i
                    class="pi pi-chevron-down text-[10px] transition-transform duration-200"
                    :class="openGroup === group.id ? 'rotate-180' : ''"
                  ></i>
                  <span
                    aria-hidden="true"
                    class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-t-full bg-indigo-600 transition-transform duration-300"
                    :class="isGroupActive(group) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
                  ></span>
                </button>

                <Transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0 -translate-y-1"
                >
                  <div
                    v-if="openGroup === group.id"
                    role="menu"
                    class="absolute top-full z-50 mt-px min-w-[12rem] rounded-xl bg-white py-1.5 shadow-lg ring-1 ring-slate-200"
                    :class="gi >= employeeGroups.length / 2 ? 'end-0' : 'start-0'"
                    @click.stop
                  >
                    <div v-if="dense" class="px-4 pt-1 pb-1.5 text-[11px] font-bold text-slate-400 xl:hidden">
                      {{ group.label }}
                    </div>
                    <NuxtLink
                      v-for="link in group.links"
                      :key="link.to"
                      :to="link.to"
                      role="menuitem"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-150"
                      :class="isActive(link) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'"
                    >
                      <i :class="link.icon" class="text-xs w-4"></i>
                      {{ link.label }}
                    </NuxtLink>
                  </div>
                </Transition>
              </div>
            </template>

            <!-- Empty state: employee has no permitted pages -->
            <span v-if="!employeeGroups.length" class="flex items-center text-xs text-slate-400">
              لا توجد صفحات مصرح بها، تواصل مع الإدارة
            </span>
          </nav>

          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              class="hidden md:inline-flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-60 disabled:pointer-events-none"
              :class="dense ? 'w-9 xl:w-auto xl:px-3.5' : 'px-3.5'"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-xs"></i>
              <span :class="dense ? 'hidden xl:inline' : ''">تسجيل الخروج</span>
            </button>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              :class="mobileMenuOpen ? 'bg-indigo-50 text-indigo-600' : ''"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile drawer: accordion sections -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden max-h-[75vh] overflow-y-auto overscroll-contain pb-4 border-t border-slate-100">
            <template v-for="group in employeeGroups" :key="group.id">
              <!-- Single link -->
              <NuxtLink
                v-if="group.links.length === 1"
                :to="group.links[0].to"
                class="flex items-center gap-3 py-3.5 border-b border-slate-100 text-base transition-colors duration-200 hover:text-indigo-600 active:bg-slate-50"
                :class="isActive(group.links[0]) ? 'text-indigo-600 font-bold' : 'text-slate-700 font-medium'"
              >
                <i :class="group.links[0].icon" class="text-sm w-5"></i>
                <span class="flex-1">{{ group.links[0].label }}</span>
                <span v-if="isActive(group.links[0])" class="w-2 h-2 rounded-full bg-indigo-600"></span>
              </NuxtLink>

              <!-- Several links: collapsible -->
              <div v-else class="border-b border-slate-100">
                <button
                  type="button"
                  @click="mobileOpenGroup = mobileOpenGroup === group.id ? null : group.id"
                  :aria-expanded="mobileOpenGroup === group.id"
                  class="w-full flex items-center gap-3 py-3.5 text-base transition-colors duration-200 active:bg-slate-50"
                  :class="isGroupActive(group) ? 'text-indigo-600 font-bold' : 'text-slate-700 font-medium'"
                >
                  <i :class="group.icon" class="text-sm w-5"></i>
                  <span class="flex-1 text-start">{{ group.label }}</span>
                  <span class="text-xs font-semibold text-slate-400">{{ group.links.length }}</span>
                  <i
                    class="pi pi-chevron-down text-xs text-slate-400 transition-transform duration-200"
                    :class="mobileOpenGroup === group.id ? 'rotate-180' : ''"
                  ></i>
                </button>

                <div v-if="mobileOpenGroup === group.id" class="pb-2 ps-4">
                  <NuxtLink
                    v-for="link in group.links"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-3 py-2.5 rounded-lg text-[15px] transition-colors duration-200 hover:text-indigo-600 active:bg-slate-50"
                    :class="isActive(link) ? 'text-indigo-600 font-bold' : 'text-slate-600'"
                  >
                    <i :class="link.icon" class="text-xs w-5"></i>
                    <span class="flex-1">{{ link.label }}</span>
                    <span v-if="isActive(link)" class="w-2 h-2 rounded-full bg-indigo-600"></span>
                  </NuxtLink>
                </div>
              </div>
            </template>

            <p v-if="!employeeGroups.length" class="py-4 text-sm text-slate-400">
              لا توجد صفحات مصرح بها، تواصل مع الإدارة
            </p>

            <button
              type="button"
              @click="handleLogout"
              :disabled="loggingOut"
              class="mt-3 w-full h-12 flex items-center gap-3 px-3 rounded-xl text-base font-medium text-rose-600 transition-colors duration-200 hover:bg-rose-50 active:bg-rose-100 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-sm w-5"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- PUBLIC: light bar, hairline border -->
    <div
      v-else
      class="bg-white/90 backdrop-blur-md text-slate-700 border-b border-[#7030A0]/10 transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_10px_24px_-18px_rgba(76,29,115,0.45)]' : ''"
    >
      <div class="max-w-7xl mx-auto">
        <div class="h-16 flex items-center justify-between gap-4">
          <NuxtLink
            to="/"
            class="group flex items-center gap-3 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4"
          >
            <span class="grid grid-cols-2 gap-[3px] w-8 h-8 shrink-0 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" aria-hidden="true">
              <span class="rounded-[4px] bg-[#7030A0]"></span>
              <span class="rounded-[4px] bg-[#7030A0]/60"></span>
              <span class="rounded-[4px] bg-[#7030A0]/60"></span>
              <span class="rounded-[4px] bg-amber-400"></span>
            </span>
            <span class="min-w-0 leading-tight">
              <span class="block text-base font-black text-slate-900 truncate transition-colors duration-200 group-hover:text-[#7030A0]">{{ projectConfig.name }}</span>
              <span class="hidden sm:block text-xs text-slate-500 truncate">
                مخطط رقم {{ projectConfig.planNo }} &nbsp;|&nbsp; التسويق: {{ projectConfig.marketer }}
              </span>
              <span class="block sm:hidden text-xs text-slate-500 truncate">مخطط رقم {{ projectConfig.planNo }}</span>
            </span>
          </NuxtLink>

          <nav class="hidden md:flex items-stretch h-full">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group relative flex items-center px-4 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:bg-[#7030A0]/5"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-600 font-medium hover:text-[#7030A0]'"
            >
              {{ item.label }}
              <span
                aria-hidden="true"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-t-full bg-amber-400 transition-transform duration-300 ease-out motion-reduce:transition-none"
                :class="isActive(item) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Desktop CTA -->
            <NuxtLink
              to="/quote"
              class="group relative hidden md:inline-flex h-11 items-center gap-3 overflow-hidden rounded-xl border border-[#7030A0]/20 bg-gradient-to-l from-[#7030A0] to-[#5b2486] ps-2 pe-5 text-[14px] font-bold text-white shadow-sm shadow-[#7030A0]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7030A0]/40 hover:shadow-lg hover:shadow-[#7030A0]/25 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <!-- Subtle hover highlight -->
              <span
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              ></span>

              <!-- Icon -->
              <span
                class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-amber-300 shadow-inner transition-all duration-300 group-hover:border-amber-300/40 group-hover:bg-amber-300 group-hover:text-[#4c1d73]"
              >
                <i class="pi pi-file-edit text-[14px]"></i>
              </span>

              <!-- Label -->
              <span
                class="relative whitespace-nowrap tracking-tight text-white transition-colors duration-300 group-hover:text-white"
              >
                صانع عروض الأسعار
              </span>

              <!-- Arrow -->
              <i
                class="pi pi-arrow-left relative text-[10px] text-white/60 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-amber-300"
              ></i>
            </NuxtLink>

            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 transition-all duration-200 hover:bg-[#7030A0]/10 hover:text-[#7030A0] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/50"
              :class="mobileMenuOpen ? 'bg-[#7030A0]/10 text-[#7030A0]' : ''"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile drawer -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-slate-100">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-3 py-3.5 border-b border-slate-100 text-base transition-colors duration-200 hover:text-[#7030A0] active:bg-slate-50"
              :class="isActive(item) ? 'text-[#7030A0] font-bold' : 'text-slate-700 font-medium'"
            >
              <i :class="item.icon" class="text-base w-5"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="isActive(item)" class="w-2 h-2 rounded-[3px] bg-amber-400"></span>
            </NuxtLink>

            <!-- Mobile CTA -->
            <NuxtLink
              to="/quote"
              class="group relative mt-4 h-12 ps-2 pe-4 overflow-hidden rounded-xl bg-[#7030A0] text-white text-base font-bold flex items-center gap-3 shadow-md shadow-[#7030A0]/25 transition-all duration-300 ease-out hover:bg-[#5b2486] hover:shadow-lg hover:shadow-[#7030A0]/40 active:scale-[0.99] active:bg-[#4c1d73] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7030A0]/60 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
              ></span>

              <span class="relative w-8 h-8 rounded-lg bg-amber-400 text-[#3b1259] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-amber-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                <i class="pi pi-file-edit text-sm"></i>
              </span>
              <span class="relative flex-1">صانع عروض الأسعار</span>
              <i class="relative pi pi-arrow-left text-sm transition-transform duration-300 group-hover:-translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"></i>
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  exact?: boolean;
  /** Not active when the current path starts with this (e.g. /admin/plots vs /admin/plots/new) */
  notWhen?: string;
}

const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);
const loggingOut = ref(false);
const scrolled = ref(false);
const openGroup = ref<string | null>(null);
const mobileOpenGroup = ref<string | null>(null);

const { user: authUser, isAdmin, refreshAuth, clearAuth, canAny } = useAuthSession();
const adminUser = computed(() => (isAdmin.value ? authUser.value : null));

type PermList = Parameters<typeof canAny>[0];

interface EmployeeLink extends NavItem {
  /** The link shows if the employee has ANY of these permissions */
  anyOf: PermList;
}

interface EmployeeGroup {
  id: string;
  label: string;
  icon: string;
  links: EmployeeLink[];
}

// Public pages
const navItems: NavItem[] = [
  { to: '/', label: 'الرئيسية', icon: 'pi pi-home', exact: true },
  { to: '/plots', label: 'جدول القطع', icon: 'pi pi-th-large' },
  { to: '/blocks', label: 'البلوكات', icon: 'pi pi-objects-column' },
  { to: '/zones', label: 'الزونات', icon: 'pi pi-map' },
];

/**
 * Employee menu, grouped by section. A section with one permitted link shows
 * as a plain link; with several it becomes a dropdown (an accordion on mobile).
 * Links marked ASSUMED point to routes I could not see in your project;
 * change `to` to your real route. A link whose route does not exist is
 * hidden automatically (see routeExists below).
 */
const employeeGroupDefs: EmployeeGroup[] = [
  {
    id: 'stats',
    label: 'الإحصائيات',
    icon: 'pi pi-chart-bar',
    links: [{ to: '/', label: 'الإحصائيات', icon: 'pi pi-chart-bar', exact: true, anyOf: ['view_stats'] }],
  },
  {
    id: 'plots',
    label: 'القطع',
    icon: 'pi pi-th-large',
    links: [
      { to: '/plots', label: 'جدول القطع', icon: 'pi pi-th-large', anyOf: ['view_plots', 'view_plot_page'] },
      {
        to: '/admin/plots',
        label: 'إدارة القطع',
        icon: 'pi pi-pencil',
        notWhen: '/admin/plots/new',
        anyOf: ['edit_plots', 'delete_plots', 'edit_plot_page', 'delete_plot_page'],
      },
      { to: '/admin/plots/new', label: 'إضافة قطعة', icon: 'pi pi-plus', anyOf: ['create_plots', 'create_plot_page'] },
    ],
  },
  {
    id: 'blocks',
    label: 'البلوكات',
    icon: 'pi pi-objects-column',
    links: [
      { to: '/blocks', label: 'البلوكات', icon: 'pi pi-objects-column', anyOf: ['view_block_page'] },
      // ASSUMED routes
      {
        to: '/admin/blocks',
        label: 'إدارة البلوكات',
        icon: 'pi pi-pencil',
        notWhen: '/admin/blocks/new',
        anyOf: ['edit_block_page', 'delete_block_page'],
      },
      { to: '/admin/blocks/new', label: 'إضافة بلوك', icon: 'pi pi-plus', anyOf: ['create_block_page'] },
    ],
  },
  {
    id: 'zones',
    label: 'الزونات',
    icon: 'pi pi-map',
    links: [
      { to: '/zones', label: 'الزونات', icon: 'pi pi-map', anyOf: ['view_zone_page'] },
      // ASSUMED routes
      {
        to: '/admin/zones',
        label: 'إدارة الزونات',
        icon: 'pi pi-pencil',
        notWhen: '/admin/zones/new',
        anyOf: ['edit_zone_page', 'delete_zone_page'],
      },
      { to: '/admin/zones/new', label: 'إضافة زون', icon: 'pi pi-plus', anyOf: ['create_zone_page'] },
    ],
  },
  {
    id: 'contracts',
    label: 'العقود',
    icon: 'pi pi-file',
    // ASSUMED route (contract pages themselves are /contracts/[plotNo])
    links: [{ to: '/contracts', label: 'العقود', icon: 'pi pi-file', anyOf: ['view_contracts', 'edit_contracts'] }],
  },
  {
    id: 'export',
    label: 'تصدير البيانات',
    icon: 'pi pi-download',
    // ASSUMED route
    links: [{ to: '/admin/export', label: 'تصدير البيانات', icon: 'pi pi-download', anyOf: ['export_data'] }],
  },
];

// True only if the router has a page for this path, so guessed links never lead to a 404
const routeExists = (path: string) => router.resolve(path).matched.length > 0;

// Keep only the links the employee may use; drop sections left empty
const employeeGroups = computed<EmployeeGroup[]>(() =>
  employeeGroupDefs
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => canAny(link.anyOf) && routeExists(link.to)),
    }))
    .filter((group) => group.links.length > 0)
);

// Many sections → icon-only on md/lg, labels from xl
const dense = computed(() => employeeGroups.value.length > 4);

// Admin tools. Add more here as the admin area grows.
const adminLinks: NavItem[] = [
  { to: '/admin', label: 'لوحة الإدارة', icon: 'pi pi-sliders-h', exact: true },
  { to: '/admin/employees', label: 'الموظفون والصلاحيات', icon: 'pi pi-users' },
  { to: '/quote', label: 'صانع عروض الأسعار', icon: 'pi pi-file-edit' },
];

const matchesPath = (currentPath: string, targetPath: string) =>
  currentPath === targetPath || currentPath.startsWith(`${targetPath.replace(/\/$/, '')}/`);

const isActive = (item: NavItem) => {
  if (item.exact) return route.path === item.to;
  if (item.notWhen && matchesPath(route.path, item.notWhen)) return false;
  return matchesPath(route.path, item.to);
};

const isGroupActive = (group: EmployeeGroup) => group.links.some((link) => isActive(link));

const toggleGroup = (id: string) => {
  openGroup.value = openGroup.value === id ? null : id;
};

const handleLogout = async () => {
  if (loggingOut.value) return;

  loggingOut.value = true;

  try {
    // Attempt to invalidate the server session.
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (err) {
    console.error('Logout API failed:', err);
  } finally {
    // Always clear the local authentication state.
    clearAuth();

    // Close all navigation menus.
    mobileMenuOpen.value = false;
    openGroup.value = null;
    mobileOpenGroup.value = null;

    // Always return to the public home page.
    await navigateTo('/', {
      replace: true,
      external: false,
    });

    loggingOut.value = false;
  }
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    mobileMenuOpen.value = false;
    openGroup.value = null;
    mobileOpenGroup.value = null;
  }
};
const onDocClick = () => {
  openGroup.value = null;
};
const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};

onMounted(() => {
  refreshAuth();
  onScroll();
  document.addEventListener('keydown', onKey);
  document.addEventListener('click', onDocClick);
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('click', onDocClick);
  window.removeEventListener('scroll', onScroll);
});

/* Close menus on navigation, and re-check auth (so the header updates right after login) */
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    openGroup.value = null;
    mobileOpenGroup.value = null;
    refreshAuth();
  }
);

/* When the mobile drawer opens, expand the section that holds the current page */
watch(mobileMenuOpen, (open) => {
  if (open) {
    mobileOpenGroup.value =
      employeeGroups.value.find((g) => g.links.length > 1 && isGroupActive(g))?.id ?? null;
  }
});
</script>