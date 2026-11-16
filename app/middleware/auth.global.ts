import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRuntimeConfig,
} from 'nuxt/app';

import {
  employeePermissionForPublicPath,
  firstAllowedPath,
  getRouteAccess,
  userCanAny,
} from '../../shared/access';

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();

  // Admin login path (e.g. /c66dc3312779fefa)
  const loginPath = String(config.public.loginPath || '/c66dc3312779fefa');
  // Employee login path (e.g. /3fe97eb46687f5af)
  const employeeLoginPath = String(
    config.public.employeeLoginPath || '/3fe97eb46687f5af'
  );
  const homePath = '/';

  // 1. Routes accessible without authentication
  const openPaths = new Set([
    homePath,
    loginPath,
    employeeLoginPath,
    '/portal',
    '/no-access',
  ]);

  // Load authentication state first
  const { refreshAuth, user, isAdmin, isEmployee, permissions, can } =
    useAuthSession();

  if (!user.value) {
    await refreshAuth();
  }

  // If visitor is on the public open paths
  if (openPaths.has(to.path)) {
    // If authenticated user visits the employee login page, redirect them inside
    if (to.path === employeeLoginPath && user.value) {
      if (isAdmin.value) return navigateTo('/admin', { replace: true });
      const fallback = firstAllowedPath(permissions.value);
      return navigateTo(fallback || '/no-access', { replace: true });
    }

    // Special check for root "/":
    // If authenticated employee visits "/", check if they have 'view_stats'
    if (to.path === homePath && isEmployee.value) {
      if (!can('view_stats')) {
        const fallback = firstAllowedPath(permissions.value);
        return navigateTo(fallback && fallback !== '/' ? fallback : '/no-access', { replace: true });
      }
    }

    return;
  }

  // 2. Unauthenticated visitor trying to access internal routes -> redirect to employee login page with redirect param
  if (!user.value) {
    // Keep internal redirect query parameter so user returns after login
    const redirectQuery = to.fullPath !== '/' ? { redirect: to.fullPath } : undefined;
    return navigateTo(
      {
        path: employeeLoginPath,
        query: redirectQuery,
      },
      { replace: true }
    );
  }

  // 3. Admin has full access to all routes
  if (isAdmin.value) {
    return;
  }

  // 4. Authenticated but not employee role (and not admin)
  if (!isEmployee.value) {
    return navigateTo(employeeLoginPath, { replace: true });
  }

  // Helper for unauthorized employee fallback
  const redirectToFallback = () => {
    const fallback = firstAllowedPath(permissions.value);
    if (fallback && fallback !== to.path) {
      return navigateTo(fallback, { replace: true });
    }
    return navigateTo('/no-access', { replace: true });
  };

  // 5. Determine route access requirements from access rules
  const access = getRouteAccess(to.path);

  // Admin-only routes (/admin, /admin/employees, /admin/audit)
  if (access.type === 'admin') {
    return redirectToFallback();
  }

  // Routes with explicit permission requirements
  if (access.type === 'permission') {
    return userCanAny(user.value, access.anyOf)
      ? undefined
      : redirectToFallback();
  }

  // Internal application routes that require specific employee permissions
  const requiredPermissions = employeePermissionForPublicPath(to.path);

  if (!requiredPermissions?.length) {
    return navigateTo('/no-access', { replace: true });
  }

  if (userCanAny(user.value, requiredPermissions)) {
    return;
  }

  // Unauthorized employee
  return redirectToFallback();
});
