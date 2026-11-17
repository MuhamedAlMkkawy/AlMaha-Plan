<template>
  <div class="w-full space-y-6" dir="rtl" aria-busy="true" aria-label="جاري التحميل...">
    <!-- Header skeleton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E5E9E5]">
      <div class="space-y-3 flex-1">
        <FeaturesAppSkeleton width="40%" height="2rem" rounded="xl" />
        <FeaturesAppSkeleton width="65%" height="1rem" rounded="lg" />
      </div>
      <div class="flex items-center gap-2">
        <FeaturesAppSkeleton width="6rem" height="2.75rem" rounded="xl" />
        <FeaturesAppSkeleton width="7.5rem" height="2.75rem" rounded="xl" />
      </div>
    </div>

    <!-- KPI / Grid Cards Skeleton -->
    <div v-if="cardsCount > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <div
        v-for="i in cardsCount"
        :key="i"
        class="bg-white p-5 rounded-3xl border border-[#E5E9E5] space-y-3.5"
      >
        <div class="flex items-center justify-between">
          <FeaturesAppSkeleton width="45%" height="1rem" rounded="md" />
          <FeaturesAppSkeleton width="2.5rem" height="2.5rem" rounded="2xl" />
        </div>
        <FeaturesAppSkeleton width="60%" height="2.25rem" rounded="lg" />
        <FeaturesAppSkeleton width="75%" height="0.875rem" rounded="md" />
      </div>
    </div>

    <!-- Table Skeleton if rows > 0 -->
    <div v-if="rowsCount > 0" class="bg-white rounded-3xl border border-[#E5E9E5] overflow-hidden p-6 space-y-4">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <FeaturesAppSkeleton width="30%" height="1.5rem" rounded="lg" />
        <FeaturesAppSkeleton width="8rem" height="2.25rem" rounded="xl" />
      </div>
      <div class="space-y-3">
        <div
          v-for="r in rowsCount"
          :key="r"
          class="flex items-center gap-4 py-2"
        >
          <FeaturesAppSkeleton width="2rem" height="2rem" rounded="lg" />
          <FeaturesAppSkeleton width="25%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton width="20%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton width="20%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton width="15%" height="1.25rem" rounded="md" />
          <FeaturesAppSkeleton width="10%" height="1.5rem" rounded="full" class="ms-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    cardsCount?: number;
    rowsCount?: number;
  }>(),
  {
    cardsCount: 4,
    rowsCount: 6,
  }
);
</script>
