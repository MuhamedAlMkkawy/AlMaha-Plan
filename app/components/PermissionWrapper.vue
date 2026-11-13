<template>
  <slot v-if="hasPermission" />
</template>

<script setup lang="ts">
import { useAuthSession } from '@/composables/useAuthSession';
import type { EmployeePermission } from '@/../shared/types/employee';

const props = defineProps<{ permission: EmployeePermission | EmployeePermission[] }>();

const { can, canAny } = useAuthSession();

const hasPermission = computed(() => {
  if (Array.isArray(props.permission)) {
    return canAny(props.permission);
  }
  return can(props.permission);
});
</script>

