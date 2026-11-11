<template>
  <footer class="bg-slate-900 text-slate-300 py-10 mt-16 border-t border-slate-800 print:hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Brand & Description -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-[#7030A0] flex items-center justify-center text-white font-bold text-xl">
              <i class="pi pi-building"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">{{ projectConfig.name }}</h3>
              <p class="text-xs text-slate-400">مخطط معتمد برقم {{ projectConfig.planNo }}</p>
            </div>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            منظومة مبيعات وعروض أسعار متكاملة لمشروع مخطط المها (مها الشرق)، تتيح للعملاء وفريق المبيعات استعراض الأراضي والبلوكات واستخراج عروض الأسعار الرسمية فورياً.
          </p>
        </div>

        <!-- Project Parties -->
        <div>
          <h4 class="text-white font-semibold mb-3">أطراف المشروع</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <span class="text-slate-200 font-medium">الجهة المالكة/البائع:</span>
              <span>{{ projectConfig.seller }}</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-slate-200 font-medium">المسوق الحصري:</span>
              <span>{{ projectConfig.marketer }}</span>
            </li>
            <!-- <li class="flex items-center gap-2">
              <span class="text-slate-200 font-medium">المصدر الحي للبيانات:</span>
              <span>جدول Google Sheets المعتمد</span>
            </li> -->
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-3">روابط سريعة</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <NuxtLink to="/" class="hover:text-white transition-colors">الرئيسية</NuxtLink>
            <NuxtLink to="/plots" class="hover:text-white transition-colors">جدول القطع</NuxtLink>
            <!-- <NuxtLink to="/blocks" class="hover:text-white transition-colors">البلوكات</NuxtLink>
            <NuxtLink to="/zones" class="hover:text-white transition-colors">الزونات</NuxtLink> -->
            <NuxtLink to="/quote" class="hover:text-white transition-colors">صانع العروض</NuxtLink>
            <NuxtLink to="/login" class="hover:text-white transition-colors">بوابة الإدارة</NuxtLink>
          </div>
        </div>
      </div>


      <div class="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          جميع الحقوق محفوظة © {{ new Date().getFullYear() }} — {{ projectConfig.marketer }}
        </div>
        <div>
          بوابة مبيعات مخطط المها • إصدار الإنتاج المعتمد
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { projectConfig } from '../../config/project';
</script>
