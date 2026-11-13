import { computed } from 'vue';
import { useState } from '#app';

import type { EmployeePermission } from '../../shared/types/employee';

import {
  effectivePermissions,
  firstAllowedPath,
  userCan,
  userCanAny,
  type AuthLike,
} from '../../shared/access';

export function useAuthSession() {
  const user = useState<AuthLike>('auth-user', () => null);
  const loaded = useState<boolean>('auth-loaded', () => false);

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isEmployee = computed(() => user.value?.role === 'employee');

  const permissions = computed<EmployeePermission[]>(() =>
    effectivePermissions(user.value)
  );

  const can = (permission: EmployeePermission) =>
    userCan(user.value, permission);

  const canAny = (perms: EmployeePermission[]) =>
    userCanAny(user.value, perms);

  const homePath = computed(() => {
    if (isAdmin.value) return '/admin';

    if (isEmployee.value) {
      return firstAllowedPath(permissions.value);
    }

    return '/';
  });

  const refreshAuth = async () => {
    try {
      const res = await $fetch<{
        authenticated: boolean;
        user: AuthLike;
        permissions?: EmployeePermission[];
      }>('/api/auth/me');

      if (res.authenticated && res.user) {
        user.value = {
          ...res.user,
          permissions:
            res.permissions ??
            res.user.permissions ??
            [],
        };
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    } finally {
      loaded.value = true;
    }
  };

  const clearAuth = () => {
    user.value = null;
    loaded.value = true;
  };

  return {
    user,
    loaded,
    isAdmin,
    isEmployee,
    permissions,
    can,
    canAny,
    homePath,
    refreshAuth,
    clearAuth,
  };
}
