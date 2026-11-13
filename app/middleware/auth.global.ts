import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from 'nuxt/app';
import {
  employeePermissionForPublicPath,
  firstAllowedPath,
  getRouteAccess,
  userCanAny,
} from '../../shared/access';

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const loginPath = String(config.public.loginPath || '/login');
  const employeeLoginPath = String(config.public.employeeLoginPath || '/portal');

  const openPaths = new Set([
    loginPath,
    employeeLoginPath,
    '/portal',
    '/no-access',
  ]);

  if (openPaths.has(to.path)) return;

  const { refreshAuth, user, isAdmin, isEmployee, permissions } = useAuthSession();

  if (!user.value) {
    await refreshAuth();
  }

  const access = getRouteAccess(to.path);

  if (isAdmin.value) return;

  if (access.type === 'admin') {
    if (isEmployee.value) {
      return navigateTo(firstAllowedPath(permissions.value), { replace: true });
    }
    return navigateTo(loginPath);
  }

  if (access.type === 'permission') {
    if (isEmployee.value && userCanAny(user.value, access.anyOf)) {
      return;
    }
    if (isEmployee.value) {
      return navigateTo(firstAllowedPath(permissions.value), { replace: true });
    }
    return navigateTo(loginPath);
  }

  if (isEmployee.value) {
    const needed = employeePermissionForPublicPath(to.path);
    if (needed && !userCanAny(user.value, needed)) {
      const fallback = firstAllowedPath(permissions.value);
      if (fallback === to.path) {
        return navigateTo('/no-access', { replace: true });
      }
      return navigateTo(fallback, { replace: true });
    }
  }
});
