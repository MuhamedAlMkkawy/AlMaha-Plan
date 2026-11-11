<template>
  <header class="sticky top-0 z-40 print:hidden">
    <!-- Admin session strip (only when logged in as admin) -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-full"
      leave-active-class="transition-all duration-200"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div v-if="adminUser" class="bg-gradient-to-l from-[#3b1659] via-[#532277] to-[#3b1659] text-purple-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span class="relative flex w-2 h-2 shrink-0">
              <span class="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping"></span>
              <span class="relative inline-flex w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
            <span class="font-semibold">جلسة إدارة نشطة</span>
            <span class="hidden sm:inline text-purple-300/80 truncate dir-ltr" dir="ltr">{{ adminUser.email }}</span>
          </div>

          <div class="flex items-center gap-1">
            <NuxtLink
              to="/admin"
              class="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1.5 font-medium"
            >
              <i class="pi pi-sliders-h text-[11px]"></i>
              <span>لوحة الإدارة</span>
            </NuxtLink>
            <span class="w-px h-3.5 bg-white/20 mx-1"></span>
            <button
              type="button"
              @click="handleLogout"
              class="px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1.5 font-medium"
            >
              <i class="pi pi-sign-out text-[11px]"></i>
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-[72px] gap-4">
          <!-- Logo and Project Brand -->
          <NuxtLink to="/" class="flex items-center gap-3 group min-w-0">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7030A0] to-[#532277] flex items-center justify-center text-white shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform shrink-0">
              <i class="pi pi-building text-xl"></i>
            </div>
            <div class="min-w-0">
              <div class="text-lg font-bold text-slate-900 group-hover:text-[#7030A0] transition-colors leading-tight truncate">
                {{ projectConfig.name }}
              </div>
              <div class="text-xs text-slate-500 font-medium truncate">
                مخطط رقم {{ projectConfig.planNo }} • {{ projectConfig.marketer }}
              </div>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              :class="isActive(item) ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </NuxtLink>

            <NuxtLink
              to="/quote"
              class="ms-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border"
              :class="route.path.startsWith('/quote')
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'"
            >
              <i class="pi pi-file-edit"></i>
              <span>صانع عروض الأسعار</span>
            </NuxtLink>
          </nav>

          <!-- Account area -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Auth check skeleton (prevents flicker) -->
            <div v-if="!authChecked" class="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>

            <!-- Logged-in admin menu -->
            <div v-else-if="adminUser" ref="menuRoot" class="relative">
              <button
                type="button"
                @click="userMenuOpen = !userMenuOpen"
                :aria-expanded="userMenuOpen"
                aria-haspopup="menu"
                class="flex items-center gap-2.5 ps-1.5 pe-3 py-1.5 rounded-full border bg-white transition-all"
                :class="userMenuOpen
                  ? 'border-[#7030A0] ring-4 ring-[#7030A0]/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'"
              >
                <span class="relative">
                  <span class="w-8 h-8 rounded-full bg-gradient-to-br from-[#7030A0] to-[#532277] text-white text-sm font-bold flex items-center justify-center">
                    {{ initial }}
                  </span>
                  <span class="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                </span>
                <span class="hidden sm:block text-start leading-tight">
                  <span class="block text-xs font-bold text-slate-900 max-w-[110px] truncate">{{ displayName }}</span>
                  <span class="block text-[10px] font-semibold text-[#7030A0]">مسؤول النظام</span>
                </span>
                <i class="pi pi-chevron-down text-[10px] text-slate-400 transition-transform" :class="userMenuOpen ? 'rotate-180' : ''"></i>
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 scale-95 -translate-y-1"
                leave-active-class="transition duration-100 ease-in"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="userMenuOpen"
                  role="menu"
                  class="absolute end-0 mt-2 w-72 origin-top-left rtl:origin-top-left bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden"
                >
                  <!-- Identity -->
                  <div class="p-4 bg-gradient-to-br from-purple-50 to-white border-b border-slate-100 flex items-center gap-3">
                    <span class="w-11 h-11 rounded-full bg-gradient-to-br from-[#7030A0] to-[#532277] text-white text-base font-bold flex items-center justify-center shrink-0">
                      {{ initial }}
                    </span>
                    <div class="min-w-0">
                      <div class="text-sm font-bold text-slate-900 truncate">{{ displayName }}</div>
                      <div class="text-xs text-slate-500 truncate" dir="ltr">{{ adminUser.email }}</div>
                      <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#7030A0]/10 text-[#7030A0] text-[10px] font-bold">
                        <i class="pi pi-shield text-[9px]"></i>
                        مسؤول النظام
                      </span>
                    </div>
                  </div>

                  <!-- Links -->
                  <div class="p-2">
                    <NuxtLink
                      v-for="link in adminLinks"
                      :key="link.to"
                      :to="link.to"
                      role="menuitem"
                      class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7030A0] transition-colors"
                    >
                      <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                        <i :class="link.icon" class="text-sm"></i>
                      </span>
                      <span>{{ link.label }}</span>
                    </NuxtLink>
                  </div>

                  <div class="p-2 border-t border-slate-100">
                    <button
                      type="button"
                      role="menuitem"
                      @click="handleLogout"
                      :disabled="loggingOut"
                      class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60"
                    >
                      <span class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                        <i :class="loggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'" class="text-sm"></i>
                      </span>
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Guest -->
            <!-- <NuxtLink
              v-else
              to="/login"
              class="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#7030A0] hover:bg-slate-100 transition-colors flex items-center gap-2 border border-slate-200"
            >
              <i class="pi pi-lock"></i>
              <span>دخول الإدارة</span>
            </NuxtLink> -->

            <!-- Mobile Menu Button -->
            <button
              type="button"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen"
              aria-label="القائمة"
              class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Drawer -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-100 flex flex-col gap-1.5">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors"
              :class="isActive(item) ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-700 hover:bg-slate-100'"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </NuxtLink>

            <NuxtLink
              to="/quote"
              class="px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 flex items-center gap-3"
            >
              <i class="pi pi-file-edit"></i>
              <span>صانع عروض الأسعار</span>
            </NuxtLink>

            <!-- Admin block on mobile -->
            <div v-if="adminUser" class="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
              <div class="px-4 py-3 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-gradient-to-br from-[#7030A0] to-[#532277] text-white font-bold flex items-center justify-center shrink-0">
                  {{ initial }}
                </span>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-slate-900 truncate">{{ displayName }}</div>
                  <div class="text-xs text-slate-500 truncate" dir="ltr">{{ adminUser.email }}</div>
                </div>
              </div>

              <NuxtLink
                v-for="link in adminLinks"
                :key="link.to"
                :to="link.to"
                class="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
              >
                <i :class="link.icon"></i>
                <span>{{ link.label }}</span>
              </NuxtLink>

              <button
                type="button"
                @click="handleLogout"
                class="w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
              >
                <i class="pi pi-sign-out"></i>
                <span>تسجيل الخروج</span>
              </button>
            </div>
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
}

const route = useRoute();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const loggingOut = ref(false);
const authChecked = ref(false);
const menuRoot = ref<HTMLElement | null>(null);

const adminUser = ref<{ email: string; name?: string } | null>(null);

const navItems: NavItem[] = [
  { to: '/', label: 'الرئيسية', icon: 'pi pi-home', exact: true },
  { to: '/plots', label: 'جدول القطع', icon: 'pi pi-th-large' },
  { to: '/blocks', label: 'البلوكات', icon: 'pi pi-objects-column' },
  { to: '/zones', label: 'الزونات', icon: 'pi pi-map' },
];

// Add more admin shortcuts here as the admin area grows.
const adminLinks = [
  { to: '/admin', label: 'لوحة الإدارة', icon: 'pi pi-sliders-h' },
  { to: '/quote', label: 'صانع عروض الأسعار', icon: 'pi pi-file-edit' },
];

const isActive = (item: NavItem) =>
  item.exact ? route.path === item.to : route.path.startsWith(item.to);

const displayName = computed(() => {
  const u = adminUser.value;
  if (!u) return '';
  return u.name?.trim() || u.email.split('@')[0];
});

const initial = computed(() => (displayName.value.charAt(0) || 'A').toUpperCase());

const checkAuth = async () => {
  try {
    const res = await $fetch<{ authenticated: boolean; user: any }>('/api/auth/me');
    adminUser.value = res.authenticated ? res.user : null;
  } catch {
    adminUser.value = null;
  } finally {
    authChecked.value = true;
  }
};

const handleLogout = async () => {
  loggingOut.value = true;
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    adminUser.value = null;
    userMenuOpen.value = false;
    mobileMenuOpen.value = false;
    await navigateTo('/');
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    loggingOut.value = false;
  }
};

/* Close dropdown on outside click / Escape */
const onDocClick = (e: MouseEvent) => {
  if (userMenuOpen.value && menuRoot.value && !menuRoot.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    userMenuOpen.value = false;
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  checkAuth();
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKey);
});

/* Close menus on navigation, and re-check auth (so the header updates right after login) */
watch(
  () => route.path,
  () => {
    userMenuOpen.value = false;
    mobileMenuOpen.value = false;
    checkAuth();
  }
);
</script>