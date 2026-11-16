<template>
  <footer class="relative mt-20 border-t border-[#E5E9E5] bg-[#174A40] text-white print:hidden">
    <!-- Sand Gold accent line -->
    <div class="h-[3px] w-full bg-gradient-to-l from-[#B89A68] via-[#D8C5A0] to-[#B89A68]"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        <!-- Column 1: Brand & identity -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#126B58] flex items-center justify-center text-white border border-[#B89A68]/30">
              <i class="pi pi-building text-lg"></i>
            </div>
            <div>
              <h3 class="font-black text-lg text-white">{{ projectConfig.name }}</h3>
              <p class="text-xs text-[#D8C5A0] font-semibold">مخطط معتمد برقم {{ projectConfig.planNo }}</p>
            </div>
          </div>
          <p class="text-xs text-[#D5E4DC]/80 leading-relaxed max-w-sm">
            بوابة إدارة المبيعات وعروض الأسعار الرسمية لمشروع مخطط المها، مصممة وفق أحدث المعايير العقارية لدعم فريق المبيعات والإدارة.
          </p>
        </div>


<!-- Column 2: Entities & Partners -->
<div class="relative space-y-4">

  <!-- Section Heading -->
  <div class="flex items-center gap-3">
    <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D8C5A0]/10 ring-1 ring-[#D8C5A0]/20">
      <i class="pi pi-building text-sm text-[#D8C5A0]"></i>
    </div>

    <div class="space-y-0.5">
      <h4 class="text-sm font-extrabold tracking-wide text-white">
        الجهات المشرفة
      </h4>
      <p class="text-[10px] font-medium text-white/45">
        الجهات المسؤولة عن المشروع
      </p>
    </div>
  </div>

  <!-- Entity Cards -->
  <div class="grid grid-cols-1 gap-2.5">

    <!-- Seller -->
    <div
      class="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-3.5 transition-all duration-300 hover:border-[#D8C5A0]/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/10"
    >
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D8C5A0]/15 bg-[#D8C5A0]/[0.09] transition-all duration-300 group-hover:border-[#D8C5A0]/30 group-hover:bg-[#D8C5A0]/15"
      >
        <i class="pi pi-briefcase text-base text-[#D8C5A0]"></i>
      </div>

      <div class="min-w-0 flex-1 space-y-1">
        <span class="block text-[10px] font-semibold tracking-wide text-white/45">
          الجهة المالكة / البائع
        </span>
        <span class="block truncate text-[13px] font-bold leading-relaxed text-white">
          {{ projectConfig.seller }}
        </span>
      </div>

      <i class="pi pi-angle-left shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D8C5A0]"></i>

      <div class="absolute bottom-0 right-0 h-[2px] w-0 bg-[#D8C5A0]/70 transition-all duration-300 group-hover:w-full"></div>
    </div>

    <!-- Exclusive Marketer -->
    <div
      class="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-3.5 transition-all duration-300 hover:border-[#D8C5A0]/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/10"
    >
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D8C5A0]/15 bg-[#D8C5A0]/[0.09] transition-all duration-300 group-hover:border-[#D8C5A0]/30 group-hover:bg-[#D8C5A0]/15"
      >
        <i class="pi pi-megaphone text-base text-[#D8C5A0]"></i>
      </div>

      <div class="min-w-0 flex-1 space-y-1">
        <span class="block text-[10px] font-semibold tracking-wide text-white/45">
          المسوق الحصري
        </span>
        <span class="block truncate text-[13px] font-bold leading-relaxed text-white">
          {{ projectConfig.marketer }}
        </span>
      </div>

      <i class="pi pi-angle-left shrink-0 text-xs text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D8C5A0]"></i>

      <div class="absolute bottom-0 right-0 h-[2px] w-0 bg-[#D8C5A0]/70 transition-all duration-300 group-hover:w-full"></div>
    </div>

  </div>
</div>



  <!-- Column 3: Quick Links & Portal Access -->
  <div class="relative space-y-4">

    <!-- Section Heading -->
    <div class="flex items-center gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D8C5A0]/20 bg-[#D8C5A0]/10">
        <i class="pi pi-compass text-sm text-[#D8C5A0]"></i>
      </div>

      <div class="space-y-0.5">
        <h4 class="text-sm font-extrabold tracking-wide text-white">
          روابط البوابة
        </h4>
        <p class="text-[10px] font-medium text-white/45">
          الوصول السريع إلى خدمات البوابة
        </p>
      </div>
    </div>

    <!-- Navigation Links -->
    <ul class="space-y-2">

      <!-- Homepage -->
      <li>
        <NuxtLink
          to="/"
          class="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-white/[0.09] hover:bg-white/[0.06]"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/55 transition-all duration-300 group-hover:bg-[#D8C5A0]/10 group-hover:text-[#D8C5A0]"
          >
            <i class="pi pi-home text-sm"></i>
          </span>

          <span class="flex-1 text-xs font-semibold text-white/65 transition-colors duration-300 group-hover:text-white">
            الرئيسية
          </span>

          <i class="pi pi-angle-left text-[10px] text-white/20 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D8C5A0]"></i>
        </NuxtLink>
      </li>

      <!-- Employee Portal -->
      <li>
        <NuxtLink
          to="/3fe97eb46687f5af"
          class="group flex items-center gap-3 rounded-xl border border-[#D8C5A0]/15 bg-[#D8C5A0]/[0.06] px-3 py-2.5 transition-all duration-300 hover:border-[#D8C5A0]/30 hover:bg-[#D8C5A0]/[0.10]"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D8C5A0]/15 bg-[#D8C5A0]/10 text-[#D8C5A0] transition-all duration-300 group-hover:bg-[#D8C5A0]/20"
          >
            <i class="pi pi-user text-sm"></i>
          </span>

          <span class="flex-1 space-y-0.5">
            <span class="block text-xs font-bold text-white transition-colors group-hover:text-[#E8D8B8]">
              بوابة دخول الموظفين
            </span>
            <span class="block text-[9px] font-medium text-white/40">
              الدخول إلى حساب الموظف
            </span>
          </span>

          <i class="pi pi-angle-left text-[10px] text-[#D8C5A0]/50 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#D8C5A0]"></i>
        </NuxtLink>
      </li>

      <!-- Admin Portal: Temporarily Hidden -->
      <!--
      <li>
        <NuxtLink
          to="/c66dc3312779fefa"
          class="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-white/[0.09] hover:bg-white/[0.06]"
        >
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/45">
            <i class="pi pi-shield text-sm"></i>
          </span>

          <span class="flex-1 text-xs font-semibold text-white/55">
            دخول الإدارة
          </span>

          <i class="pi pi-angle-left text-[10px] text-white/20"></i>
        </NuxtLink>
      </li>
      -->

    </ul>
  </div>

      </div>

      <!-- Copyright row -->
      <div class="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D5E4DC]/60">
        <p>جميع الحقوق محفوظة © {{ new Date().getFullYear() }} — {{ projectConfig.name }}</p>
        <p class="text-[11px] font-medium text-[#D8C5A0]/80">التسويق الحصري: {{ projectConfig.marketer }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';
</script>
