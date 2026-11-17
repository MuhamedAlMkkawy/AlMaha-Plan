<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        dir="rtl"
        @click.self="onCancel"
      >
        <div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl animate-scaleUp">
          <div class="p-6 text-center">
            <div
              class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              :class="iconBgClass"
            >
              <i :class="iconClass" class="text-2xl"></i>
            </div>
            <h3 class="mt-4 text-base font-black text-slate-900">{{ title }}</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-500 whitespace-pre-line">{{ message }}</p>
          </div>

          <div class="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
            <button
              type="button"
              @click="onCancel"
              class="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              {{ cancelText }}
            </button>

            <button
              type="button"
              @click="onConfirm"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold text-white transition active:scale-95"
              :class="confirmBtnClass"
            >
              <span>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
  }>(),
  {
    title: 'تأكيد الإجراء',
    message: 'هل أنت متأكد من رغبتك في المتابعة؟',
    confirmText: 'تأكيد',
    cancelText: 'إلغاء',
    variant: 'danger',
  }
);

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const onConfirm = () => emit('confirm');
const onCancel = () => emit('cancel');

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'bg-rose-50 text-rose-600';
    case 'warning': return 'bg-amber-50 text-amber-600';
    default: return 'bg-[#E5EEE9] text-[#126B58]';
  }
});

const iconClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'pi pi-trash';
    case 'warning': return 'pi pi-exclamation-triangle';
    default: return 'pi pi-check-circle';
  }
});

const confirmBtnClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20';
    case 'warning': return 'bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20';
    default: return 'bg-[#126B58] hover:bg-[#174A40] shadow-sm shadow-[#126B58]/20';
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scaleUp {
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
