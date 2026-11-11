<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo and Project Brand -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7030A0] to-[#532277] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <i class="pi pi-building text-2xl"></i>
            </div>
            <div>
              <div class="text-xl font-bold text-slate-900 group-hover:text-[#7030A0] transition-colors leading-tight">
                {{ projectConfig.name }}
              </div>
              <div class="text-xs text-slate-500 font-medium">
                مخطط رقم {{ projectConfig.planNo }} • {{ projectConfig.marketer }}
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            :class="route.path === '/' ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <i class="pi pi-home"></i>
            <span>الرئيسية</span>
          </NuxtLink>

          <NuxtLink
            to="/plots"
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            :class="route.path.startsWith('/plots') ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <i class="pi pi-th-large"></i>
            <span>جدول القطع</span>
          </NuxtLink>

          <NuxtLink
            to="/blocks"
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            :class="route.path.startsWith('/blocks') ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <i class="pi pi-objects-column"></i>
            <span>البلوكات</span>
          </NuxtLink>

          <NuxtLink
            to="/zones"
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            :class="route.path.startsWith('/zones') ? 'bg-[#7030A0]/10 text-[#7030A0]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <i class="pi pi-map"></i>
            <span>الزونات</span>
          </NuxtLink>

          <NuxtLink
            to="/quote"
            class="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
          >
            <i class="pi pi-file-edit"></i>
            <span>صانع عروض الأسعار</span>
          </NuxtLink>
        </nav>

        <!-- Right Side: Admin Badge / Login -->
        <div class="flex items-center gap-3">
          <div v-if="adminUser" class="flex items-center gap-2">
            <NuxtLink
              to="/admin"
              class="px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#7030A0] text-white hover:bg-[#532277] transition-all flex items-center gap-2 shadow-sm"
            >
              <i class="pi pi-cog"></i>
              <span class="hidden sm:inline">لوحة الإدارة</span>
            </NuxtLink>
            <button
              @click="handleLogout"
              title="تسجيل الخروج"
              class="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            >
              <i class="pi pi-sign-out text-lg"></i>
            </button>
          </div>
          <div v-else>
            <NuxtLink
              to="/login"
              class="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#7030A0] hover:bg-slate-100 transition-colors flex items-center gap-2 border border-slate-200"
            >
              <i class="pi pi-lock"></i>
              <span>دخول الإدارة</span>
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-100 flex flex-col gap-2">
        <NuxtLink
          to="/"
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-home"></i>
          <span>الرئيسية</span>
        </NuxtLink>
        <NuxtLink
          to="/plots"
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-th-large"></i>
          <span>جدول القطع</span>
        </NuxtLink>
        <NuxtLink
          to="/blocks"
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-objects-column"></i>
          <span>البلوكات</span>
        </NuxtLink>
        <NuxtLink
          to="/zones"
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
        >
          <i class="pi pi-map"></i>
          <span>الزونات</span>
        </NuxtLink>
        <NuxtLink
          to="/quote"
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-800 bg-amber-50 flex items-center gap-2"
        >
          <i class="pi pi-file-edit"></i>
          <span>صانع عروض الأسعار</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';

const route = useRoute();
const mobileMenuOpen = ref(false);

const adminUser = ref<{ email: string; name?: string } | null>(null);

const checkAuth = async () => {
  try {
    const res = await $fetch<{ authenticated: boolean; user: any }>('/api/auth/me');
    if (res.authenticated) {
      adminUser.value = res.user;
    } else {
      adminUser.value = null;
    }
  } catch (err) {
    adminUser.value = null;
  }
};

onMounted(() => {
  checkAuth();
});

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    adminUser.value = null;
    navigateTo('/');
  } catch (err) {
    console.error('Logout failed:', err);
  }
};
</script>
